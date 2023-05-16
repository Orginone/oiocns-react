import { IPerson } from '../target/person';
import { kernel, schema } from '../../base';
import { ITeam } from './base/team';
import { TargetType } from '../public/enums';

export enum OperateType {
  'Add' = '新增',
  'Remove' = '移除',
  'Update' = '更新',
  'Delete' = '删除',
}

type MessaeModel = {
  operate: OperateType;
  typeName: string;
  target: schema.XTarget;
  subTarget?: schema.XTarget;
};

export interface ITargetProvider {
  // 当前用户
  user: IPerson;
  /**
   * 用户变更
   * @param operate 操作方法
   * @param target 用户对象
   * @param isExcludeSelf 是否排除通知当前用户
   */
  prodTargetChange(
    operate: OperateType,
    target: ITeam,
    isExcludeSelf?: boolean,
  ): Promise<void>;
  /**
   * 用户关系变更
   * @param operate 操作方法
   * @param team 主体对象
   * @param subTarget 子对象
   * @param isExcludeSelf 主体对象
   */
  prodRelationChange(
    operate: OperateType,
    team: ITeam,
    subTarget: schema.XTarget,
    isExcludeSelf?: boolean,
  ): Promise<void>;
}

export class TargetProvider implements ITargetProvider {
  user: IPerson;
  constructor(_user: IPerson) {
    this.user = _user;
    kernel.on('RecvTarget', (data) => {
      this._recvTarget(data);
    });
  }
  async prodTargetChange(
    operate: OperateType,
    team: ITeam,
    isExcludeSelf: boolean = true,
  ): Promise<void> {
    let targetIds = new Set<string>();
    let teamIds: string[] = [];
    switch (team.metadata.typeName) {
      case TargetType.Group:
        teamIds.push(team.metadata.id);
        break;
      case TargetType.Cohort:
        if (team.space.metadata.typeName != TargetType.Person) {
          teamIds.push(team.space.metadata.id);
        }
        teamIds.push(team.metadata.id);
        break;
      case TargetType.Person:
        teamIds.push(...(team as IPerson).cohorts.map((a) => a.metadata.id));
        teamIds.push(...(team as IPerson).companys.map((a) => a.metadata.id));
        break;
      default:
        if (team.space) {
          teamIds.push(team.space.metadata.id);
        } else {
          teamIds.push(team.metadata.id);
        }
        break;
    }
    console.log({
      teamIds,
      targetIds,
      isExcludeSelf,
      data: {
        operate,
        typeName: 'Target',
        target: team.metadata,
      },
    });
  }
  async prodRelationChange(
    operate: OperateType,
    team: ITeam,
    subTarget: schema.XTarget,
    isExcludeSelf: boolean = true,
  ): Promise<void> {
    let teamIds: string[] = [];
    let targetIds = new Set<string>();
    switch (team.metadata.typeName) {
      case TargetType.Group:
        teamIds = team.members.map((a) => a.id);
        teamIds.push(subTarget.id);
        break;
      case TargetType.Cohort:
        if (team.space.metadata.typeName != TargetType.Person) {
          teamIds.push(team.space.metadata.id);
        }
        teamIds.push(team.metadata.id);
        targetIds.add(subTarget.id);
        break;
      case TargetType.Person:
        targetIds.add(subTarget.id);
        break;
      default:
        if (team.space) {
          teamIds.push(team.space.metadata.id);
        } else {
          teamIds.push(team.metadata.id);
        }
        targetIds.add(subTarget.id);
        break;
    }
    console.log({
      targetIds,
      teamIds,
      isExcludeSelf,
      data: {
        operate,
        typeName: 'Relation',
        target: team.metadata,
        subTarget,
      },
    });
  }

  async _recvTarget(recvData: any) {
    let data = JSON.parse(recvData) as MessaeModel;
    let target = this.user.targets.find((a) => a.metadata.id == data.target.id);
    switch (data.typeName) {
      case 'Target':
        target?.recvTarget(data.operate, data.target);
        break;
      case 'Relation':
        let subTarget = [this.user, ...this.user.targets].find(
          (a) => a.metadata.id == data.subTarget!.id,
        );
        if (target) {
          target.recvRelation(data.operate, true, data.subTarget!);
        } else if (subTarget) {
          subTarget.recvRelation(data.operate, false, data.target);
        }
        break;
      default:
        break;
    }
  }
}
