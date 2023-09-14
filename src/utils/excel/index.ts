import * as XLSX from 'xlsx';
import { DataHandler, ISheetRead, ISheet } from './types';

/**
 * 生成一份 Excel 文件
 * @param sheetConfigs 表格信息
 * @param filename 文件信息
 */
const generateXlsx = (sheetConfigs: ISheet<any>[], filename: string) => {
  try {
    let workbook = XLSX.utils.book_new();
    for (let sheetConfig of sheetConfigs) {
      let headers = sheetConfig.metaColumns
        .filter((item) => !item.hide)
        .map((item) => item.title);

      let converted = [];
      for (let item of sheetConfig.data) {
        let newItem: { [key: string]: any } = {};
        sheetConfig.metaColumns.forEach((column) => {
          newItem[column.title] = item[column.dataIndex];
        });
        converted.push(newItem);
      }

      let sheet = XLSX.utils.json_to_sheet(converted, {
        header: headers,
        skipHeader: false,
      });
      XLSX.utils.book_append_sheet(workbook, sheet, sheetConfig.sheetName);
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
const readXlsx = (
  file: Blob,
  readConfigs: ISheetRead<any, any, ISheet<any>>[],
  completed: () => void,
) => {
  let reader = new FileReader();
  reader.onload = async (e) => {
    let workbook = XLSX.read(e.target?.result, { type: 'binary' });
    let keys = Object.keys(workbook.Sheets);

    for (let index = 0; index < keys.length; index++)
      collecting(keys[index], workbook.Sheets, readConfigs);

    completed();
  };
  reader.readAsArrayBuffer(file);
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
  readConfigs: ISheetRead<any, any, ISheet<any>>[],
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
      await operating(sheetConfig.sheetName, context, dataHandler, readConfigs);
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
    dataHandler.onError?.apply(dataHandler, ['数据处理异常']);
  }
};

/**
 * 数据收集，将中文名称转换为英文名称
 */
const collecting = (
  key: string,
  sheets: { [sheet: string]: XLSX.WorkSheet },
  readConfigs: ISheetRead<any, any, ISheet<any>>[],
): void => {
  for (let readConfig of readConfigs) {
    let sheetConfig = readConfig.sheet;
    if (sheetConfig.sheetName == key) {
      let ansData: any[] = [];
      let data = XLSX.utils.sheet_to_json(sheets[key]);
      data.forEach((item: any) => {
        let ansItem: any = {};
        sheetConfig.metaColumns.forEach((column) => {
          let value = item[column.title];
          if (value || value === 0) {
            ansItem[column.dataIndex] = String(value);
          }
        });
        ansData.push(ansItem);
      });
      sheetConfig.data = ansData;
    }
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
  readConfigs: ISheetRead<any, any, ISheet<any>>[],
) => {
  for (let readConfig of readConfigs) {
    if (readConfig.sheet.sheetName == key) {
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

export { assignment, dataHandling, generateXlsx, readXlsx };
