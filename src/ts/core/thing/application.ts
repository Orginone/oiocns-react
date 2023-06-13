import { kernel, model, schema } from '../../base';
import { Entity, PageAll } from '../public';
import { IDirectory } from './directory';
import { IFileInfo } from './fileinfo';
import { IWork, Work } from '../work';

/** 应用/模块接口类 */
export interface IApplication extends IFileInfo<schema.XApplication> {
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
}

/** 应用实现类 */
export class Application extends Entity<schema.XApplication> implements IApplication {
  constructor(
    _metadata: schema.XApplication,
    _directory: IDirectory,
    _parent?: IApplication,
  ) {
    super(_metadata);
    this.parent = _parent;
    this.directory = _directory;
  }
  works: IWork[] = [];
  directory: IDirectory;
  children: IApplication[] = [];
  parent: IApplication | undefined;
  private _worksLoaded: boolean = false;
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
    data.appicationId = this.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let work = new Work(res.data, this);
      this.works.push(work);
      return work;
    }
  }
}
