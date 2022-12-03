import { OrgTodo } from './orgrelation';
import { kernel } from '../../base';
import { ApplicationTodo } from './application';
import { ITodo, ITodoGroup } from './itodo';
import { PublishTodo } from './publish';
import { MarketJoinTodo } from './marketjoin';

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
    this._todoGroup.push(new OrgTodo());
    this._todoGroup.push(new PublishTodo());
    this._todoGroup.push(new MarketJoinTodo());
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
