import { kernel, schema } from '../../base';

export class Collection<T extends schema.Xbase> {
  private loaded: boolean;
  cache: T[];
  collName: string;
  belongId: string;
  shareId: string;
  constructor(belongId: string, shareId: string, name: string) {
    this.cache = [];
    this.loaded = false;
    this.collName = name;
    this.shareId = shareId;
    this.belongId = belongId;
  }

  async all(): Promise<T[]> {
    if (!this.loaded) {
      this.cache = await this.load({});
      this.loaded = true;
    }
    return this.cache;
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
    options.collName = this.collName;
    options.options = options.options || {};
    options.options.match = options.options.match || {};
    options.options.match.isDeleted = false;
    const res = await kernel.collectionLoad<T[]>(this.belongId, options);
    if (res.success && res.data) {
      return res.data || [];
    }
    return [];
  }

  async load(options: any): Promise<T[]> {
    options = options || {};
    options.options = options.options || {};
    options.options.match = options.options.match || {};
    options.options.match.shareId = this.shareId;
    return await this.loadSpace(options);
  }

  async insert(data: T): Promise<T | undefined> {
    data.id = data.id || 'snowId()';
    data.shareId = this.shareId;
    data.belongId = data.belongId || this.belongId;
    const res = await kernel.collectionInsert<T>(this.belongId, this.collName, data);
    if (res.success) {
      if (res.data) {
        this.cache.push(res.data);
      }
      return res.data;
    }
  }

  async insertMany(data: T[]): Promise<T[]> {
    data = data.map((a) => {
      a.id = a.id || 'snowId()';
      a.shareId = this.shareId;
      a.belongId = a.belongId || this.belongId;
      return a;
    });
    const res = await kernel.collectionInsert<T[]>(this.belongId, this.collName, data);
    if (res.success) {
      if (res.data && res.data.length > 0) {
        this.cache.push(...res.data);
      }
      return res.data || [];
    }
    return [];
  }

  async replace(data: T): Promise<T | undefined> {
    data.shareId = this.shareId;
    data.belongId = data.belongId || this.belongId;
    const res = await kernel.collectionReplace<T>(this.belongId, this.collName, data);
    if (res.success) {
      if (res.data) {
        this.cache = this.cache.map((i) => {
          if (i.id == res.data.id) {
            return res.data;
          }
          return i;
        });
      }
      return res.data;
    }
  }

  async replaceMany(data: T[]): Promise<T[]> {
    data = data.map((a) => {
      a.shareId = this.shareId;
      a.belongId = a.belongId || this.belongId;
      return a;
    });
    const res = await kernel.collectionReplace<T[]>(this.belongId, this.collName, data);
    if (res.success) {
      if (res.data && res.data.length > 0) {
        this.cache = this.cache.map((i) => {
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

  async delete(data: T): Promise<boolean> {
    const res = await kernel.collectionUpdate(this.belongId, this.collName, {
      match: { _id: data.id },
      update: {
        _set_: {
          isDeleted: true,
        },
      },
    });
    if (res.success) {
      if (res.data?.MatchedCount > 0) {
        this.cache = this.cache.filter((i) => i.id != data.id);
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async deleteMany(data: T[]): Promise<boolean> {
    const res = await kernel.collectionUpdate(this.belongId, this.collName, {
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
    });
    if (res.success) {
      if (res.data?.MatchedCount > 0) {
        this.cache = this.cache.filter((i) => data.every((a) => a.id != i.id));
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async remove(data: T): Promise<boolean> {
    const res = await kernel.collectionRemove(this.belongId, this.collName, {
      _id: data.id,
    });
    if (res.success) {
      if (res.data?.MatchedCount > 0) {
        this.cache = this.cache.filter((i) => i.id != data.id);
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }

  async removeMany(data: T[]): Promise<boolean> {
    const res = await kernel.collectionRemove(this.belongId, this.collName, {
      _id: {
        _in_: data.map((i) => i.id),
      },
    });
    if (res.success) {
      if (res.data?.MatchedCount > 0) {
        this.cache = this.cache.filter((i) => data.every((a) => a.id != i.id));
      }
      return res.data?.MatchedCount > 0;
    }
    return false;
  }
}
