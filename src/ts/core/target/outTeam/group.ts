import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { PageAll, companyTypes } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ICompany } from '../team/company';
import { ITeam } from '../base/team';
import { targetOperates } from '../../public';
import { ISession } from '../../chat/session';

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
  constructor(_metadata: schema.XTarget, _relations: string[], _company: ICompany) {
    super(_metadata, [..._relations, _metadata.id], _company.user, companyTypes);
    this.space = _company;
    this.relations = [..._relations, _metadata.id];
  }
  space: ICompany;
  parent?: IGroup | undefined;
  children: IGroup[] = [];
  relations: string[];
  private _childrenLoaded: boolean = false;
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
          (i) => new Group(i, this.relations, this.space),
        );
      }
    }
    return this.children;
  }
  async createChildren(data: model.TargetModel): Promise<IGroup | undefined> {
    data.typeName = TargetType.Group;
    const metadata = await this.create(data);
    if (metadata) {
      const group = new Group(metadata, this.relations, this.space);
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
    notity = await super.delete(notity);
    if (notity) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.space.groups = this.space.groups.filter((i) => i.key != this.key);
      }
    }
    return notity;
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
  content(_mode?: number | undefined): ITarget[] {
    return [...this.children];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await Promise.all([
      await this.loadMembers(reload),
      await this.loadChildren(reload),
      await this.directory.loadDirectoryResource(reload),
    ]);
    await Promise.all(
      this.children.map(async (group) => {
        await group.deepLoad(reload);
      }),
    );
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(targetOperates.NewGroup);
    }
    return operates;
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    switch (target.typeName) {
      case TargetType.Group:
        if (this.children.every((i) => i.id != target.id)) {
          const group = new Group(target, this.relations, this.space);
          await group.deepLoad();
          this.children.push(group);
          return true;
        }
        return false;
      default:
        return await this.pullMembers([target], true);
    }
  }
}
