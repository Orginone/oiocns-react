import { XForm } from '@/ts/base/schema';
import { Command, kernel, model, schema, common } from '../../../base';
import { storeCollName } from '../../public';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';

export type GraphData = () => any;

export interface ITransfer extends IStandardFileInfo<model.Transfer> {
  /** 集合名称 */
  collName: string;
  /** 触发器 */
  command: Command;
  /** 任务记录 */
  taskList: model.Environment[];
  /** 当前任务 */
  curTask?: model.Environment;
  /** 已遍历点 */
  curVisited?: Set<string>;
  /** 前置链接 */
  curPreLink?: ITransfer;
  /** 图状态 */
  status: model.GraphStatus;
  /** 状态转移 */
  machine(event: model.Event): void;
  /** 取图数据 */
  getData?: GraphData;
  /** 绑定图 */
  binding(getData: GraphData): void;
  /** 刷新数据 */
  refresh(data: model.Transfer): Promise<boolean>;
  /** 增加节点 */
  addNode(node: model.Node<any>): Promise<void>;
  /** 更新节点 */
  updNode(node: model.Node<any>): Promise<void>;
  /** 删除节点 */
  delNode(id: string): Promise<void>;
  /** 节点添加脚本 */
  addNodeScript(
    pos: model.ScriptPos,
    node: model.Node<any>,
    script: model.Script,
  ): Promise<void>;
  /** 节点更新脚本 */
  updNodeScript(
    pos: model.ScriptPos,
    node: model.Node<any>,
    script: model.Script,
  ): Promise<void>;
  /** 节点删除脚本 */
  delNodeScript(pos: model.ScriptPos, node: model.Node<any>, id: string): Promise<void>;
  /** 遍历节点 */
  visitNode(node: model.Node<any>, preData?: any): Promise<void>;
  /** 增加边 */
  addEdge(edge: model.Edge): Promise<void>;
  /** 更新边 */
  updEdge(edge: model.Edge): Promise<void>;
  /** 删除边 */
  delEdge(id: string): Promise<void>;
  /** 新增环境 */
  addEnv(env: model.Environment): Promise<void>;
  /** 修改环境 */
  updEnv(env: model.Environment): Promise<void>;
  /** 删除环境 */
  delEnv(id: string): Promise<void>;
  /** 变更环境 */
  changeEnv(id: string): Promise<void>;
  /** 请求 */
  request(node: model.Node<any>): Promise<model.HttpResponseType>;
  /** 脚本 */
  running(code: string, args: any): any;
  /** 映射 */
  mapping(node: model.Node<any>, array: any[]): Promise<any[]>;
  /** 开始执行 */
  execute(link?: ITransfer): void;
}

export class Transfer extends StandardFileInfo<model.Transfer> implements ITransfer {
  collName: string;
  command: Command;
  taskList: model.Environment[];
  preStatus: model.GraphStatus;
  status: model.GraphStatus;
  curTask?: model.Environment;
  curVisited?: Set<string>;
  curPreLink?: ITransfer;
  getData?: GraphData;

  constructor(metadata: model.Transfer, dir: IDirectory) {
    super(metadata, dir, dir.resource.transferColl);
    this.collName = storeCollName.Transfer;
    this.command = new Command();
    this.taskList = [];
    this.preStatus = 'Editable';
    this.status = 'Editable';
    this.command.subscribe((type, cmd, args) => {
      switch (type) {
        case 'main':
          this.handing(cmd, args);
          break;
      }
    });
    this.setEntity();
  }

  machine(event: model.Event): void {
    switch (event) {
      case 'Edit':
      case 'View':
        if (this.status == 'Running') {
          throw new Error('正在运行中！');
        }
        this.preStatus = this.status;
        this.status = event == 'Edit' ? 'Editable' : 'Viewable';
        break;
      case 'Run':
        if (this.status == 'Running') {
          return;
        }
        this.preStatus = this.status;
        this.status = 'Running';
        break;
    }
    this.command.emitter('graph', 'status', this.status);
  }

  binding(getData: GraphData): void {
    this.getData = getData;
  }

  async refresh(data: model.Transfer): Promise<boolean> {
    data.graph = this.getData?.();
    this.setMetadata(data);
    return !!(await this.directory.resource.transferColl.replace(this.metadata));
  }

  async delete(): Promise<boolean> {
    if (await this.directory.resource.transferColl.delete(this.metadata)) {
      this.directory.transfers = this.directory.transfers.filter(
        (item) => item.key != this.key,
      );
      return true;
    }
    return false;
  }

  async rename(name: string): Promise<boolean> {
    if (
      await this.directory.resource.transferColl.update(this.id, {
        _set_: { name: name },
      })
    ) {
      this.setMetadata({ ...this._metadata, name: name });
      this.directory.transfers = this.directory.transfers.filter(
        (item) => item.key != this.key,
      );
      return true;
    }
    return false;
  }

  async copy(destination: IDirectory): Promise<boolean> {
    let res = await destination.createTransfer(this.metadata);
    return !!res;
  }

  async move(destination: IDirectory): Promise<boolean> {
    if (
      await this.directory.resource.transferColl.update(this.id, {
        _set_: { directoryId: destination.id },
      })
    ) {
      this.setMetadata({ ...this._metadata, directoryId: destination.id });
      destination.transfers.push(this);
      this.directory.transfers = this.directory.transfers.filter(
        (item) => item.key != this.key,
      );
      return true;
    }
    return false;
  }

  execute(link?: ITransfer) {
    this.machine('Run');
    this.curVisited = new Set();
    const env = this.metadata.envs.find((item) => item.id == this.metadata.curEnv);
    if (env) {
      this.curTask = common.deepClone(env);
      this.taskList.push(this.curTask);
    }
    this.curPreLink = link;
    this.command.emitter('main', 'refresh');
    this.command.emitter('main', 'roots');
  }

  async request(node: model.Node<any>): Promise<model.HttpResponseType> {
    let request = common.deepClone(node.data as model.HttpRequestType);
    let json = JSON.stringify(request);
    for (const match of json.matchAll(/\{\{[^{}]*\}\}/g)) {
      for (let index = 0; index < match.length; index++) {
        let matcher = match[index];
        let varName = matcher.substring(0, matcher.length - 1);
        json.replaceAll(matcher, this.curTask?.params[varName] ?? '');
      }
    }
    return (await kernel.httpForward(JSON.parse(json))).data;
  }

  running(code: string, args: any): any {
    const runtime = {
      environment: this.curTask,
      preData: args,
      nextData: {},
      decrypt: common.decrypt,
      encrypt: common.encrypt,
      log: (...message: string[]) => {
        console.log(message);
      },
    };
    common.Sandbox(code)(runtime);
    return runtime.nextData;
  }

  async mapping(node: model.Node<any>, array: any[]): Promise<any[]> {
    const ans: any[] = [];
    const data = node.data as model.Mapping;
    const form = this.findMetadata<XForm>(data.source);
    if (form) {
      const sourceMap = new Map<string, schema.XAttribute>();
      form.attributes.forEach((attr) => {
        if (attr.property?.info) {
          sourceMap.set(attr.property.info, attr);
        }
      });
      for (let item of array) {
        let oldItem: { [key: string]: any } = {};
        let newItem: { [key: string]: any } = { Id: common.generateUuid() };
        Object.keys(item).forEach((key) => {
          if (sourceMap.has(key)) {
            const attr = sourceMap.get(key)!;
            oldItem[attr.id] = item[key];
          }
        });
        for (const mapping of data.mappings) {
          if (mapping.source in oldItem) {
            newItem[mapping.target] = oldItem[mapping.source];
          }
        }
        ans.push(newItem);
      }
    }
    return ans;
  }

  async addNode(node: model.Node<any>): Promise<void> {
    node.preScripts = [];
    node.postScripts = [];
    let index = this.metadata.nodes.findIndex((item) => item.id == node.id);
    if (index == -1) {
      this.metadata.nodes.push(node);
      if (await this.refresh(this.metadata)) {
        this.command.emitter('node', 'add', node);
      }
    }
  }

  async updNode(node: model.Node<any>): Promise<void> {
    let index = this.metadata.nodes.findIndex((item) => item.id == node.id);
    if (index != -1) {
      this.metadata.nodes[index] = node;
      if (await this.refresh(this.metadata)) {
        this.command.emitter('node', 'update', node);
      }
    }
  }

  async delNode(id: string): Promise<void> {
    let index = this.metadata.nodes.findIndex((item) => item.id == id);
    if (index != -1) {
      let node = this.metadata.nodes[index];
      this.metadata.nodes.splice(index, 1);
      if (await this.refresh(this.metadata)) {
        this.command.emitter('node', 'delete', node);
      }
    }
  }

  async addNodeScript(
    pos: model.ScriptPos,
    node: model.Node<any>,
    script: model.Script,
  ): Promise<void> {
    script.id = common.generateUuid();
    switch (pos) {
      case 'pre':
        node.preScripts.push(script);
        break;
      case 'post':
        node.postScripts.push(script);
        break;
    }
    await this.updNode(node);
  }

  async updNodeScript(
    pos: model.ScriptPos,
    node: model.Node<any>,
    script: model.Script,
  ): Promise<void> {
    switch (pos) {
      case 'pre': {
        let index = node.preScripts.findIndex((item) => item.id == script.id);
        if (index != -1) {
          node.preScripts[index] = script;
        }
        break;
      }
      case 'post': {
        let index = node.preScripts.findIndex((item) => item.id == script.id);
        if (index != -1) {
          node.postScripts[index] = script;
        }
        break;
      }
    }
    await this.updNode(node);
  }

  async delNodeScript(
    pos: model.ScriptPos,
    node: model.Node<any>,
    id: string,
  ): Promise<void> {
    switch (pos) {
      case 'pre': {
        let index = node.preScripts.findIndex((item) => item.id == id);
        node.preScripts.splice(index, 1);
        break;
      }
      case 'post': {
        let index = node.postScripts.findIndex((item) => item.id == id);
        node.postScripts.splice(index, 1);
        break;
      }
    }
    await this.updNode(node);
  }

  async visitNode(node: model.Node<any>, preData?: any): Promise<void> {
    this.command.emitter('node', 'start', node);
    try {
      for (const script of node.preScripts ?? []) {
        preData = this.running(script.code, preData);
      }
      let nextData: any;
      switch (node.typeName) {
        case 'request':
          nextData = await this.request(node);
          break;
        case 'link':
          // TODO 替换其它方案
          this.getEntity<ITransfer>((node.data as model.Transfer).id)?.execute(this);
          break;
        case 'mapping':
          nextData = await this.mapping(node, preData.array);
          break;
        case 'store':
          break;
      }
      for (const script of node.postScripts ?? []) {
        nextData = this.running(script.code, nextData);
      }
      this.curVisited?.add(node.id);
      this.command.emitter('node', 'completed', node, nextData);
    } catch (error) {
      this.command.emitter('node', 'error', error);
    }
  }

  async addEdge(edge: model.Edge): Promise<void> {
    let index = this.metadata.edges.findIndex((item) => edge.id == item.id);
    if (index == -1) {
      this.metadata.edges.push(edge);
      await this.refresh(this.metadata);
    }
  }

  async updEdge(edge: model.Edge): Promise<void> {
    let index = this.metadata.edges.findIndex((item) => item.id == edge.id);
    if (index != -1) {
      this.metadata.edges[index] = edge;
      await this.refresh(this.metadata);
    }
  }

  async delEdge(id: string): Promise<void> {
    let index = this.metadata.edges.findIndex((item) => item.id == id);
    if (index != -1) {
      this.metadata.edges.splice(index, 1);
      await this.refresh(this.metadata);
    }
  }

  async addEnv(env: model.Environment): Promise<void> {
    let index = this.metadata.envs.findIndex((item) => {
      return item.id == env.id;
    });
    if (index == -1) {
      const id = common.generateUuid();
      this.metadata.envs.push({ ...env, id: id });
      this.metadata.curEnv = id;
      await this.refresh(this.metadata);
      this.command.emitter('environments', 'refresh');
    }
  }

  async updEnv(env: model.Environment): Promise<void> {
    let index = this.metadata.envs.findIndex((item) => {
      return item.id == env.id;
    });
    if (index != -1) {
      this.metadata.envs[index] = env;
      await this.refresh(this.metadata);
      this.command.emitter('environments', 'refresh');
    }
  }

  async delEnv(id: string): Promise<void> {
    let index = this.metadata.envs.findIndex((item) => {
      return item.id == id;
    });
    if (index != -1) {
      this.metadata.envs.splice(index, 1);
      await this.refresh(this.metadata);
      if (id == this.metadata.curEnv) {
        this.metadata.curEnv = undefined;
      }
      this.command.emitter('environments', 'refresh');
    }
  }

  async changeEnv(id: string): Promise<void> {
    for (const item of this.metadata.envs) {
      if (item.id == id) {
        this.metadata.curEnv = id;
        await this.refresh(this.metadata);
        this.command.emitter('environments', 'refresh');
      }
    }
  }

  private preCheck(node: model.Node<any>): boolean {
    this.command.emitter('node', 'loading', node);
    for (const edge of this.metadata.edges) {
      if (node.id == edge.end) {
        if (!this.curVisited?.has(edge.id)) {
          return false;
        }
      }
    }
    return true;
  }

  private async handing(cmd: string, args: any) {
    switch (cmd) {
      case 'roots':
        {
          const not = this.metadata.edges.map((item) => item.end);
          const roots = this.metadata.nodes.filter((item) => not.indexOf(item.id) == -1);
          for (const root of roots) {
            this.visitNode(root);
          }
        }
        break;
      case 'visitNode':
        if (this.preCheck(args)) {
          await this.visitNode(args);
        }
        break;
      case 'next':
        for (const edge of this.metadata.edges) {
          if (args[0].id == edge.start) {
            this.curVisited?.add(edge.id);
            for (const node of this.metadata.nodes) {
              if (node.id == edge.end) {
                this.command.emitter('main', 'visitNode', node, args[1]);
              }
            }
          }
        }
        break;
    }
  }
}

export const getDefaultRequestNode = (): model.RequestNode => {
  return {
    id: common.generateUuid(),
    name: '请求',
    typeName: '请求',
    preScripts: [],
    postScripts: [],
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

export const getDefaultMappingNode = (): model.MappingNode => {
  return {
    id: common.generateUuid(),
    name: '映射',
    typeName: '映射',
    preScripts: [],
    postScripts: [],
    data: {
      source: '',
      target: '',
      mappings: [],
    },
  };
};

export const getDefaultStoreNode = (): model.StoreNode => {
  return {
    id: common.generateUuid(),
    name: '存储',
    typeName: '存储',
    preScripts: [],
    postScripts: [],
    data: {
      formId: '',
      directoryId: '',
    },
  };
};

export const getDefaultLinkNode = (): model.LinkNode => {
  return {
    id: common.generateUuid(),
    name: '链接',
    typeName: '链接',
    preScripts: [],
    postScripts: [],
    data: '',
  };
};
