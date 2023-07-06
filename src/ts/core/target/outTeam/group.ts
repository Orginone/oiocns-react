import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { PageAll, companyTypes } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ICompany } from '../team/company';
import { IMsgChat } from '../../chat/message/msgchat';
import { ITeam } from '../base/team';
import { targetOperates } from '../../public';

/** 组织集群接口 */
export interface IGroup extends ITarget {
  /** 加载组织集群的单位 */
  company: ICompany;
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
  constructor(_metadata: schema.XTarget, _company: ICompany) {
    super(_metadata, [_metadata.belong?.name ?? '', '组织集群'], _company, companyTypes);
    this.company = _company;
  }
  company: ICompany;
  parent?: IGroup | undefined;
  children: IGroup[] = [];
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
        this.children = (res.data.result || []).map((i) => new Group(i, this.company));
      }
    }
    return this.children;
  }
  async createChildren(data: model.TargetModel): Promise<IGroup | undefined> {
    data.typeName = TargetType.Group;
    const metadata = await this.create(data);
    if (metadata) {
      const group = new Group(metadata, this.company);
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
    if (this.metadata.belongId !== this.company.id) {
      if (await this.removeMembers([this.company.metadata])) {
        if (this.parent) {
          this.parent.children = this.parent.children.filter((i) => i.key != this.key);
        } else {
          this.company.groups = this.company.groups.filter((i) => i.key != this.key);
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
        this.company.groups = this.company.groups.filter((i) => i.key != this.key);
      }
    }
    return notity;
  }
  get subTarget(): ITarget[] {
    return this.children;
  }
  get chats(): IMsgChat[] {
    return [];
  }
  get targets(): ITarget[] {
    const targets: ITarget[] = [this];
    for (const item of this.children) {
      targets.push(...item.targets);
    }
    return targets;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.directory.loadSubDirectory();
    await this.loadChildren(reload);
    await this.loadMembers(reload);
    for (const group of this.children) {
      await group.deepLoad(reload);
    }
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
          const group = new Group(target, this.company);
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
