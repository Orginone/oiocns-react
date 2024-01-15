import { List, command, kernel, schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { UserProvider } from '..';

// 草稿箱
export interface IDraftsProvider {
  // 使用草稿箱的用户
  provider: UserProvider;
  // 草稿单据
  drafts: schema.XDrafts[];
  // 获取同一类草稿单据
  groups(typeNames: string[]): schema.XDrafts[];
  // 获取关联草噶
  relations(relations: string, typeNames: string[]): schema.XDrafts[];
  /** 创建草稿 */
  createDraft(data: schema.XDrafts): Promise<schema.XDrafts | undefined>;
  /** 移除草稿 */
  removeDraft(data: schema.XDrafts[]): Promise<boolean>;
  /** 查看所有草稿单据 */
  loadDrafts(reload?: boolean): Promise<schema.XDrafts[]>;
}

export class DraftsProvider implements IDraftsProvider {
  constructor(_provider: UserProvider) {
    this.provider = _provider;
    this.key = generateUuid();
    this.coll?.subscribe(
      [this.key],
      (message: { operate: string; data: schema.XDrafts[] }) => {
        switch (message.operate) {
          case 'create':
            this.drafts.push(...message.data);
            break;
          case 'delete':
            {
              const ids = message.data.map((item) => item.id);
              this.drafts = this.drafts.filter((item) => !ids.includes(item.id));
            }
            break;
        }
        command.emitter('drafts', 'refresh');
      },
    );
  }
  
  drafts: schema.XDrafts[] = [];
  key: string;
  provider: UserProvider;
  private _draftLoaded = false;

  get coll() {
    return this.provider.user?.resource.draftsColl;
  }

  groups(typeNames: string[]): schema.XDrafts[] {
    return this.drafts.filter((item) => typeNames.includes(item.typeName));
  }

  relations(relations: string, typeNames: string[]): schema.XDrafts[] {
    return this.drafts
      .filter((item) => item.relations == relations)
      .filter((item) => typeNames.includes(item.typeName));
  }

  async createDraft(data: schema.XDrafts): Promise<schema.XDrafts | undefined> {
    const res = await this.coll?.insert(data);
    if (res) {
      await this.coll?.notity({ data: [res], operate: 'create' });
      return res;
    }
  }

  async removeDraft(data: schema.XDrafts[]): Promise<boolean> {
    let res = await this.coll?.removeMany(data);
    if (res) {
      res = await this.coll?.notity({ data: data, operate: 'delete' });
      return res ?? false;
    }
    return false;
  }

  async loadDrafts(reload?: boolean | undefined): Promise<schema.XDrafts[]> {
    if (!this._draftLoaded || reload) {
      let res = await this.coll?.all(reload);
      if (res) {
        this._draftLoaded = true;
        this.drafts = res;
        await this._loadThings(this.groups(['实体']));
        command.emitter('drafts', 'refresh');
      }
    }
    return this.drafts;
  }

  private async _loadThings(drafts: schema.XDrafts[]) {
    const groups = new List(drafts).GroupBy((item) => item.relations);
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
        for (const draft of groups[key]) {
          for (const thing of res.data) {
            if (draft.data.id == thing.id) {
              draft.data = thing;
              break;
            }
          }
        }
      }
    }
    return drafts;
  }
}
