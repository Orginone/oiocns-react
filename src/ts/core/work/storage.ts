import { IForm, XCollection } from '..';
import { Command, model, schema } from './../../base';
import orgCtrl from './../../controller';

// 暂存箱
export interface ITemporaryStorage {
  // 触发器
  command: Command;
  // 键
  key: string;
  // 表单
  form: IForm;
  // 集合
  coll: XCollection<schema.XThing>;
  /** 加载内容 */
  loadContent(): Promise<schema.XThing[]>;
  /** 放入物品 */
  create(data: schema.XThing[]): Promise<schema.XThing[]>;
  /** 拿出物品 */
  remove(data: schema.XThing[]): Promise<boolean>;
  /** 查看暂存物品 */
  loadThing(options: any): Promise<model.LoadResult<schema.XThing[]>>;
  /** 查看数量 */
  count(): Promise<number>;
  /** 发起办事 */
  genInstanceData(things: schema.XThing[]): Promise<schema.XThing[]>;
}

export class TemporaryStorage implements ITemporaryStorage {
  constructor(form: IForm) {
    this.form = form;
    this.coll = orgCtrl.user.directory.resource.genColl(this.key);
    this.command = new Command();
    this.coll?.subscribe([this.key], (data: { key: string; operate: string }) => {
      if (data.key == this.key) {
        this.command.emitter('暂存', data.key);
      }
    });
  }

  get key(): string {
    return 'staging-' + this.form.id;
  }

  coll: XCollection<schema.XThing>;
  form: IForm;
  command: Command;

  async create(data: schema.XThing[]): Promise<schema.XThing[]> {
    const res = await this.coll.replaceMany(data);
    if (res) {
      await this.coll.notity({ operate: 'create', key: this.key });
    }
    return res;
  }

  async remove(data: schema.XThing[]): Promise<boolean> {
    if (await this.coll.removeMany(data)) {
      return await this.coll.notity({ operate: 'delete', key: this.key });
    }
    return false;
  }

  async count(): Promise<number> {
    const res = await this.coll.loadResult({
      options: { match: {} },
      requireTotalCount: true,
      skip: 0,
      take: 1,
    });
    return res.totalCount;
  }

  async loadThing(options: any): Promise<model.LoadResult<schema.XThing[]>> {
    const res = await this.coll.loadResult(options);
    if (res.success && !Array.isArray(res.data)) {
      res.data = [];
    }
    res.totalCount = res.totalCount ?? 0;
    res.groupCount = res.groupCount ?? 0;
    res.summary = res.summary ?? [];
    return res;
  }

  async genInstanceData(things: schema.XThing[]): Promise<schema.XThing[]> {
    const res = await this.form.loadThing({
      options: { match: { id: { _in_: things.map((item) => item.id) } } },
      requireTotalCount: true,
      skip: 0,
      take: things.length,
    });
    return res.data;
  }

  async loadContent(): Promise<schema.XThing[]> {
    const count = await this.count();
    const options = {
      options: { match: {} },
      requireTotalCount: true,
      take: count,
      skip: 0,
    };
    const things = await this.loadThing(options);
    return things.data;
  }
}
