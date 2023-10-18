import * as i from '../impl';
import * as t from '../type';

export class AnySheet extends i.Sheet<t.schema.XThing> {
  constructor(id: string, name: string, columns: t.model.Column[], dir: t.IDirectory) {
    super(id, name, columns, dir);
  }
}

export class AnyHandler extends i.SheetHandler<AnySheet> {
  checkData(_: t.IExcel): t.Error[] {
    return [];
  }
  async operating(_: t.IExcel, __: () => void): Promise<void> {
    return;
  }
}
