import { model } from '@/ts/base';
import { DataHandler, ISheetHandler } from './types';
import * as XLSX from 'xlsx';

/**
 * 生成一份 Excel 文件
 * @param sheets 表格信息
 * @param filename 文件信息
 */
export const generateXlsx = (sheets: model.Sheet<any>[], filename: string) => {
  try {
    let workbook = XLSX.utils.book_new();
    for (let sheet of sheets) {
      let headers = sheet.columns.filter((item) => !item.hide).map((item) => item.title);

      let converted = [];
      for (let item of sheet.data) {
        let newItem: { [key: string]: any } = {};
        sheet.columns.forEach((column) => {
          newItem[column.title] = item[column.dataIndex];
        });
        converted.push(newItem);
      }

      let jsonSheet = XLSX.utils.json_to_sheet(converted, {
        header: headers,
        skipHeader: false,
      });
      XLSX.utils.book_append_sheet(workbook, jsonSheet, sheet.name);
    }
    XLSX.writeFileXLSX(workbook, filename + '.xlsx');
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 收集 Excel 数据
 */
export const readXlsx = (file: Blob, sheets: model.Sheet<any>[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      try {
        let workbook = XLSX.read(e.target?.result, { type: 'binary' });
        let keys = Object.keys(workbook.Sheets);

        for (let index = 0; index < keys.length; index++) {
          collecting(keys[index], workbook.Sheets, sheets);
        }

        resolve(undefined);
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
  reads: { [sheet: string]: XLSX.WorkSheet },
  sheets: model.Sheet<any>[],
): void => {
  for (let sheet of sheets) {
    if (sheet.name == key) {
      let ansData: any[] = [];
      let data = XLSX.utils.sheet_to_json(reads[key]);
      data.forEach((item: any) => {
        let ansItem: any = {};
        sheet.columns.forEach((column) => {
          let value = item[column.title];
          if (value || value === 0) {
            ansItem[column.dataIndex] = String(value);
          }
        });
        ansData.push(ansItem);
      });
      sheet.data = ansData;
    }
  }
};

/**
 * 处理一份 Excel
 * @param file 文件
 * @param dataHandler 数据处理句柄
 * @param readConfigs 读取配置
 */
const dataHandling = async <T>(
  context: T,
  dataHandler: DataHandler,
  readConfigs: ISheetHandler<any, any, model.Sheet<any>>[],
) => {
  try {
    // 总行数
    let totalRows = readConfigs
      .map((item) => item.sheet)
      .map((item) => item.data.length)
      .reduce((f, s) => f + s);

    // 初始化
    dataHandler.initialize?.apply(dataHandler, [totalRows]);

    // 处理数据
    for (let index = 0; index < readConfigs.length; index++) {
      let sheetConfig = readConfigs[index].sheet;
      await operating(sheetConfig.name, context, dataHandler, readConfigs);
      if (readConfigs[index].errors.length > 0) {
        dataHandler.onReadError?.apply(dataHandler, [readConfigs[index].errors]);
        throw new Error();
      }
    }

    // 完成回调
    dataHandler.onCompleted?.apply(dataHandler);
  } catch (error: any) {
    // 错误处理
    console.log(error);
    dataHandler.onError?.('数据处理异常');
  }
};

/**
 * 表处理回调
 * @param key 键值
 */
let operating = async (
  key: string,
  context: any,
  dataHandler: DataHandler,
  readConfigs: ISheetHandler<any, any, model.Sheet<any>>[],
) => {
  for (let readConfig of readConfigs) {
    if (readConfig.sheet.name == key) {
      await readConfig.operating(context, () => {
        dataHandler.onItemCompleted?.apply(dataHandler);
      });
      await readConfig.completed?.apply(readConfig, [readConfigs, context]);
    }
  }
};

/**
 * 赋给新对象中没有的老对象的值
 * @param old
 */
function assignment(oldObj: { [key: string]: any }, newObj: { [key: string]: any }) {
  Object.keys(oldObj).forEach((key) => {
    if (!(key in newObj)) {
      newObj[key] = oldObj[key];
    }
  });
}

export { assignment, dataHandling };
