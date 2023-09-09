import { kernel, schema } from '../../base';

/** 集合工具类 */
export class Collection<T extends schema.Xbase> {
  private _loaded: boolean;
  private _cache: T[];
  private _collName: string;
  private _target: schema.XTarget;
  private _relations: string[];
  constructor(target: schema.XTarget, name: string, relations: string[]) {
    this._cache = [];
    this._loaded = false;
    this._collName = name;
    this._target = target;
    this._relations = relations;
  }

  get cache(): T[] {
    return this._cache;
  }

  get collName(): string {
    return this._collName;
  }

  async all(): Promise<T[]> {
    if (!this._loaded) {
      this._cache = await this.load({});
      this._loaded = true;
    }
    return this._cache;
  }

  async find(ids?: string[]): Promise<T[]> {
    if (ids && ids.length > 0) {
      return await this.loadSpace({
        options: {
          match: {
            _id: {
              _in_: ids,
            },
          },
        },
      });
    }
    return [];
  }

  async loadSpace(options: any): Promise<T[]> {
    options = options || {};
    options.userData = options.userData || [];
    options.collName = this._collName;
    options.options = options.options || {};
    options.options.match = options.options.match || {};
    options.options.match.isDeleted = false;
    const res = await kernel.collectionLoad<T[]>(
      this._target.belongId,
      this._relations,
      options,
    );
    if (res.success && res.data) {
      return res.data || [];
    }
    return [];
  }

  async load(options: any): Promise<T[]> {
    options = options || {};
    options.options = options.options || {};
    options.options.match = options.options.match || {};
    options.options.match.shareId = this._target.id;
    return await this.loadSpace(options);
  }

  async insert(data: T, copyId?: string): Promise<T | undefined> {
    data.id = data.id || 'snowId()';
    data.shareId = this._target.id;
    data.belongId = data.belongId || this._target.belongId;
    const res = await kernel.collectionInsert<T>(
      this._target.belongId,
      this._relations,
      this._collName,
      data,
      copyId,
    );
    if (res.success) {
      if (res.data && this._loaded) {
        this._cache.push(res.data);
      }
      return res.data;
    }
  }

  async insertMany(data: T[], copyId?: string): Promise<T[]> {
    data = data.map((a) => {
      a.id = a.id || 'snowId()';
      a.shareId = this._target.id;
      a.belongId = a.belongId || this._target.belongId;
      return a;
    });
    const res = await kernel.collectionInsert<T[]>(
      this._target.belongId,
      this._relations,
      this._collName,
      data,
      copyId,
    );
    if (res.success) {
      if (res.data && res.data.length > 0 && this._loaded) {
        this._cache.push(...res.data);
      }
      return res.data || [];
    }
    return [];
  }

  async replace(data: T, copyId?: string): Promise<T | undefined> {
    data.shareId = this._target.id;
    data.belongId = data.belongId || this._target.belongId;
    const res = await kernel.collectionReplace<T>(
      this._target.belongId,
      this._relations,
      this._collName,
      data,
      copyId,
    );
    if (res.success) {
      if (res.data && this._loaded) {
        this._cache = this._cache.map((i) => {
          if (i.id == res.data.id) {
            return res.data;
          }
          return i;
        });
      }
      return res.data;
    }
  }

  async replaceMany(data: T[], copyId?: string): Promise<T[]> {
    data = data.map((a) => {
      a.shareId = this._target.id;
      a.belongId = a.belongId || this._target.belongId;
      return a;
    });
    const res = await kernel.collectionReplace<T[]>(
      this._target.belongId,
      this._relations,
      this._collName,
      data,
      copyId,
    );
    if (res.success) {
      if (res.data && res.data.length > 0 && this._loaded) {
        this._cache = this._cache.map((i) => {
          for (const item of res.data) {
            if (item.id === i.id) {
              return item;
            }
          }
          return i;
        });
      }
      return res.data || [];
    }
    return [];
  }
  async update(id: string, update: any, copyId?: string): Promise<T | undefined> {
    const res = await kernel.collectionSetFields<T>(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        id,
        update,
      },
      copyId,
    );
    if (res.success) {
      return res.data;
    }
  }
  async updateMany(ids: string[], update: any, copyId?: string): Promise<T[]> {
    const res = await kernel.collectionSetFields<T[]>(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        ids,
        update,
      },
      copyId,
    );
    if (res.success) {
      return res.data;
    }
    return [];
  }
  async delete(data: T, copyId?: string): Promise<boolean> {
    const res = await kernel.collectionUpdate(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        match: { _id: data.id },
        update: {
          _set_: {
            isDeleted: true,
          },
        },
      },
      copyId,
    );
    if (res.success) {
      if (res.data?.MatchedCount > 0 && this._loaded) {
        this._cache = this._cache.filter((i) => i.id != data.id);
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async deleteMany(data: T[], copyId?: string): Promise<boolean> {
    const res = await kernel.collectionUpdate(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        match: {
          _id: {
            _in_: data.map((i) => i.id),
          },
        },
        update: {
          _set_: {
            isDeleted: true,
          },
        },
      },
      copyId,
    );
    if (res.success) {
      if (res.data?.MatchedCount > 0 && this._loaded) {
        this._cache = this._cache.filter((i) => data.every((a) => a.id != i.id));
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async deleteMatch(match: any, copyId?: string): Promise<boolean> {
    const res = await kernel.collectionUpdate(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        match: match,
        update: {
          _set_: {
            isDeleted: true,
          },
        },
      },
      copyId,
    );
    if (res.success) {
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async remove(data: T, copyId?: string): Promise<boolean> {
    const res = await kernel.collectionRemove(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        _id: data.id,
      },
      copyId,
    );
    if (res.success) {
      if (res.data?.MatchedCount > 0 && this._loaded) {
        this._cache = this._cache.filter((i) => i.id != data.id);
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async removeMany(data: T[], copyId?: string): Promise<boolean> {
    const res = await kernel.collectionRemove(
      this._target.belongId,
      this._relations,
      this._collName,
      {
        _id: {
          _in_: data.map((i) => i.id),
        },
      },
      copyId,
    );
    if (res.success) {
      if (res.data?.MatchedCount > 0 && this._loaded) {
        this._cache = this._cache.filter((i) => data.every((a) => a.id != i.id));
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async notity(
    data: any,
    ignoreSelf?: boolean,
    targetId?: string,
    onlyTarget?: boolean,
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: data,
      flag: this.collName,
      onlineOnly: onlineOnly,
      belongId: this._target.belongId,
      relations: [this._target.id],
      onlyTarget: onlyTarget === true,
      ignoreSelf: ignoreSelf === true,
      targetId: targetId ?? this._target.id,
    });
    return res.success;
  }

  subscribe(callback: (data: any) => void, id?: string): void {
    kernel.on(
      `${this._target.belongId}-${id || this._target.id}-${this._collName}`,
      (data) => {
        callback.apply(this, [data]);
      },
    );
  }
}
