import * as t from '../type';

/**
 * Sheet 表抽象的默认实现
 */
export class Sheet<T> implements t.model.Sheet<T> {
  id: string;
  name: string;
  columns: t.model.Column[];
  data: T[];
  dir: t.IDirectory;

  constructor(id: string, name: string, columns: t.model.Column[], dir: t.IDirectory) {
    this.id = id;
    this.name = name;
    this.columns = columns;
    this.data = [];
    this.dir = dir;
  }
}
