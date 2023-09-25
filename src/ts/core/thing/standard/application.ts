import { command, kernel, model, schema } from '../../../base';
import { PageAll, directoryOperates, fileOperates } from '../../public';
import { IDirectory } from '../directory';
import orgCtrl from '@/ts/controller';
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
  /** 接收模块变更消息 */
  receiveMessage(operate: string, data: schema.XApplication): Promise<boolean>;
  /** 缓存应用数据 */
  cacheCommonApplications(data?: IApplication): Promise<boolean>;
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
  structCallback(): void {
    console.log(this.metadata);
    command.emitter('-', 'refresh', this);
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
        await this.notify('refresh', [this.directory.metadata]);
        await destination.notify('refresh', [destination.metadata]);
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
    const applications: schema.XApplication[] = [application.metadata];
    for (const child of application.children) {
      applications.push(child.metadata);
      applications.push(...this.getChildren(child));
    }
    return applications;
  }

  async receiveMessage(operate: string, data: schema.XApplication): Promise<boolean> {
    console.log('operate', operate);
    console.log('this.coll.cache', this.coll.cache);
    if (data.parentId == this.id) {
      switch (operate) {
        case 'insert':
          this.coll.cache.push(data);
          this.children.push(new Application(data, this.directory, this));
          break;
        case 'replace':
          {
            const index = this.coll.cache.findIndex((a) => a.id == data.id);
            this.coll.cache[index] = data;
            const childIndex = this.children.findIndex((a) => a.id == data.id);
            (this.children[childIndex] as Application).setMetadata(data);
          }
          break;
        case 'delete':
          await this.coll.removeCache(data.id);
          this.children = this.children.filter((a) => a.id != data.id);
          break;
      }
      this.structCallback();
      return true;
    } else {
      for (const child of this.children) {
        await child.receiveMessage(operate, data);
      }
    }
    return false;
  }
  unique(data: []) {
    let result = {};
    let finalResult = [];
    for (let i = 0; i < data.length; i++) {
      result[data[i].id] = data[i];
    }
    for (let item in result) {
      finalResult.push(result[item]);
    }
    return finalResult;
  }

  async cacheCommonApplications(data: IApplication): Promise<boolean> {
    const applications = orgCtrl.user.cacheObj.cache.commonApplications || [];
    applications.push(data);
    // 根据id去重
    let commonApplications = this.unique(applications);

    console.log('commonApplications', commonApplications);
    const success = await orgCtrl.user.cacheObj.set(
      'commonApplications',
      commonApplications,
    );
    // console.log('success', success);
    return success;
  }
}
