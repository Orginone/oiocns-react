import { command, kernel, model, schema } from '../../../base';
import { PageAll, directoryOperates, fileOperates } from '../../public';
import { IDirectory } from '../directory';
import { IFile, IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { IWork, Work } from '../../work';

/** 应用/模块接口类 */
export interface IApplication extends IStandardFileInfo<schema.XApplication> {
  /** 上级模块 */
  parent: IApplication | undefined;
  /** 下级模块 */
  children: IApplication[];
  /** 流程定义 */
  works: IWork[];
  /** 结构变更 */
  structCallback(): void;
  /** 根据id查找办事 */
  findWork(id: string): Promise<IWork | undefined>;
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
    this.isContainer = true;
    this.loadChildren(_applications);
  }
  works: IWork[] = [];
  children: IApplication[] = [];
  parent: IApplication | undefined;
  private _worksLoaded: boolean = false;
  get locationKey(): string {
    return this.key;
  }
  get cacheFlag(): string {
    return 'applications';
  }
  content(): IFile[] {
    return [...this.children, ...this.works].sort((a, b) =>
      a.metadata.updateTime < b.metadata.updateTime ? 1 : -1,
    );
  }
  structCallback(): void {
    command.emitter('executor', 'refresh', this);
  }
  async copy(_: IDirectory): Promise<boolean> {
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (!this.parent && this.allowMove(destination)) {
      const applications = this.getChildren(this);
      const data = await destination.resource.applicationColl.replaceMany(
        applications.map((a) => {
          return { ...a, directoryId: destination.id };
        }),
      );
      if (data && data.length > 0) {
        await this.notify('remove', this.metadata);
        await destination.notify('reload', {
          ...destination.metadata,
          directoryId: destination.id,
        });
      }
    }
    return false;
  }
  async hardDelete(): Promise<boolean> {
    if (
      await this.directory.resource.applicationColl.removeMany(this.getChildren(this))
    ) {
      this.notify('remove', this.metadata);
    }
    return false;
  }
  async findWork(id: string): Promise<IWork | undefined> {
    await this.loadWorks();
    const find = this.works.find((i) => i.id === id);
    if (find) {
      return find;
    }
    for (const item of this.children) {
      const find = await item.findWork(id);
      if (find) {
        return find;
      }
    }
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
      work.notify('workInsert', work.metadata);
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
    const result = await this.directory.resource.applicationColl.insert(data);
    if (result) {
      this.notify('insert', result);
      return result;
    }
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadWorks(reload);
    return true;
  }
  override operates(): model.OperateModel[] {
    const operates: model.OperateModel[] = [
      directoryOperates.Refesh,
      ...super.operates(),
    ];
    if (this.directory.target.hasRelationAuth()) {
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
    const applications: schema.XApplication[] = [application.metadata];
    for (const child of application.children) {
      applications.push(...this.getChildren(child));
    }
    return applications;
  }
  override receive(operate: string, data: schema.XApplication): boolean {
    if (data.id === this.id) {
      this.coll.removeCache((i) => i.id != data.id);
      super.receive(operate, data);
      this.coll.cache.push(this._metadata);
      (this.parent || this.directory).changCallback();
      return true;
    } else if (data.parentId === this.id) {
      if (operate.startsWith('work')) {
        this.workReceive(operate, data);
      } else {
        switch (operate) {
          case 'insert':
            this.coll.cache.push(data);
            this.children.push(new Application(data, this.directory, this));
            break;
          case 'remove':
            this.coll.removeCache((i) => i.id != data.id);
            this.children = this.children.filter((a) => a.id != data.id);
            break;
          default:
            this.children.find((i) => i.id === data.id)?.receive(operate, data);
            break;
        }
      }
      this.structCallback();
      return true;
    } else {
      for (const child of this.children) {
        if (child.receive(operate, data)) {
          return true;
        }
      }
    }
    return false;
  }
  workReceive(operate: string, data: any): boolean {
    switch (operate) {
      case 'workInsert':
        if (this.works.every((i) => i.id != data.id)) {
          let work = new Work(data as unknown as schema.XWorkDefine, this);
          this.works.push(work);
        }
        break;
      case 'workRemove':
        this.works = this.works.filter((i) => i.id != data.id);
        break;
      case 'workReplace':
        this.works.find((i) => i.id === data.id)?.receive(operate, data);
        break;
    }
    return true;
  }
}
