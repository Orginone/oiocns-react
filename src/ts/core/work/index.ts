import { kernel, model, schema } from '../../base';
import { IApplication } from '../thing/application';
import { IForm, Form } from '../thing/form';
import { FileInfo, IFileInfo } from '../thing/fileinfo';
import { IDirectory } from '../thing/directory';
import { IWorkApply, WorkApply } from './apply';
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
  loadWorkNode(reload?: boolean): Promise<model.WorkNodeModel | undefined>;
  /** 加载事项定义节点关联的表单 */
  loadWorkForms(reload?: boolean): Promise<IForm[]>;
  /** 生成办事申请单 */
  createApply(): Promise<IWorkApply | undefined>;
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
  }
  forms: IForm[] = [];
  application: IApplication;
  node: model.WorkNodeModel | undefined;
  get locationKey(): string {
    return this.application.key;
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
    return this.forms;
  }
  async loadContent(_reload: boolean = false): Promise<boolean> {
    await this.loadWorkForms();
    return this.forms.length > 0;
  }
  async update(data: model.WorkDefineModel): Promise<boolean> {
    data.id = this.id;
    data.applicationId = this.metadata.applicationId;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.setMetadata(fullDefineRule(res.data));
      this.node = data.resource;
    }
    return res.success;
  }
  async loadWorkNode(reload: boolean = false): Promise<model.WorkNodeModel | undefined> {
    if (this.node === undefined || reload) {
      const res = await kernel.queryWorkNodes({ id: this.id });
      if (res.success) {
        this.node = res.data;
      }
    }
    return this.node;
  }
  async loadWorkForms(reload: boolean = false): Promise<IForm[]> {
    const forms: IForm[] = [];
    if (!reload) {
      await this.loadWorkNode(true);
    }
    if (this.node) {
      const recursionForms = async (node: model.WorkNodeModel) => {
        await Promise.all(
          [...(node.primaryForms ?? []), ...(node.detailForms ?? [])].map(
            async (item) => {
              const form = new Form({ ...item, id: item.id + '_' }, this.directory);
              await form.loadContent();
              forms.push(form);
            },
          ),
        );
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
      await recursionForms(this.node);
    }
    this.forms = forms;
    return forms;
  }
  async createApply(): Promise<IWorkApply | undefined> {
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
      });

      return new WorkApply(
        {
          hook: '',
          taskId: '0',
          title: this.name,
          defineId: this.id,
        } as model.WorkInstanceModel,
        data,
        this.directory.target.space,
        this.forms,
      );
    }
  }
}
