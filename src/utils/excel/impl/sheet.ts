import * as t from '../type';

/**
 * Sheet 表抽象的默认实现
 */
export class Sheet<T> implements t.model.Sheet<T> {
  name: string;
  columns: t.model.Column[];
  data: T[];
  dir: t.IDirectory;

  constructor(sheetName: string, columns: t.model.Column[], dir: t.IDirectory) {
    this.name = sheetName;
    this.columns = columns;
    this.data = [];
    this.dir = dir;
  }
}
