import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { PageAll, companyTypes } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ICompany } from '../team/company';
import { ITeam } from '../base/team';
import { targetOperates } from '../../public';
import { ISession } from '../../chat/session';
import { IFile } from '../../thing/fileinfo';

/** 组织集群接口 */
export interface IGroup extends ITarget {
  /** 父级组织集群  */
  parent?: IGroup;
  /** 子组织集群 */
  children: IGroup[];
  /** 加载子组织集群 */
  loadChildren(reload?: boolean): Promise<IGroup[]>;
  /** 设立子组织集群 */
  createChildren(data: model.TargetModel): Promise<IGroup | undefined>;
}

/** 组织集群实现 */
export class Group extends Target implements IGroup {
  constructor(
    _keys: string[],
    _metadata: schema.XTarget,
    _relations: string[],
    _company: ICompany,
    _parent?: IGroup,
  ) {
    super(
      _keys,
      _metadata,
      [..._relations, _metadata.id],
      _company,
      _company.user,
      companyTypes,
    );
    this.space = _company;
    this.parent = _parent;
    this.keys = [..._keys, this.key];
    this.relations = [..._relations, _metadata.id];
  }
  space: ICompany;
  parent?: IGroup | undefined;
  children: IGroup[] = [];
  keys: string[];
  relations: string[];
  private _childrenLoaded: boolean = false;
  findChat(id: string): ISession | undefined {
    return this.user.companys.find((i) => i.id === id)?.session;
  }
  get superior(): IFile {
    return this.parent ?? this.space;
  }
  async loadChildren(reload?: boolean | undefined): Promise<IGroup[]> {
    if (!this._childrenLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: [TargetType.Group],
        page: PageAll,
      });
      if (res.success) {
        this._childrenLoaded = true;
        this.children = (res.data.result || []).map(
          (i) => new Group(this.keys, i, this.relations, this.space, this),
        );
      }
    }
    return this.children;
  }
  async createChildren(data: model.TargetModel): Promise<IGroup | undefined> {
    data.typeName = TargetType.Group;
    const metadata = await this.create(data);
    if (metadata) {
      const group = new Group(this.keys, metadata, this.relations, this.space, this);
      if (await this.pullSubTarget(group)) {
        this.children.push(group);
        return group;
      }
    }
  }
  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    return this.createChildren(data);
  }
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.space.id) {
      if (await this.removeMembers([this.space.metadata])) {
        if (this.parent) {
          this.parent.children = this.parent.children.filter((i) => i.key != this.key);
        } else {
          this.space.groups = this.space.groups.filter((i) => i.key != this.key);
        }
        return true;
      }
    }
    return false;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    const success = await super.delete(notity);
    if (success) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.space.groups = this.space.groups.filter((i) => i.key != this.key);
      }
    }
    return success;
  }
  get subTarget(): ITarget[] {
    return this.children;
  }
  get chats(): ISession[] {
    return [];
  }
  get targets(): ITarget[] {
    const targets: ITarget[] = [this];
    for (const item of this.children) {
      targets.push(...item.targets);
    }
    return targets;
  }
  content(): IFile[] {
    return this.children;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    this.loadMembers(reload);
    await Promise.all([
      this.loadChildren(reload),
      this.loadIdentitys(reload),
      this.directory.loadDirectoryResource(reload),
    ]);
    await Promise.all(this.children.map((group) => group.deepLoad(reload)));
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(targetOperates.NewGroup);
    }
    return operates;
  }
  override async _addSubTarget(target: schema.XTarget): Promise<string> {
    switch (target.typeName) {
      case TargetType.Group:
        if (this.children.every((i) => i.id != target.id)) {
          const group = new Group(this.keys, target, this.relations, this.space, this);
          await group.deepLoad();
          this.children.push(group);
          return `${this.name}创建了${target.name}.`;
        }
        break;
    }
    return '';
  }
}
