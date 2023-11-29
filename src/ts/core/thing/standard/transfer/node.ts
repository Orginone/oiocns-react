import { ITransfer } from '.';
import { kernel, model, schema } from '../../../../base';
import { formatDate, generateUuid, sleep } from '../../../../base/common';
import { IWork } from '../../../work';
import { IForm } from '../form';
import { ITask, VisitedData } from './task';

/** 每个节点抽象 */
export interface INode<T extends model.Node = model.Node> {
  // 任务
  task: ITask;
  // 元数据
  metadata: T;
  // 开始运行
  executing(data: any, env?: model.KeyValue): Promise<VisitedData>;
}

const NodeMachine: model.Shift<model.NEvent, model.NStatus>[] = [
  { start: 'Stop', event: 'Start', end: 'Running' },
  { start: 'Running', event: 'Throw', end: 'Error' },
  { start: 'Running', event: 'Complete', end: 'Completed' },
];

export abstract class Node<T extends model.Node = model.Node> implements INode<T> {
  task: ITask;
  metadata: T;

  constructor(task: ITask, meta: T) {
    this.task = task;
    this.metadata = meta;
  }

  get id() {
    return this.metadata.id;
  }

  get code() {
    return this.metadata.code;
  }

  get command() {
    return this.task.command;
  }

  get transfer() {
    return this.task.transfer;
  }

  machine(event: model.NEvent, data: any) {
    for (const item of NodeMachine) {
      if (item.event == event && this.metadata.status == item.start) {
        this.metadata.status = item.end;
        this.command.emitter('running', event, data);
      }
    }
  }

  async executing(data: any, env?: model.KeyValue): Promise<VisitedData> {
    try {
      this.machine('Start', [this.metadata]);
      await sleep(500);
      if (this.metadata.preScript) {
        data = { ...data, ...this.transfer.running(this.metadata.preScript, data, env) };
      }
      let next = await this.function(data, env);
      if (this.metadata.postScript) {
        next = { ...next, ...this.transfer.running(this.metadata.postScript, next, env) };
      }
      const visitedData = { code: this.code, data: next };
      this.task.visitedNodes.set(this.id, visitedData);
      this.machine('Complete', [this.metadata]);
      return visitedData;
    } catch (error) {
      this.task.visitedNodes.set(this.id, { code: this.code, data: error });
      this.machine('Throw', [this.metadata, error]);
      throw error;
    } finally {
      this.command.emitter('environments', 'refresh');
    }
  }

  abstract function(data: { [key: string]: any }, env?: model.KeyValue): Promise<any>;
}

export class RequestNode extends Node<model.Request> {
  async function(_: any, env?: model.KeyValue): Promise<any> {
    return await this.transfer.request(this.metadata, env);
  }
}

export class TablesNode extends Node<model.Tables> {
  constructor(task: ITask, node: model.Tables) {
    super(task, node);
    this.forms = [];
    for (const formId of node.formIds) {
      this.forms.push(task.transfer.forms[formId]);
    }
  }
  forms: IForm[];

  async function(): Promise<{ [key: string]: schema.XThing[] }> {
    return new Promise((resolve, reject) => {
      try {
        const id = this.command.subscribe((type, cmd, args) => {
          if (type == 'data' && cmd == 'readingCall') {
            if (args instanceof Error) {
              reject(args);
            } else {
              resolve(args);
            }
            this.command.unsubscribe(id);
            return;
          }
        });
        this.command.emitter('data', 'reading', this.metadata);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class MappingNode extends Node<model.Mapping> {
  constructor(task: ITask, node: model.Mapping) {
    super(task, node);
    if (node.source) {
      this.source = task.transfer.forms[node.source];
    }
    if (node.target) {
      this.target = task.transfer.forms[node.target];
    }
  }
  source?: IForm;
  target?: IForm;

  async function(data: { array: any[] }): Promise<{ [id: string]: schema.XThing[] }> {
    if (!this.source) {
      throw new Error('未获取到原表单信息！');
    }
    if (!this.target) {
      throw new Error('未获取到目标表单信息！');
    }
    const things: schema.XThing[] = [];
    const sourceMap = new Map<string, schema.XAttribute>();
    this.source.attributes.forEach((attr) => sourceMap.set(attr.code, attr));
    for (let item of data.array) {
      let oldThing: { [key: string]: any } = {};
      let newThing: any = { id: item[this.metadata.idName] };
      Object.keys(item).forEach((key) => {
        if (sourceMap.has(key)) {
          const attr = sourceMap.get(key)!;
          oldThing[attr.id] = item[key];
        }
      });
      for (const mapping of this.metadata.mappings) {
        if (!oldThing[mapping.source] && oldThing[mapping.source] !== 0) {
          continue;
        }
        if (mapping.source in oldThing) {
          if (mapping.typeName && ['选择型', '分类型'].includes(mapping.typeName)) {
            const oldValue = oldThing[mapping.source];
            for (const mappingItem of mapping.mappings ?? []) {
              if (mappingItem.source == oldValue) {
                newThing[mapping.target] = mappingItem.target;
                break;
              }
            }
          } else {
            newThing[mapping.target] = oldThing[mapping.source];
          }
        }
      }
      things.push(newThing);
    }
    return { [this.target.id]: things };
  }
}

export class StoreNode extends Node<model.Store> {
  constructor(task: ITask, node: model.Store) {
    super(task, node);
    if (node.workId) {
      this.work = task.transfer.works[node.workId];
    }
  }
  work?: IWork;

  async function(data: { [key: string]: schema.XThing[] }): Promise<any> {
    if (!this.work) {
      throw new Error('未获取到办事定义！');
    }
    if (!this.work.node) {
      throw new Error('未定义办事节点！');
    }
    const apply = await this.work.createApply();
    if (!apply) {
      throw new Error('创建办事申请失败！');
    }
    const allForms = [...this.work.primaryForms, ...this.work.detailForms];
    const map = new Map<string, model.FormEditData>();
    for (const key of Object.keys(data)) {
      for (const form of allForms) {
        if (key == form.id) {
          const editForm: model.FormEditData = {
            before: [],
            after: [],
            formName: form.name,
            nodeId: this.work.node.id,
            creator: apply.belong.userId,
            createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
          };
          for (const item of data[key]) {
            if (!item.id) {
              const thing = await kernel.createThing(apply.belong.id, [], '');
              Object.assign(item, thing.data);
            }
            editForm.after.push(item);
          }
          map.set(key, editForm);
        }
      }
    }
    await apply.createApply(apply.belong.id, '自动写入', map);
    return data;
  }
}

export class TransferNode extends Node<model.SubTransfer> {
  constructor(task: ITask, node: model.SubTransfer) {
    super(task, node);
    if (node.transferId) {
      this.subTransfer = task.transfer.transfers[node.transferId];
    }
  }
  subTransfer?: ITransfer;

  async function(data: { [key: string]: any }): Promise<any> {
    if (!this.subTransfer) {
      throw new Error('未获取到迁移配置！');
    }
    let preTask = undefined;
    do {
      const visitDataArr = await this.subTransfer.execute(
        this.task.status,
        this.task.event,
        preTask,
        data,
      );
      if (visitDataArr?.visitedDataArr instanceof Error) {
        throw visitDataArr.visitedDataArr;
      }
      preTask = visitDataArr?.task;
      if (this.metadata.judge) {
        const res = this.transfer.running(
          this.metadata.judge,
          visitDataArr?.visitedDataArr,
          preTask?.metadata.env?.params,
        );
        if (res.success) {
          return visitDataArr?.visitedDataArr;
        }
      }
    } while (this.metadata.isSelfCirculation);
  }
}

export class FormNode extends Node<model.Form> {
  constructor(task: ITask, node: model.Form) {
    super(task, node);
    if (node.formId) {
      this.form = task.transfer.forms[node.formId];
    }
  }
  form?: IForm;

  async function(): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.form) {
          throw new Error('未获取到表单信息！');
        }
        const id = this.command.subscribe((type, cmd, args) => {
          if (type == 'data' && cmd == 'inputCall') {
            const data: { [key: string]: any } = {};
            for (const key in args) {
              for (const field of this.form!.fields) {
                if (field.id == key) {
                  data[field.name] = args[key];
                }
              }
            }
            this.command.unsubscribe(id);
            resolve(data);
          }
        });
        this.command.emitter('data', 'input', this.form);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export function createNode(task: ITask, node: model.Node): INode {
  switch (node.typeName) {
    case '子图':
      return new TransferNode(task, node as model.SubTransfer);
    case '存储':
      return new StoreNode(task, node as model.Store);
    case '映射':
      return new MappingNode(task, node as model.Mapping);
    case '表单':
      return new FormNode(task, node as model.Form);
    case '表格':
      return new TablesNode(task, node as model.Tables);
    case '请求':
      return new RequestNode(task, node as model.Request);
  }
}

export const getDefaultFormNode = (): model.Form => {
  return {
    id: generateUuid(),
    code: 'form',
    name: '表单',
    typeName: '表单',
  };
};

export const getDefaultTableNode = (): model.Tables => {
  return {
    id: generateUuid(),
    code: 'table',
    name: '表格',
    typeName: '表格',
    formIds: [],
  };
};

export const getDefaultRequestNode = (): model.Request => {
  return {
    id: generateUuid(),
    code: 'request',
    name: '请求',
    typeName: '请求',
    data: {
      uri: '',
      method: 'GET',
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      content: '',
    },
  };
};

export const getDefaultMappingNode = (): model.Mapping => {
  return {
    id: generateUuid(),
    code: 'mapping',
    name: '映射',
    typeName: '映射',
    idName: 'id',
    mappingType: 'OToI',
    mappings: [],
  };
};

export const getDefaultStoreNode = (): model.Store => {
  return {
    id: generateUuid(),
    code: 'store',
    name: '存储',
    typeName: '存储',
    workId: '',
  };
};

export const getDefaultTransferNode = (): model.SubTransfer => {
  return {
    id: generateUuid(),
    code: 'transfer',
    name: '子图',
    typeName: '子图',
    transferId: '',
    isSelfCirculation: false,
  };
};
