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

type TargetMsgDataModel = {
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
    await kernel.createTargetMsg({
      targetId: team.metadata.id,
      excludeOperater: isExcludeSelf,
      data: JSON.stringify({
        operate,
        target: team.metadata,
      }),
    });
  }
  async prodRelationChange(
    operate: OperateType,
    team: ITeam,
    subTarget: schema.XTarget,
    isExcludeSelf: boolean = true,
  ): Promise<void> {
    let targetId = team.metadata.id;
    if (team.metadata.typeName == TargetType.Person) {
      targetId = subTarget.id;
    }
    await kernel.createTargetMsg({
      targetId,
      excludeOperater: isExcludeSelf,
      data: JSON.stringify({
        operate,
        target: team.metadata,
        subTarget,
      }),
    });
  }

  async _recvTarget(recvData: any) {
    const data = JSON.parse(recvData) as TargetMsgDataModel;
    if (data) {
      switch (data.typeName) {
        case 'Target':
          for (const target of this.user.targets) {
            if (target.metadata.id == data.target.id) {
              target.recvTarget(data.operate, data.target);
            }
            const index = target.members.findIndex((a) => a.id == data.target.id);
            if (index > -1) {
              target.members[index] = data.target;
            }
          }
          break;
        case 'Relation':
          let subTarget = [this.user, ...this.user.companys].find(
            (a) => a.metadata.id == data.subTarget!.id,
          );
          if (subTarget) {
            subTarget.recvRelation(data.operate, false, data.target);
            return;
          }
          for (const target of this.user.targets) {
            if (target.metadata.id == data.target.id) {
              target.recvRelation(data.operate, true, data.subTarget!);
            }
          }
          break;
        default:
          break;
      }
    }
  }
}
