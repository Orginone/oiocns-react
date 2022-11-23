import { TargetType } from '../enum';
import Department from './department';

/**
 * 部门的元操作
 */
export default class Working extends Department {
  get subTypes(): TargetType[] {
    return [TargetType.Working];
  }
}
