import { kernel } from '../../base';
import consts from '../consts';
import { TargetType } from '../enum';
import { ApplicationTodo } from './application';
import { ITodo, ITodoGroup } from './itodo';
import { OrgTodo } from './orgtodo';
import { PublishTodo } from './publish';

export default class Todo implements ITodo {
  private _todoGroup: ITodoGroup[];
  private _applicationTodo: ITodoGroup[];

  async getCount(): Promise<number> {
    let sum: number = 0;
    this._todoGroup.forEach(async (a) => {
      sum += await a.getCount();
    });
    return sum;
  }
  constructor() {
    this._todoGroup.push(new OrgTodo('好友申请', [TargetType.Person]));
    this._todoGroup.push(
      new OrgTodo('单位审核', [
        TargetType.Cohort,
        TargetType.Group,
        ...consts.CompanyTypes,
      ]),
    );
    this._todoGroup.push(new PublishTodo('应用上架'));
    // this._todoGroup.push(new JoinMarketTodo('应用上架'));
  }
  async getTodoGroup(): Promise<ITodoGroup[]> {
    if (this._applicationTodo.length <= 0) {
      const res = await kernel.queryApprovalProduct();
      if (res.success) {
        res.data.forEach((a) => {
          this._todoGroup.push(new ApplicationTodo(a.id, a.name));
        });
      }
    }
    return this._todoGroup;
  }
}
