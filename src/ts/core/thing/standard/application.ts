import { kernel, model, schema } from '../../../base';
import { PageAll, directoryOperates, fileOperates } from '../../public';
import { IDirectory } from '../directory';
import { IFileInfo, IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { IWork, Work } from '../../work';

/** 应用/模块接口类 */
export interface IApplication extends IStandardFileInfo<schema.XApplication> {
  /** 上级模块 */
  parent: IApplication | undefined;
  /** 下级模块 */
  children: IApplication[];
  /** 流程定义 */
  works: IWork[];
  /** 加载办事 */
  loadWorks(reload?: boolean): Promise<IWork[]>;
  /** 新建办事 */
  createWork(data: model.WorkDefineModel): Promise<IWork | undefined>;
  /** 新建模块 */
  createModule(data: schema.XApplication): Promise<schema.XApplication | undefined>;
}

/** 应用实现类 */
export class Application
  extends StandardFileInfo<schema.XApplication>
  implements IApplication
{
  constructor(
    _metadata: schema.XApplication,
    _directory: IDirectory,
    _parent?: IApplication,
    _applications?: schema.XApplication[],
  ) {
    super(_metadata, _directory, _directory.resource.applicationColl);
    this.parent = _parent;
    this.loadChildren(_applications);
  }
  works: IWork[] = [];
  children: IApplication[] = [];
  parent: IApplication | undefined;
  private _worksLoaded: boolean = false;
  get locationKey(): string {
    return this.key;
  }
  content(_mode: number = 0): IFileInfo<schema.XEntity>[] {
    return [...this.children, ...this.works].sort((a, b) =>
      a.metadata.updateTime < b.metadata.updateTime ? 1 : -1,
    );
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.directory.id) {
      const res = await destination.createApplication({
        ...this.metadata,
        directoryId: destination.id,
      });
      return res != undefined;
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (!this.parent) {
      const applications = this.getChildren(this);
      const res = await destination.resource.applicationColl.replaceMany(
        applications.map((a) => {
          return { ...a, directoryId: destination.id };
        }),
      );
      if (res.length > 0) {
        return await super.move(destination);
      }
    }
    return false;
  }
  async delete(): Promise<boolean> {
    const success = await this.directory.resource.applicationColl.deleteMany(
      this.getChildren(this),
    );
    if (success) {
      return await super.delete();
    }
    return success;
  }
  async loadWorks(reload?: boolean | undefined): Promise<IWork[]> {
    if (!this._worksLoaded || reload) {
      const res = await kernel.queryWorkDefine({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._worksLoaded = true;
        this.works = (res.data.result || []).map((a) => new Work(a, this));
      }
    }
    return this.works;
  }
  async createWork(data: model.WorkDefineModel): Promise<IWork | undefined> {
    data.applicationId = this.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let work = new Work(res.data, this);
      this.works.push(work);
      return work;
    }
  }
  async createModule(
    data: schema.XApplication,
  ): Promise<schema.XApplication | undefined> {
    data.parentId = this.id;
    data.typeName = '模块';
    data.directoryId = this.directory.id;
    const res = await this.directory.resource.applicationColl.insert(data);
    if (res) {
      this.notify('insert', [res]);
      return res;
    }
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadWorks(reload);
    return true;
  }
  override operates(mode: number = 0): model.OperateModel[] {
    const operates: model.OperateModel[] = [
      directoryOperates.Refesh,
      ...super.operates(mode),
    ];
    if (mode === 2 && this.directory.target.hasRelationAuth()) {
      operates.push(directoryOperates.NewModule, directoryOperates.NewWork);
      if (this.directory.target.user.copyFiles.size > 0) {
        operates.push(fileOperates.Parse);
      }
    }
    return operates.filter(
      (a) => ![fileOperates.Copy, fileOperates.Download].includes(a),
    );
  }
  private loadChildren(applications?: schema.XApplication[]) {
    if (applications && applications.length > 0) {
      applications
        .filter((i) => i.parentId === this.metadata.id)
        .forEach((i) => {
          this.children.push(new Application(i, this.directory, this, applications));
        });
    }
  }
  private getChildren(application: IApplication): schema.XApplication[] {
    const applications: schema.XApplication[] = [];
    for (const child of application.children) {
      applications.push(child.metadata);
      applications.push(...this.getChildren(child));
    }
    return applications;
  }
  protected override receiveMessage(operate: string, data: schema.XApplication): void {
    super.receiveMessage(operate, data);
    if (data.parentId == this.id) {
      switch (operate) {
        case 'delete':
          this.children = this.children.filter((a) => a.id != data.id);
          this.coll.removeCache(data.id);
          this.changCallback();
          break;
        case 'insert':
          this.children.push(new Application(data, this.directory, this));
          this.coll.cache.push(data);
          this.changCallback();
          break;
        default:
          break;
      }
    }
  }
}
