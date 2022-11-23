import { TargetType } from '../enum';
import { faildResult, model, schema, kernel, common } from '../../base';
import { ISubTarget } from './itarget';
import Working from './working';
import Cohort from './cohort';
import consts from '../consts';
import Provider from '../provider';

/**
 * 部门的元操作
 */
export default class Department extends Cohort implements ISubTarget {
  subTargets: ISubTarget[];
  parentTargets: ISubTarget[];

  get subTypes(): TargetType[] {
    return [TargetType.Department, TargetType.Working];
  }

  constructor(target: schema.XTarget) {
    super(target);
    this.subTargets = [];
    this.parentTargets = [];
  }

  public async createSubTarget(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    targetType: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.subTypes.includes(targetType)) {
      const res = await this.createTarget(
        name,
        code,
        targetType,
        teamName,
        teamCode,
        remark,
      );
      if (res.success) {
        switch (targetType) {
          case TargetType.Department:
            this.subTargets.push(new Department(res.data));
            break;
          case TargetType.Working:
            this.subTargets.push(new Working(res.data));
            break;
          default:
            break;
        }
        return await kernel.pullAnyToTeam({
          id: this.target.id,
          teamTypes: [this.target.typeName],
          targetIds: [res.data?.id],
          targetType: targetType,
        });
      }
    }
    return faildResult(consts.UnauthorizedError);
  }

  public async deleteSubTarget(id: string): Promise<model.ResultType<any>> {
    const sub = this.subTargets.find((sub) => {
      return sub.target.id == id;
    });
    if (sub != undefined) {
      let res = await kernel.deleteTarget({
        id: id,
        typeName: sub.target.typeName,
        belongId: Provider.spaceId,
      });
      if (res.success) {
        this.subTargets = this.subTargets.filter((sub) => {
          return sub.target.id != id;
        });
      }
    }
    return faildResult(consts.UnauthorizedError);
  }
}
