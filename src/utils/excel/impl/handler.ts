import * as t from '../type';

/**
 * 读取 Excel Sheet 配置默认实现
 */
export abstract class SheetHandler<S extends t.model.Sheet<any>>
  implements t.ISheetHandler<S>
{
  sheet: S;

  constructor(sheet: S) {
    this.sheet = sheet;
  }

  assert(index: number, asserts: { res: boolean; error: string }[]): t.Error[] {
    let errors: t.Error[] = [];
    asserts.forEach((item) => {
      if (item.res) {
        errors.push({
          name: this.sheet.name,
          row: index + 2,
          message: item.error,
        });
      }
    });
    return errors;
  }

  abstract checkData(excel: t.IExcel): t.Error[];
  abstract operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void>;
  completed?(excel: t.IExcel): void;
}
