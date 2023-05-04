import { generateUuid } from './uuid';

export interface IEntity {
  /** 实体唯一键 */
  key: string;
}

export class Entity implements IEntity {
  constructor() {
    this.key = generateUuid();
  }
  key: string;
}
