/* eslint-disable no-unused-vars */
import { Command, common, kernel, model } from '../../../../base';
import { IDirectory } from '../../directory';
import { IStandardFileInfo, StandardFileInfo } from '../../fileinfo';
import { Application, IApplication } from '../application';
import { Form, IForm } from '../form';
import { ITask, Task, VisitedData } from './task';
import { IWork } from '../../../work';

type NullableString = string | undefined;

type VisitedReturn = { task: ITask; visitedDataArr: VisitedData[] | Error };

export interface ITransfer extends IStandardFileInfo<model.Transfer> {
  /** 触发器 */
  command: Command;
  /** 节点 */
  nodes: model.Node[];
  /** 边 */
  edges: model.Edge[];
  /** 环境 */
  envs: model.Environment[];
  /** 任务记录 */
  taskList: ITask[];
  /** 当前环境 */
  curEnv?: model.Environment;
  /** 当前任务 */
  curTask?: ITask;
  /** 当前状态 */
  status: model.GStatus;
  /** 关联的表单 */
  forms: { [id: string]: IForm };
  /** 加载表单 */
  loadForms(formIds?: NullableString[]): Promise<void>;
  /** 关联的迁移配置 */
  transfers: { [id: string]: ITransfer };
  /** 加载迁移配置 */
  loadTransfers(transferIds?: NullableString[]): Promise<void>;
  /** 关联的应用 */
  applications: { [id: string]: IApplication };
  /** 关联的办事配置 */
  works: { [id: string]: IWork };
  /** 加载应用办事 */
  loadWorks(aIds?: NullableString[], wIds?: NullableString[]): Promise<void>;
  /** 取图数据 */
  getData?: () => any;
  /** 是否有环（节点间的环） */
  hasLoop(): boolean;
  /** 是否有环（图之间的环） */
  hasRefLoop(node: model.SubTransfer): Promise<boolean>;
  /** 初始化 */
  initializing(): Promise<boolean>;
  /** 请求 */
  request(request: model.Request, env?: model.KeyValue): Promise<boolean>;
  /** 脚本 */
  running(code: string, args: any, env?: model.KeyValue): any;
  /** 模板 */
  template<T>(forms: IForm[]): model.Sheet<T>[];
  /** 创建任务 */
  execute(
    status: 'Editable' | 'Viewable',
    event: model.GEvent,
    task?: ITask,
    data?: any,
  ): Promise<VisitedReturn | undefined>;
}

const Machine: model.Shift<model.GEvent, model.GStatus>[] = [
  { start: 'Editable', event: 'Prepare', end: 'Viewable' },
  { start: 'Viewable', event: 'Run', end: 'Running' },
  { start: 'Running', event: 'Complete', end: 'Viewable' },
  { start: 'Running', event: 'Throw', end: 'Error' },
  { start: 'Error', event: 'Recover', end: 'Viewable' },
  { start: 'Viewable', event: 'Edit', end: 'Editable' },
];

export class Transfer extends StandardFileInfo<model.Transfer> implements ITransfer {
  constructor(
    metadata: model.Transfer,
    dir: IDirectory,
    status: model.GStatus = 'Editable',
  ) {
    super(metadata, dir, dir.resource.transferColl);
    this.taskList = [];
    this.status = status;
    this.forms = {};
    this.transfers = { [this.id]: this };
    this.applications = {};
    this.works = {};
    this.canDesign = true;
    this.command = new Command();
    this.isRunning = false;
  }

  command: Command;
  taskList: ITask[];
  status: model.GStatus;
  forms: { [id: string]: IForm };
  transfers: { [id: string]: ITransfer };
  applications: { [id: string]: IApplication };
  works: { [id: string]: IWork };
  curTask?: ITask;
  getData?: () => any;
  isRunning: boolean;

  get nodes() {
    return this.metadata.nodes;
  }

  get edges() {
    return this.metadata.edges;
  }

  get envs() {
    return this.metadata.envs;
  }

  get curEnv() {
    return this.envs.find((item) => item.id == this.metadata.curEnv);
  }

  get cacheFlag(): string {
    return 'transfers';
  }

  async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.transferColl);
    }
    return false;
  }

  async move(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.transferColl);
    }
    return false;
  }

  async loadForms(formIds?: NullableString[]) {
    const forms: string[] = [];
    formIds?.forEach((item) => {
      if (item && !this.forms[item]) {
        forms.push(item);
      }
    });
    if (forms.length > 0) {
      const res = await this.directory.resource.formColl.find(forms);
      if (res.length > 0) {
        for (const item of res) {
          const form = new Form(item, this.directory);
          await form.loadContent();
          this.forms[form.id] = form;
        }
      }
    }
  }

  async loadTransfers(transferIds?: NullableString[]) {
    const transfers: string[] = [];
    transferIds?.forEach((item) => {
      if (item && !this.transfers[item]) {
        transfers.push(item);
      }
    });
    if (transfers.length > 0) {
      const res = await this.directory.resource.transferColl.find(transfers);
      if (res.length > 0) {
        for (const item of res) {
          const transfer = new Transfer(item, this.directory, 'Viewable');
          this.transfers[item.id] = transfer;
          await transfer.initializing();
        }
      }
    }
  }

  async loadWorks(appIds?: NullableString[], workIds?: NullableString[]) {
    const applications: string[] = [];
    appIds?.forEach((item) => {
      if (item && !this.applications[item]) {
        applications.push(item);
      }
    });
    if (applications.length > 0) {
      const result = await this.directory.resource.applicationColl.find(applications);
      if (result.length > 0) {
        for (const item of result) {
          const application = new Application(item, this.directory);
          this.applications[item.id] = application;
          for (const work of await application.loadWorks()) {
            if (workIds?.includes(work.id)) {
              this.works[work.id] = work;
              await work.loadContent();
            }
          }
        }
      }
    }
  }

  async initializing(): Promise<boolean> {
    const formIds: NullableString[] = [];
    const transferIds: NullableString[] = [];
    const appIds: NullableString[] = [];
    const workIds: NullableString[] = [];
    for (const node of this.nodes) {
      switch (node.typeName) {
        case '子图':
          transferIds.push((node as any).transferId);
          break;
        case '存储':
          appIds.push((node as any).applicationId);
          workIds.push((node as any).workId);
          break;
        case '映射':
          formIds.push(...[(node as any).source, (node as any).target]);
          break;
        case '表单':
          formIds.push((node as any).formId);
          break;
        case '表格':
          formIds.push(...(node as any).formIds);
          break;
      }
    }
    await this.loadForms(formIds);
    await this.loadTransfers(transferIds);
    await this.loadWorks(appIds, workIds);
    return true;
  }

  hasLoop(): boolean {
    const hasLoop = (node: model.Node, chain: Set<string>) => {
      for (const edge of this.metadata.edges) {
        if (edge.start == node.id) {
          for (const next of this.metadata.nodes) {
            if (edge.end == next.id) {
              if (chain.has(next.id)) {
                return true;
              }
              if (hasLoop(next, new Set([...chain, next.id]))) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };
    const not = this.metadata.edges.map((item) => item.end);
    const roots = this.metadata.nodes.filter((item) => not.indexOf(item.id) == -1);
    for (const root of roots) {
      if (hasLoop(root, new Set<string>([root.id]))) {
        return true;
      }
    }
    return false;
  }

  async request(request: model.Request, env?: model.KeyValue): Promise<boolean> {
    let json = JSON.stringify(request.data);
    for (const match of json.matchAll(/\{\{[^{}]*\}\}/g)) {
      for (let index = 0; index < match.length; index++) {
        let matcher = match[index];
        let varName = matcher.substring(2, matcher.length - 2);
        json = json.replaceAll(matcher, env?.[varName] ?? '');
      }
    }
    let res = await kernel.httpForward(JSON.parse(json));
    return res.data?.content ? JSON.parse(res.data.content) : res;
  }

  async update(data: model.Transfer): Promise<boolean> {
    if (this.getData) {
      data.graph = this.getData();
      const cellIds: string[] = data.graph.cells.map((item: any) => item.id);
      data.nodes = data.nodes.filter((item) => cellIds.includes(item.id));
      data.edges = data.edges.filter((item) => cellIds.includes(item.id));
    }
    return await super.update(data);
  }

  template<T>(forms: IForm[]): model.Sheet<T>[] {
    const ans: model.Sheet<T>[] = [];
    for (const form of forms) {
      const columns: model.Column[] = [
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
      ];
      for (const field of form.fields) {
        columns.push({
          title: field.name,
          dataIndex: field.id,
          valueType: field.valueType ?? '描述型',
          lookups: field.lookups,
        });
      }
      ans.push({
        id: form.id,
        name: form.name,
        columns: columns,
        data: [],
      });
    }
    return ans;
  }

  running(code: string, args: any, env?: model.KeyValue): any {
    const runtime = {
      environment: env ?? {},
      preData: args,
      nextData: {},
      decrypt: common.decrypt,
      encrypt: common.encrypt,
      log: (args: any) => {
        console.log(args);
      },
    };
    common.Sandbox(code)(runtime);
    return runtime.nextData;
  }

  async execute(
    status: 'Editable' | 'Viewable',
    event: model.GEvent,
    pre?: ITask,
    data?: any,
  ): Promise<VisitedReturn | undefined> {
    if (this.isRunning) {
      throw new Error('正在运行中！');
    }
    this.isRunning = true;
    this.status = status;
    this.curTask = new Task(status, event, this, pre);
    this.taskList.push(this.curTask);
    if (event == 'Prepare') {
      this.machine('Prepare', this.curTask);
    }
    this.machine('Run', this.curTask);
    try {
      const visitedDataArr = await this.curTask.starting(data);
      this.curTask.metadata.endTime = new Date();
      this.machine('Complete', this.curTask);
      return { task: this.curTask, visitedDataArr: visitedDataArr };
    } catch (error) {
      this.machine('Throw', this.curTask);
      this.machine('Recover', this.curTask);
      return { task: this.curTask, visitedDataArr: error as any };
    } finally {
      if (event == 'Prepare') {
        this.machine('Edit');
      }
      this.isRunning = false;
    }
  }

  machine(event: model.GEvent, task?: ITask): void {
    for (const shift of Machine) {
      if (shift.start == this.status && event == shift.event) {
        this.status = shift.end;
        this.command.emitter('graph', 'status', this.status);
        if (task) {
          task.metadata.status = this.status;
        }
        this.command.emitter('tasks', 'refresh');
      }
    }
  }

  async hasRefLoop(node: model.SubTransfer): Promise<boolean> {
    const hasLoop = async (nodes: model.Node[], chain: Set<string>): Promise<boolean> => {
      for (const node of nodes) {
        const sub = node as model.SubTransfer;
        if (sub.transferId) {
          await this.loadTransfers([sub.transferId]);
          const transfer = this.transfers[sub.transferId];
          if (transfer) {
            if (chain.has(sub.transferId)) {
              return true;
            } else {
              const next = new Set([...chain, sub.transferId]);
              if (await hasLoop(transfer.nodes, next)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };
    const array = [...this.metadata.nodes];
    for (let index = 0; index < array.length; index++) {
      if (array[index].id == node.id) {
        array[index] = node;
      }
    }
    return hasLoop(array, new Set([this.id]));
  }
}

export * from './node';
