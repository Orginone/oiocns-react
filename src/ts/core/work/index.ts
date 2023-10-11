import { kernel, model, schema } from '../../base';
import { IApplication } from '../thing/standard/application';
import { IForm, Form } from '../thing/standard/form';
import { FileInfo, IFile, IFileInfo } from '../thing/fileinfo';
import { IDirectory } from '../thing/directory';
import { IWorkApply, WorkApply } from './apply';
import { fileOperates } from '../public';

export interface IWork extends IFileInfo<schema.XWorkDefine> {
  /** 主表 */
  primaryForms: IForm[];
  /** 子表 */
  detailForms: IForm[];
  /** 应用 */
  application: IApplication;
  /** 流程节点 */
  node: model.WorkNodeModel | undefined;
  /** 更新办事定义 */
  update(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(reload?: boolean): Promise<model.WorkNodeModel | undefined>;
  /** 生成办事申请单 */
  createApply(
    taskId?: string,
    pdata?: model.InstanceDataModel,
  ): Promise<IWorkApply | undefined>;
}

export const fullDefineRule = (data: schema.XWorkDefine) => {
  data.allowAdd = true;
  data.allowEdit = true;
  data.allowSelect = true;
  if (data.rule && data.rule.includes('{') && data.rule.includes('}')) {
    const rule = JSON.parse(data.rule);
    data.allowAdd = rule.allowAdd;
    data.allowEdit = rule.allowEdit;
    data.allowSelect = rule.allowSelect;
  }
  data.typeName = '办事';
  return data;
};

export class Work extends FileInfo<schema.XWorkDefine> implements IWork {
  constructor(_metadata: schema.XWorkDefine, _application: IApplication) {
    super(fullDefineRule(_metadata), _application.directory);
    this.application = _application;
    this.isContainer = _application.isInherited;
  }
  canDesign: boolean = true;
  primaryForms: IForm[] = [];
  detailForms: IForm[] = [];
  application: IApplication;
  node: model.WorkNodeModel | undefined;
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
          this.directory.standard.propertys = this.directory.standard.propertys.filter(
            (i) => i.key != this.key,
          );
          this.application = app;
          app.works.push(this);
        } else {
          this.setMetadata({ ...this.metadata, applicationId: this.application.id });
        }
        return success;
      }
    }
    return false;
  }
  content(_mode: number = 0): IFile[] {
    if (this.node) {
      return this.forms.filter(
        (a) => this.node!.forms.findIndex((s) => s.id == a.id) > -1,
      );
    }
    return [];
  }
  async loadContent(_reload: boolean = false): Promise<boolean> {
    await this.loadWorkNode();
    return this.forms.length > 0;
  }
  async update(data: model.WorkDefineModel): Promise<boolean> {
    data.id = this.id;
    data.applicationId = this.metadata.applicationId;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.setMetadata(fullDefineRule(res.data));
      this.node = data.resource;
      this.recursionForms(this.node!);
    }
    return res.success;
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
  override operates(mode?: number): model.OperateModel[] {
    return super
      .operates(mode)
      .filter(
        (a) => ![fileOperates.Copy, fileOperates.Move, fileOperates.Download].includes(a),
      );
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
}
