import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { PageAll, companyTypes } from '../../public/consts';
import { SpeciesType, TargetType } from '../../public/enums';
import { ICompany } from '../team/company';
import { IMsgChat } from '../../chat/message/msgchat';
import { ITeam } from '../base/team';
import { IMarket } from '../../thing/market/market';
import { IApplication } from '../../thing/app/application';

/** 组织群接口 */
export interface IGroup extends ITarget {
  /** 加载组织群的单位 */
  company: ICompany;
  /** 父级组织群  */
  parent?: IGroup;
  /** 子组织群 */
  children: IGroup[];
  /** 流通交易 */
  market: IMarket | undefined;
  /** 加载子组织群 */
  loadChildren(reload?: boolean): Promise<IGroup[]>;
  /** 设立子组织群 */
  createChildren(data: model.TargetModel): Promise<IGroup | undefined>;
}

/** 组织群实现 */
export class Group extends Target implements IGroup {
  constructor(_metadata: schema.XTarget, _company: ICompany) {
    super(_metadata, [_metadata.belong?.name ?? '', '组织群'], _company, companyTypes);
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
  get workSpecies(): IApplication[] {
    return this.species.filter(
      (a) => a.metadata.typeName == SpeciesType.Application,
    ) as IApplication[];
  }
  get market(): IMarket | undefined {
    const find = this.species.find((i) => i.metadata.typeName === SpeciesType.Market);
    if (find) {
      return find as IMarket;
    }
    return undefined;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadChildren(reload);
    await this.loadMembers(reload);
    await this.loadSpecies(reload);
    for (const group of this.children) {
      await group.deepLoad(reload);
    }
  }
}
