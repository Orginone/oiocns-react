import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { PageAll, companyTypes } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ICompany } from '../team/company';
import { IMsgChat } from '../../chat/message/msgchat';
import { ITeam } from '../base/team';

/** 单位群接口 */
export interface IGroup extends ITarget {
  /** 加载单位群的单位 */
  company: ICompany;
  /** 父级单位群  */
  parent?: IGroup;
  /** 子单位群 */
  children: IGroup[];
  /** 加载子单位群 */
  loadChildren(reload?: boolean): Promise<IGroup[]>;
  /** 设立子单位群 */
  createChildren(data: model.TargetModel): Promise<IGroup | undefined>;
}

/** 单位群实现 */
export class Group extends Target implements IGroup {
  constructor(_metadata: schema.XTarget, _company: ICompany) {
    super(_metadata, ['集团群'], _company, companyTypes);
    this.company = _company;
  }
  company: ICompany;
  parent?: IGroup | undefined;
  children: IGroup[] = [];
  private _childrenLoaded: boolean = false;
  async loadChildren(reload?: boolean | undefined): Promise<IGroup[]> {
    if (!this._childrenLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.metadata.id,
        subTypeNames: this.memberTypes,
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
      this.children.push(group);
      return group;
    }
  }
  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    return this.createChildren(data);
  }
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.company.metadata.id) {
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
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.company.groups = this.company.groups.filter((i) => i.key != this.key);
      }
    }
    return res.success;
  }
  get subTarget(): ITarget[] {
    return this.children;
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    for (const item of this.children) {
      chats.push(...item.chats);
    }
    return chats;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadChildren(reload);
    await this.loadMembers(reload);
    await this.loadSpecies(reload);
    await this.loadIdentitys(reload);
    for (const group of this.children) {
      await group.deepLoad(reload);
    }
  }
}
