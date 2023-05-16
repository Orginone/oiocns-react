import { IPerson } from '../target/person';
import { kernel, schema } from '../../base';
import { ITarget } from './base/target';
import { ITeam } from './base/team';

export interface ITargetProvider {
  // 当前用户
  user: IPerson;
  // 用户变更
  prodTargetChange(
    operate: string,
    typeName: string,
    userIds: string[],
    target: ITeam,
    subTarget: schema.XTarget,
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
    operate: string,
    typeName: string,
    userIds: string[],
    target: ITarget,
    subTarget: schema.XTarget,
  ) {
    await kernel.createTargetMessage({
      userIds: userIds,
      data: JSON.stringify({ target, subTarget, operate, typeName }),
    });
  }
  async _recvTarget(recvData: any) {
    let data = JSON.parse(recvData);
    let target = this.user.targets.find((a) => a.metadata.id == data.target.id);
    switch (data['typeName']) {
      case 'Target':
        if (target) {
          target.metadata = data.target;
        }
        break;
      case 'Relation':
        let subTarget = [this.user, ...this.user.targets].find(
          (a) => a.metadata.id == data.subTarget.id,
        );
        if (target) {
          target.recvTarget(data.operate, true, data.subTarget);
        } else if (subTarget) {
          subTarget.recvTarget(data.operate, false, data.target);
        }
        break;
      default:
        break;
    }
  }
}
