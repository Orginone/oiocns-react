import BaseTarget from './base';
import { XTarget } from '@/ts/base/schema';
import { IGroup, ISpace, ITarget, TargetParam } from './itarget';
import { companyTypes, TargetType } from '../enum';
import { kernel } from '@/ts/base';
import { logger } from '@/ts/base/common';
import { TargetModel } from '@/ts/base/model';

export default class Group extends BaseTarget implements IGroup {
  subGroupLoaded: boolean = false;
  subGroup: IGroup[];
  private _onDeleted: Function;
  constructor(target: XTarget, space: ISpace, userId: string, onDeleted: Function) {
    super(target, space, userId);
    this.subGroup = [];
    this._onDeleted = onDeleted;
    this.memberTypes = companyTypes;
    this.subTeamTypes = [TargetType.Group];
    this.joinTargetType = [TargetType.Group];
    this.createTargetType = [TargetType.Group];
    this.searchTargetType = [...companyTypes, TargetType.Group];
  }
  public get subTeam(): ITarget[] {
    return this.subGroup;
  }
  async loadSubTeam(reload?: boolean): Promise<ITarget[]> {
    await this.getSubGroups(reload);
    return this.subGroup;
  }

  public async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadSubTeam(reload);
    for (const item of this.subGroup) {
      await item.deepLoad(reload);
    }
  }

  public async create(data: TargetModel): Promise<ITarget | undefined> {
    switch (data.typeName as TargetType) {
      case TargetType.Group:
        return this.createSubGroup(data);
    }
  }

  async delete(): Promise<boolean> {
    const res = await this.deleteTarget();
    if (res.success) {
      this._onDeleted?.apply(this, []);
    }
    return res.success;
  }

  public async applyJoinGroup(id: string): Promise<boolean> {
    return super.applyJoin(id, TargetType.Group);
  }
  public async createSubGroup(data: TargetParam): Promise<IGroup | undefined> {
    const tres = await this.searchTargetByName(data.code, [TargetType.Group]);
    if (!tres.result) {
      const res = await this.createTarget({
        ...data,
        belongId: this.target.belongId,
      });
      if (res.success) {
        const group = new Group(res.data, this.space, this.userId, () => {
          this.subGroup = this.subGroup.filter((item) => {
            return item.id != group.id;
          });
        });
        this.subGroup.push(group);
        await this.pullSubTeam(group.target);
        return group;
      }
    } else {
      logger.warn('该集团已存在');
    }
  }
  public async deleteSubGroup(id: string): Promise<boolean> {
    const group = this.subGroup.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.subGroup = this.subGroup.filter((group) => {
          return group.target.id != id;
        });
        return true;
      }
    }
    return false;
  }
  public async getSubGroups(reload: boolean = false): Promise<IGroup[]> {
    if (!reload && this.subGroupLoaded) {
      return this.subGroup;
    }
    this.subGroupLoaded = true;
    const res = await this.getSubTargets([TargetType.Group]);
    if (res.success) {
      this.subGroup =
        res.data.result?.map((a) => {
          return new Group(a, this.space, this.userId, () => {
            this.subGroup = this.subGroup.filter((item) => {
              return item.id != a.id;
            });
          });
        }) ?? [];
    } else {
      this.subGroupLoaded = false;
    }
    return this.subGroup;
  }
}
