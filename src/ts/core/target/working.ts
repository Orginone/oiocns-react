import { schema } from '@/ts/base';
import BaseTarget from '@/ts/core/target/base';
import { TargetType } from '../enum';

/**
 * 部门的元操作
 */
export default class Working extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.pullTypes = [TargetType.Person];
    this.subTypes = [TargetType.Working];
    this.createTargetType = [TargetType.Working];
  }
}
