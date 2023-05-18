import { schema, model, parseAvatar } from '../../base';
import { generateUuid } from '../../base/common/uuid';

/** 共享信息数据集 */
export const ShareIdSet = new Map<string, any>();

/** 实体类接口 */
export interface IEntity<T> {
  /** 实体唯一键 */
  key: string;
  /** 唯一标识 */
  id: string;
  /** 实体名称 */
  name: string;
  /** 实体编号 */
  code: string;
  /** 实体类型 */
  typeName: string;
  /** 实体描述 */
  remark: string;
  /** 数据实体 */
  metadata: T;
  /** 共享信息 */
  share: model.ShareIcon;
  /** 查找元数据 */
  findMetadata<U>(id: string): U | undefined;
  /** 更新元数据 */
  updateMetadata<U extends schema.XEntity>(data: U): void;
}

/** 实体类实现 */
export abstract class Entity<T extends schema.XEntity> implements IEntity<T> {
  constructor(_metadata: T) {
    this.key = generateUuid();
    this._metadata = _metadata;
    ShareIdSet.set(this.id, _metadata);
  }
  _metadata: T;
  key: string;
  get id(): string {
    return this._metadata.id;
  }
  get name(): string {
    return this.metadata.name;
  }
  get code(): string {
    return this.metadata.code;
  }
  get typeName(): string {
    return this.metadata.typeName;
  }
  get remark(): string {
    return this.metadata.remark;
  }
  get metadata(): T {
    if (ShareIdSet.has(this.id)) {
      return ShareIdSet.get(this.id);
    }
    return this._metadata;
  }
  get share(): model.ShareIcon {
    return {
      name: this.name,
      typeName: this.typeName,
      avatar: parseAvatar(this.metadata.icon),
    };
  }
  setMetadata(_metadata: T): void {
    if (_metadata.id === this.id) {
      this._metadata = _metadata;
      ShareIdSet.set(this.id, _metadata);
    }
  }
  findMetadata<U>(id: string): U | undefined {
    if (ShareIdSet.has(id)) {
      return ShareIdSet.get(id) as U;
    }
    return undefined;
  }
  updateMetadata<U extends schema.XEntity>(data: U): void {
    ShareIdSet.set(data.id, data);
  }
}
