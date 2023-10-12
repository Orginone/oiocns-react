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

  assert(
    index: number | number[],
    asserts: { res: boolean; error: string }[],
  ): t.Error[] {
    let errors: t.Error[] = [];
    asserts.forEach((item) => {
      if (item.res) {
        if (typeof index == 'number') {
          index += 2;
        } else {
          for (let i = 0; i < index.length; i++) {
            index[i] += 2;
          }
        }
        errors.push({
          name: this.sheet.name,
          row: index,
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
