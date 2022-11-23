import BaseTarget from '@/ts/core/target/base';
import { TargetType } from '../enum';
import { schema } from '../../base';

/**
 * 部门的元操作
 */
export default class Department extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.pullTypes = [TargetType.Person];
    this.subTypes = [TargetType.Department, TargetType.Working];
    this.createTargetType = [TargetType.Department, TargetType.Working];
  }
}
