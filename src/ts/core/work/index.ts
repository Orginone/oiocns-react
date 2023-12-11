import { kernel, model, schema } from '../../base';
import { IApplication } from '../thing/standard/application';
import { IForm, Form } from '../thing/standard/form';
import { FileInfo, IFile, IFileInfo } from '../thing/fileinfo';
import { IDirectory } from '../thing/directory';
import { IWorkApply, WorkApply } from './apply';
import { entityOperates, fileOperates } from '../public';
import { loadGatewayNodes } from '@/utils/tools';

export interface IWork extends IFileInfo<schema.XWorkDefine> {
  /** 主表 */
  primaryForms: IForm[];
  /** 子表 */
  detailForms: IForm[];
  /** 应用 */
  application: IApplication;
  /** 成员节点 */
  gatewayNodes: model.WorkNodeModel[];
  /** 成员节点绑定信息 */
  gatewayInfo: schema.XWorkGateway[];
  /** 流程节点 */
  node: model.WorkNodeModel | undefined;
  /** 更新办事定义 */
  update(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadNode(reload?: boolean): Promise<model.WorkNodeModel | undefined>;
  /** 加载成员节点信息 */
  loadGatewayInfo(reload?: boolean): Promise<schema.XWorkGateway[]>;
  /** 删除绑定 */
  deleteGateway(id: string): Promise<boolean>;
  /** 绑定成员节点 */
  bingdingGateway(
    nodeId: string,
    define: schema.XWorkDefine,
  ): Promise<schema.XWorkGateway | undefined>;
  /** 生成办事申请单 */
  createApply(
    taskId?: string,
    pdata?: model.InstanceDataModel,
  ): Promise<IWorkApply | undefined>;
  /** 通知变更 */
  notify(operate: string, data: any): void;
  /** 接收通知 */
  receive(operate: string, data: schema.XWorkDefine): boolean;
}

export const fullDefineRule = (data: schema.XWorkDefine) => {
  data.hasGateway = false;
  if (data.rule && data.rule.includes('{') && data.rule.includes('}')) {
    const rule = JSON.parse(data.rule);
    data.hasGateway = rule.hasGateway;
  }
  data.typeName = '办事';
  return data;
};

export class Work extends FileInfo<schema.XWorkDefine> implements IWork {
  constructor(_metadata: schema.XWorkDefine, _application: IApplication) {
    super(fullDefineRule(_metadata), _application.directory);
    this.application = _application;
  }
  canDesign: boolean = true;
  primaryForms: IForm[] = [];
  detailForms: IForm[] = [];
  application: IApplication;
  node: model.WorkNodeModel | undefined;
  gatewayNodes: model.WorkNodeModel[] = [];
  gatewayInfo: schema.XWorkGateway[] = [];
  get locationKey(): string {
    return this.application.key;
  }
  get cacheFlag(): string {
    return 'works';
  }
  get forms(): IForm[] {
    return [...this.primaryForms, ...this.detailForms];
  }
  async delete(_notity: boolean = false): Promise<boolean> {
    if (this.application) {
      const res = await kernel.deleteWorkDefine({
        id: this.id,
      });
      if (res.success) {
        this.application.works = this.application.works.filter((a) => a.id != this.id);
        this.notify('workRemove', this.metadata);
      }
      return res.success;
    }
    return false;
  }
  hardDelete(_notity: boolean = false): Promise<boolean> {
    return this.delete(_notity);
  }
  async rename(_name: string): Promise<boolean> {
    const node = await this.loadNode();
    return await this.update({
      ...this.metadata,
      name: _name,
      resource: node,
    });
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.application.id) {
      if ('works' in destination) {
        const app = destination as unknown as IApplication;
        const node = await this.loadNode();
        const res = await app.createWork({
          ...this.metadata,
          applicationId: app.id,
          resource: node,
        });
        return res != undefined;
      }
    }
    return false;
  }

  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.metadata.belongId === this.application.metadata.belongId
    ) {
      if ('works' in destination) {
        const app = destination as unknown as IApplication;
        this.setMetadata({ ...this.metadata, applicationId: app.id });
        const node = await this.loadNode();
        const success = await this.update({
          ...this.metadata,
          resource: node,
        });
        if (success) {
          this.application = app;
          app.works.push(this);
          app.changCallback();
          this.notify('workRemove', this.metadata);
        } else {
          this.setMetadata({ ...this.metadata, applicationId: this.application.id });
        }
        return success;
      }
    }
    return false;
  }
  content(): IFile[] {
    if (this.node) {
      const ids = this.node.forms?.map((i) => i.id) ?? [];
      return this.forms.filter((a) => ids.includes(a.id));
    }
    return [];
  }
  async loadContent(_reload: boolean = false): Promise<boolean> {
    await this.loadNode(_reload);
    await this.loadGatewayInfo(true);
    if (this.node) {
      this.gatewayNodes = loadGatewayNodes(this.node, []);
    }
    return this.forms.length > 0;
  }
  async update(data: model.WorkDefineModel): Promise<boolean> {
    data.id = this.id;
    data.applicationId = this.metadata.applicationId;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.notify('workReplace', res.data);
    }
    return res.success;
  }
  async loadGatewayInfo(reload: boolean = false): Promise<schema.XWorkGateway[]> {
    if (this.gatewayInfo.length == 0 || reload) {
      const destId = this.canDesign
        ? this.directory.target.id
        : this.directory.target.spaceId;
      const res = await kernel.queryWorkGateways({
        defineId: this.id,
        targetId: destId,
      });
      if (res.success && res.data) {
        this.gatewayInfo = res.data.result || [];
      }
    }
    return this.gatewayInfo;
  }
  async deleteGateway(id: string): Promise<boolean> {
    const res = await kernel.deleteWorkGateway({ id });
    if (res.success) {
      this.gatewayInfo = this.gatewayInfo.filter((a) => a.id != id);
    }
    return res.success;
  }
  async bingdingGateway(
    nodeId: string,
    define: schema.XWorkDefine,
  ): Promise<schema.XWorkGateway | undefined> {
    const res = await kernel.createWorkGeteway({
      nodeId: nodeId,
      defineId: define.id,
      targetId: this.directory.target.spaceId,
    });
    if (res.success) {
      this.gatewayInfo = this.gatewayInfo.filter((a) => a.nodeId != nodeId);
      this.gatewayInfo.push({ ...res.data, define });
    }
    return res.data;
  }
  async loadNode(reload: boolean = false): Promise<model.WorkNodeModel | undefined> {
    if (this.node === undefined || reload) {
      const res = await kernel.queryWorkNodes({ id: this.id });
      if (res.success) {
        this.node = res.data;
        await this.recursionForms(this.node);
      }
    }
    return this.node;
  }

  async createApply(
    taskId: string = '0',
    pdata?: model.InstanceDataModel,
  ): Promise<IWorkApply | undefined> {
    await this.loadNode();
    if (this.node && this.forms.length > 0) {
      const data: model.InstanceDataModel = {
        data: {},
        fields: {},
        primary: {},
        node: this.node,
      };
      this.forms.forEach((form) => {
        data.fields[form.id] = form.fields;
        if (pdata && pdata.data[form.id]) {
          const after = pdata.data[form.id]?.at(-1);
          if (after) {
            data.data[form.id] = [{ ...after, nodeId: this.node!.id }];
          }
        }
      });
      return new WorkApply(
        {
          hook: '',
          taskId: taskId,
          title: this.name,
          defineId: this.id,
        } as model.WorkInstanceModel,
        data,
        this.directory.target.space,
        this.forms,
      );
    }
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.isInherited) {
      operates.push({ sort: 3, cmd: 'workForm', label: '查看表单', iconType: '表单' });
    }
    if (this.metadata.hasGateway) {
      operates.push({
        sort: 4,
        cmd: 'fillWork',
        label: '关联我的办事',
        iconType: '办事',
      });
    }
    if (operates.includes(entityOperates.Delete)) {
      operates.push(entityOperates.HardDelete);
    }
    return operates
      .filter((i) => i != fileOperates.Copy)
      .filter((i) => i != fileOperates.Move)
      .filter((i) => i != fileOperates.Download)
      .filter((i) => i != entityOperates.Delete);
  }
  private async recursionForms(node: model.WorkNodeModel) {
    node.detailForms = await this.directory.resource.formColl.find(
      node.forms?.filter((a) => a.typeName == '子表').map((s) => s.id),
    );
    node.primaryForms = await this.directory.resource.formColl.find(
      node.forms?.filter((a) => a.typeName == '主表').map((s) => s.id),
    );
    for (const a of node.primaryForms) {
      const form = new Form({ ...a, id: a.id + '_' }, this.directory);
      await form.loadFields();
      this.primaryForms.push(form);
    }
    for (const a of node.detailForms) {
      const form = new Form({ ...a, id: a.id + '_' }, this.directory);
      await form.loadFields();
      this.detailForms.push(form);
    }
    if (node.children) {
      await this.recursionForms(node.children);
    }
    if (node.branches) {
      for (const branch of node.branches) {
        if (branch.children) {
          await this.recursionForms(branch.children);
        }
      }
    }
  }
  notify(operate: string, data: any): void {
    this.application.notify(operate, {
      ...data,
      typeName: '办事',
      parentId: this.application.metadata.id,
      directoryId: this.application.metadata.directoryId,
    });
  }
  receive(operate: string, data: schema.XWorkDefine): boolean {
    if (operate === 'workReplace' && data && data.id === this.id) {
      this.setMetadata(fullDefineRule(data));
      this.loadContent(true).then(() => {
        this.changCallback();
      });
    }
    return true;
  }
}
