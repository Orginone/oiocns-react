import { kernel, model, schema } from '../../../base';
import { PageAll, directoryOperates, fileOperates } from '../../public';
import { IDirectory } from '../directory';
import { FileInfo, IFileInfo } from '../fileinfo';
import { IWork, Work } from '../../work';

/** 应用/模块接口类 */
export interface IApplication extends IFileInfo<schema.XApplication> {
  /** 上级模块 */
  parent: IApplication | undefined;
  /** 下级模块 */
  children: IApplication[];
  /** 流程定义 */
  works: IWork[];
  /** 更新应用 */
  update(data: model.ApplicationModel): Promise<boolean>;
  /** 加载办事 */
  loadWorks(reload?: boolean): Promise<IWork[]>;
  /** 新建办事 */
  createWork(data: model.WorkDefineModel): Promise<IWork | undefined>;
  /** 新建模块 */
  createModule(data: model.ApplicationModel): Promise<IApplication | undefined>;
}

/** 应用实现类 */
export class Application extends FileInfo<schema.XApplication> implements IApplication {
  constructor(
    _metadata: schema.XApplication,
    _directory: IDirectory,
    _parent?: IApplication,
    _applications?: schema.XApplication[],
  ) {
    super(_metadata, _directory);
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
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
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
  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.metadata.belongId === this.directory.metadata.belongId
    ) {
      this.setMetadata({ ...this.metadata, directoryId: destination.id });
      const success = await this.update(this.metadata);
      if (success) {
        this.directory.applications = this.directory.applications.filter(
          (i) => i.key != this.key,
        );
        this.directory = destination;
        destination.applications.push(this);
      } else {
        this.setMetadata({ ...this.metadata, directoryId: this.directory.id });
      }
      return success;
    }
    return false;
  }
  async update(data: model.ApplicationModel): Promise<boolean> {
    data.id = this.id;
    data.directoryId = this.metadata.directoryId;
    data.typeName = this.metadata.typeName;
    const res = await kernel.updateApplication(data);
    if (res.success && res.data.id) {
      this.setMetadata(res.data);
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteApplication({
      id: this.id,
    });
    if (res.success) {
      this.directory.applications = this.directory.applications.filter(
        (i) => i.key != this.key,
      );
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      }
    }
    return res.success;
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
  async createModule(data: model.ApplicationModel): Promise<IApplication | undefined> {
    data.parentId = this.id;
    data.typeName = '模块';
    data.directoryId = this.directory.id;
    const res = await kernel.createApplication(data);
    if (res.success && res.data.id) {
      const application = new Application(res.data, this.directory, this);
      this.children.push(application);
      return application;
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
      if (this.directory.target.space.user.copyFiles.size > 0) {
        operates.push(fileOperates.Parse);
      }
    }
    return operates;
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
}
