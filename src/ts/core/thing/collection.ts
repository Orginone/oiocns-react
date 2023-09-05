import { kernel, schema } from '../../base';

export class Collection<T extends schema.Xbase> {
  private loaded: boolean;
  cache: T[];
  collName: string;
  belongId: string;
  constructor(id: string, name: string) {
    this.cache = [];
    this.loaded = false;
    this.belongId = id;
    this.collName = name;
  }

  async all(): Promise<T[]> {
    if (!this.loaded) {
      this.cache = await this.load({});
      this.loaded = true;
    }
    return this.cache;
  }

  async load(options: any): Promise<T[]> {
    options.options = options.options || {};
    options.options.match = options.options.match || {};
    options.options.match.isDeleted = false;
    options = {
      ...options,
      userData: [],
      collName: this.collName,
    };
    const res = await kernel.collectionLoad<T[]>(this.belongId, options);
    if (res.success && res.data) {
      return res.data || [];
    }
    return [];
  }

  async insert(data: T): Promise<T | undefined> {
    data.id = data.id || 'snowId()';
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
      return { ...a, id: a.id || 'snowId()' };
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
      match: { id: data.id },
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
        id: {
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
}
