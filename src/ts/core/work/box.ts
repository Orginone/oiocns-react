import { List, command, kernel, schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { UserProvider } from '..';

// 暂存箱
export interface IBoxProvider {
  // 使用箱子的用户
  provider: UserProvider;
  // 暂存的物品
  stagings: schema.XStaging[];
  // 获取同一类物品
  groups(typeNames: string[]): schema.XStaging[];
  // 获取关系物品
  relations(relations: string, typeNames: string[]): schema.XStaging[];
  /** 放入物品 */
  createStaging(data: schema.XStaging): Promise<schema.XStaging | undefined>;
  /** 拿出物品 */
  removeStaging(data: schema.XStaging[]): Promise<boolean>;
  /** 查看所有物品 */
  loadStagings(reload?: boolean): Promise<schema.XStaging[]>;
}

export class BoxProvider implements IBoxProvider {
  constructor(_provider: UserProvider) {
    this.provider = _provider;
    this.key = generateUuid();
    this.coll?.subscribe(
      [this.key],
      (message: { operate: string; data: schema.XStaging[] }) => {
        switch (message.operate) {
          case 'create':
            this.stagings.push(...message.data);
            break;
          case 'delete':
            {
              const ids = message.data.map((item) => item.id);
              this.stagings = this.stagings.filter((item) => !ids.includes(item.id));
            }
            break;
        }
        command.emitter('stagings', 'refresh');
      },
    );
  }

  key: string;
  provider: UserProvider;
  stagings: schema.XStaging[] = [];
  private _stagingLoaded = false;

  get coll() {
    return this.provider.user?.resource.stagingColl;
  }

  groups(typeNames: string[]): schema.XStaging[] {
    return this.stagings.filter((item) => typeNames.includes(item.typeName));
  }

  relations(relations: string, typeNames: string[]): schema.XStaging[] {
    return this.stagings
      .filter((item) => item.relations == relations)
      .filter((item) => typeNames.includes(item.typeName));
  }

  async createStaging(data: schema.XStaging): Promise<schema.XStaging | undefined> {
    const res = await this.coll?.insert(data);
    if (res) {
      await this.coll?.notity({ data: [res], operate: 'create' });
      return res;
    }
  }

  async removeStaging(data: schema.XStaging[]): Promise<boolean> {
    let res = await this.coll?.removeMany(data);
    if (res) {
      res = await this.coll?.notity({ data: data, operate: 'delete' });
      return res ?? false;
    }
    return false;
  }

  async loadStagings(reload?: boolean | undefined): Promise<schema.XStaging[]> {
    if (!this._stagingLoaded || reload) {
      let res = await this.coll?.all(reload);
      if (res) {
        this._stagingLoaded = true;
        this.stagings = res;
        await this._loadThings(this.groups(['实体']));
        command.emitter('stagings', 'refresh');
      }
    }
    return this.stagings;
  }

  private async _loadThings(stagings: schema.XStaging[]) {
    const groups = new List(stagings).GroupBy((item) => item.relations);
    for (const key in groups) {
      const keyWords = key.split(':');
      if (keyWords.length <= 1) {
        continue;
      }
      const res = await kernel.loadThing(keyWords[0], keyWords[1].split('-'), {
        options: {
          match: { id: { _in_: groups[key].map((item) => item.data.id) } },
        },
      });
      if (res && res.data) {
        for (const staging of groups[key]) {
          for (const thing of res.data) {
            if (staging.data.id == thing.id) {
              staging.data = thing;
              break;
            }
          }
        }
      }
    }
    return stagings;
  }
}
