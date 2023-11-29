import * as t from '../type';
import { DirContext } from './context';

/**
 * 生成一份 Excel 文件
 * @param excel 表格信息
 * @param filename 文件信息
 */
export const generateXlsx = (excel: t.IExcel, filename: string) => {
  try {
    let workbook = t.XLSX.utils.book_new();
    let sheets = excel.handlers.map((item) => item.sheet);
    for (let sheet of sheets) {
      let headers = sheet.columns.map((item) => item.title);

      let converted = [];
      for (let item of sheet.data) {
        let newItem: { [key: string]: any } = {};
        sheet.columns.forEach((column) => {
          newItem[column.title] = item[column.dataIndex];
        });
        converted.push(newItem);
      }

      let jsonSheet = t.XLSX.utils.json_to_sheet(converted, {
        header: headers,
        skipHeader: false,
      });
      t.XLSX.utils.book_append_sheet(workbook, jsonSheet, sheet.name);
    }
    t.XLSX.writeFileXLSX(workbook, filename + '.xlsx');
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 收集 Excel 数据
 */
export const readXlsx = (file: Blob, excel: t.IExcel): Promise<t.IExcel> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      try {
        let workbook = t.XLSX.read(e.target?.result, { type: 'binary' });
        let keys = Object.keys(workbook.Sheets);

        for (let index = 0; index < keys.length; index++) {
          collecting(keys[index], workbook.Sheets, excel);
        }

        resolve(excel);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 数据收集，将中文名称转换为英文名称
 */
export const collecting = (
  key: string,
  reads: { [sheet: string]: t.XLSX.WorkSheet },
  excel: t.IExcel,
): void => {
  for (let sheet of excel.handlers.map((item) => item.sheet)) {
    if (sheet.name == key) {
      let ansData: any[] = [];
      let data = t.XLSX.utils.sheet_to_json(reads[key]);
      data.forEach((item: any) => {
        let ansItem: any = {};
        sheet.columns.forEach((column) => {
          let value = item[column.title];
          if (value || value === 0) {
            switch (column.valueType) {
              case '选择型':
              case '分类型':
                if (column.lookups) {
                  for (const item of column.lookups) {
                    if (item.text == value) {
                      ansItem[column.dataIndex] = item.value;
                      ansItem[item.value] = item.text;
                      break;
                    }
                  }
                }
                break;
              case '数值型':
                ansItem[column.dataIndex] = Number(value);
                break;
              default:
                ansItem[column.dataIndex] = String(value);
            }
          }
        });
        ansData.push(ansItem);
      });
      sheet.data = ansData;
    }
  }
};

export class Excel implements t.IExcel {
  handlers: t.ISheetHandler<t.model.Sheet<any>>[];
  dataHandler?: t.DataHandler;
  context: t.Context;

  constructor(sheets?: t.ISheetHandler<t.model.Sheet<any>>[], handler?: t.DataHandler) {
    this.handlers = [];
    this.dataHandler = handler;
    this.context = new DirContext();
    sheets?.forEach((item) => this.appendHandler(item));
  }

  getHandler(name: string) {
    return this.handlers.filter((item) => item.sheet.name == name)[0];
  }

  appendHandler(handler: t.ISheetHandler<any>): void {
    const judge = (item: any) => item.sheet.name == handler.sheet.name;
    const index = this.handlers.findIndex(judge);
    if (index == -1) {
      this.handlers.push(handler);
    } else {
      this.handlers[index] = handler;
    }
  }

  async handling(): Promise<void> {
    try {
      let totalRows = this.handlers
        .map((item) => item.sheet)
        .map((item) => item.data.length)
        .reduce((f, s) => f + s);
      this.dataHandler?.initialize?.(totalRows);

      for (const handler of this.handlers) {
        await handler.operating(this, () => this.dataHandler?.onItemCompleted?.());
        handler.completed?.(this);
      }
      this.dataHandler?.onCompleted?.();
    } catch (error: any) {
      this.dataHandler?.onError?.('数据处理异常');
    }
  }
}
