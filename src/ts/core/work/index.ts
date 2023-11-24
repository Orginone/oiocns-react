import { kernel, model, schema } from '../../base';
import { IApplication } from '../thing/standard/application';
import { IForm, Form } from '../thing/standard/form';
import { FileInfo, IFile, IFileInfo } from '../thing/fileinfo';
import { IDirectory } from '../thing/directory';
import { IWorkApply, WorkApply } from './apply';
import { entityOperates, fileOperates } from '../public';

export interface IWork extends IFileInfo<schema.XWorkDefine> {
  /** 主表 */
  primaryForms: IForm[];
  /** 子表 */
  detailForms: IForm[];
  /** 应用 */
  application: IApplication;
  /** 成员节点 */
  memberNodes: model.WorkNodeModel[];
  /** 成员节点绑定信息 */
  memberNodeInfo: schema.XMemberNodeInfo[];
  /** 流程节点 */
  node: model.WorkNodeModel | undefined;
  /** 更新办事定义 */
  update(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(reload?: boolean): Promise<model.WorkNodeModel | undefined>;
  /** 加载成员节点信息 */
  loadMemberNodeInfo(reload?: boolean): Promise<schema.XMemberNodeInfo[]>;
  /** 绑定成员节点 */
  bingdingMember(
    nodeId: string,
    define: schema.XWorkDefine,
  ): Promise<schema.XMemberNodeInfo | undefined>;
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
  data.allowAdd = true;
  data.allowEdit = true;
  data.allowSelect = true;
  data.allowFillWork = false;
  if (data.rule && data.rule.includes('{') && data.rule.includes('}')) {
    const rule = JSON.parse(data.rule);
    data.allowAdd = rule.allowAdd;
    data.allowEdit = rule.allowEdit;
    data.allowSelect = rule.allowSelect;
    data.allowFillWork = rule.allowFillWork;
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
  memberNodes: model.WorkNodeModel[] = [];
  memberNodeInfo: schema.XMemberNodeInfo[] = [];
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
    const node = await this.loadWorkNode();
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
        const node = await this.loadWorkNode();
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
        const node = await this.loadWorkNode();
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
    await this.loadWorkNode(_reload);
    await this.loadAllMemberNodeInfo(_reload);
    if (this.node) {
      this.memberNodes = this.loadMemberNodes(this.node, []);
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
  async loadAllMemberNodeInfo(
    reload: boolean = false,
  ): Promise<schema.XMemberNodeInfo[]> {
    if (this.memberNodeInfo.length > 0 || reload) {
      this.memberNodeInfo = await this.directory.resource.memberNodeColl.loadSpace({
        options: {
          match: {
            defineId: this.id,
          },
        },
      });
    }
    return this.memberNodeInfo;
  }
  async loadMemberNodeInfo(reload: boolean = false): Promise<schema.XMemberNodeInfo[]> {
    await this.loadAllMemberNodeInfo(reload);
    return this.memberNodeInfo.filter((a) => a.targetId == this.directory.target.id);
  }
  async bingdingMember(
    nodeId: string,
    define: schema.XWorkDefine,
  ): Promise<schema.XMemberNodeInfo | undefined> {
    var last = this.memberNodeInfo.find(
      (a) => a.targetId == this.directory.target.id && a.memberNodeId == nodeId,
    );
    if (last) {
      return await this.directory.resource.memberNodeColl.replace({
        ...last,
        memberDefine: define,
        defineId: define.id,
      });
    } else {
      return await this.directory.resource.memberNodeColl.insert({
        targetId: this.directory.target.id,
        memberNodeId: nodeId,
        memberDefine: define,
        defineId: this.id,
      } as schema.XMemberNodeInfo);
    }
  }
  async loadWorkNode(reload: boolean = false): Promise<model.WorkNodeModel | undefined> {
    if (this.node === undefined || reload) {
      const res = await kernel.queryWorkNodes({ id: this.id });
      if (res.success) {
        this.node = res.data;
        await this.recursionForms(this.node);
      }
    }
    return this.node;
  }

  loadMemberNodes = (node: model.WorkNodeModel, memberNodes: model.WorkNodeModel[]) => {
    if (node.type == '网关') {
      memberNodes.push(node);
    }
    if (node.children) {
      memberNodes = this.loadMemberNodes(node.children, memberNodes);
    }
    for (const branch of node.branches ?? []) {
      if (branch.children) {
        memberNodes = this.loadMemberNodes(branch.children, memberNodes);
      }
    }
    return memberNodes;
  };

  async createApply(
    taskId: string = '0',
    pdata?: model.InstanceDataModel,
  ): Promise<IWorkApply | undefined> {
    await this.loadWorkNode();
    if (this.node && this.forms.length > 0) {
      const data: model.InstanceDataModel = {
        data: {},
        fields: {},
        primary: {},
        node: this.node,
        allowAdd: this.metadata.allowAdd,
        allowEdit: this.metadata.allowEdit,
        allowSelect: this.metadata.allowSelect,
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
    if (this.metadata.allowFillWork) {
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
