import { kernel, schema } from '../../base';

/** 对象工具类 */
export class XObject<T extends schema.Xbase> {
  private _loaded: boolean;
  private _cache: T | undefined;
  private _objName: string;
  private _target: schema.XTarget;
  private _relations: string[];
  constructor(target: schema.XTarget, name: string, relations: string[]) {
    this._loaded = false;
    this._target = target;
    this._relations = relations;
    this._objName = name;
  }

  get cache(): any {
    return this._cache;
  }

  get objName(): string {
    return this._objName;
  }

  fullPath(path: string): string {
    return this.objName + (path ? '.' + path : '');
  }

  async all(): Promise<any> {
    if (!this._loaded) {
      const res = await kernel.objectGet<T>(
        this._target.belongId,
        this._relations,
        this.objName,
      );
      if (res.success) {
        this._cache = res.data;
        this._loaded = true;
      }
    }
    return this._cache;
  }

  async get<R>(path: string): Promise<R | undefined> {
    if (!this._loaded) {
      await this.all();
    }
    return this.getValue<R>(path);
  }

  async set(path: string, data: any): Promise<boolean> {
    const res = await kernel.objectSet(
      this._target.belongId,
      this._relations,
      this.fullPath(path),
      data,
    );
    if (res.success) {
      if (this._cache === undefined) {
        this._cache = await this.get<T>('');
      }
      this.setValue(path, data);
    }
    return res.success;
  }

  async delete(path: string): Promise<boolean> {
    const res = await kernel.objectDelete(
      this._target.belongId,
      this._relations,
      this.fullPath(path),
    );
    return res.success;
  }

  async notity(
    flag: string,
    data: any,
    onlyTarget?: boolean,
    ignoreSelf?: boolean,
    targetId?: string,
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: {
        flag,
        data,
      },
      flag: this.objName,
      onlineOnly: onlineOnly,
      belongId: this._target.belongId,
      relations: this._relations,
      onlyTarget: onlyTarget === true,
      ignoreSelf: ignoreSelf === true,
      targetId: targetId ?? this._target.id,
    });
    return res.success;
  }

  subscribe(flag: string, callback: (data: any) => void, id?: string): void {
    kernel.on(
      `${this._target.belongId}-${id || this._target.id}-${this._objName}`,
      (res: { flag: string; data: any }) => {
        if (res.flag === flag) {
          callback.apply(this, [res.data]);
        }
      },
    );
  }

  private getValue<R>(path: string): R | undefined {
    if (path === '') return this.cache;
    var paths = path.split('.');
    var prop = paths.shift(),
      value = this.cache;
    while (prop && value) {
      value = value[prop];
      prop = paths.shift();
    }
    return value;
  }

  private setValue(path: string, data: any) {
    if (this.cache) {
      if (path === '') return this.cache;
      var paths = path.split('.');
      var prop: string | undefined,
        value = this.cache;
      while (value && (prop = paths.shift() && prop)) {
        value = value[path] || {};
        if (paths.length === 0) {
          value[path] = data;
        }
      }
    }
  }
}
