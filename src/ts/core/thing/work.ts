import { kernel, model, schema } from '../../base';
import { IApplication } from './application';
import { Entity, entityOperates } from '../public';
import { IForm, Form } from './form';
import { IFileInfo } from './fileinfo';
import { IDirectory } from './directory';

export interface IWork extends IFileInfo<schema.XWorkDefine> {
  /** 流程关联的表单 */
  forms: IForm[];
  /** 应用 */
  application: IApplication;
  /** 流程节点 */
  node: model.WorkNodeModel | undefined;
  /** 更新办事定义 */
  update(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(): Promise<model.WorkNodeModel | undefined>;
  /** 加载事项定义节点关联的表单 */
  loadWorkForms(): Promise<IForm[]>;
  /** 新建办事实例 */
  createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined>;
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
  data.typeName = '事项';
  return data;
};

export class Work extends Entity<schema.XWorkDefine> implements IWork {
  constructor(_metadata: schema.XWorkDefine, _application: IApplication) {
    super(fullDefineRule(_metadata));
    this.application = _application;
  }
  forms: IForm[] = [];
  application: IApplication;
  node: model.WorkNodeModel | undefined;
  get directory(): IDirectory {
    return this.application.directory;
  }
  get isInherited(): boolean {
    return this.application.isInherited;
  }
  get belongId(): string {
    return this.application.belongId;
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
          this.directory.propertys = this.directory.propertys.filter(
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
  content(_mode: number = 0): IFileInfo<schema.XEntity>[] {
    return [];
  }
  async loadContent(_reload: boolean = false): Promise<boolean> {
    await this.loadWorkForms();
    return this.forms.length > 0;
  }
  override operates(mode: number = 0): model.OperateModel[] {
    const operates = super.operates();
    if (mode == 1) {
      operates.unshift(entityOperates.Open);
    }
    return operates;
  }
  async update(data: model.WorkDefineModel): Promise<boolean> {
    data.id = this.id;
    data.applicationId = this.metadata.applicationId;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      res.data.typeName = '事项';
      this.setMetadata(fullDefineRule(res.data));
      this.node = data.resource;
    }
    return res.success;
  }
  async loadWorkNode(): Promise<model.WorkNodeModel | undefined> {
    if (this.node === undefined) {
      const res = await kernel.queryWorkNodes({ id: this.id });
      if (res.success) {
        this.node = res.data;
      }
    }
    return this.node;
  }
  async loadWorkForms(): Promise<IForm[]> {
    const forms: IForm[] = [];
    const res = await kernel.queryWorkNodes({ id: this.id });
    if (res.success && res.data) {
      const recursionForms = async (node: model.WorkNodeModel) => {
        for (const item of node.forms ?? []) {
          const form = new Form(item, this.directory);
          await form.loadAttributes();
          forms.push(form);
        }
        if (node.children) {
          await recursionForms(node.children);
        }
        if (node.branches) {
          for (const branch of node.branches) {
            if (branch.children) {
              await recursionForms(branch.children);
            }
          }
        }
      };
      await recursionForms(res.data);
    }
    this.forms = forms;
    return forms;
  }
  async createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined> {
    let res = await kernel.createWorkInstance(data);
    if (res.success) {
      return res.data;
    }
  }
}
