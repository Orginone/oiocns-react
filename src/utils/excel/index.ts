import * as XLSX from 'xlsx';
import { ExcelConfig, ReadConfig, SheetConfig } from './types';

/**
 * 生成一份 Excel 文件
 * @param sheetConfigs 表格信息
 * @param filename 文件信息
 */
const generateXlsx = (sheetConfigs: SheetConfig<any>[], filename: string) => {
  try {
    let workbook = XLSX.utils.book_new();
    for (let sheetConfig of sheetConfigs) {
      let headers = sheetConfig.metaColumns.map((item) => item.name);
      let sheet = XLSX.utils.json_to_sheet(sheetConfig.data, {
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
 * 读取一份 Excel
 * @param file 文件
 * @param excelConfig 进度配置
 * @param readConfigs 读取配置
 */
const readXlsx = <T>(
  file: Blob,
  excelConfig: ExcelConfig<T>,
  readConfigs: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<any>>[],
) => {
  let reader = new FileReader();
  reader.onload = async (e) => {
    try {
      let workbook = XLSX.read(e.target?.result, { type: 'binary' });
      let keys = Object.keys(workbook.Sheets);

      // 收集数据
      let totalRows = 0;
      for (let index = 0; index < keys.length; index++)
        totalRows += collecting(keys[index], workbook.Sheets, readConfigs);

      // 初始化
      excelConfig.initialize?.apply(excelConfig, [totalRows, workbook]);

      // 处理数据
      for (let index = 0; index < keys.length; index++)
        await operating(keys[index], excelConfig, readConfigs);

      // 完成回调
      excelConfig.onCompleted?.apply(excelConfig);
    } catch (error: any) {
      // 错误处理
      console.log(error);
      excelConfig.onError?.apply(excelConfig, ['文件读取异常']);
    }
  };
  reader.readAsArrayBuffer(file);
};

/**
 * 数据收集，将中文名称转换为英文名称
 */
const collecting = (
  key: string,
  sheets: { [sheet: string]: XLSX.WorkSheet },
  readConfigs: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<any>>[],
): number => {
  for (let readConfig of readConfigs) {
    let sheetConfig = readConfig.sheetConfig;
    if (sheetConfig.sheetName == key) {
      let ansData: any[] = [];
      let data = XLSX.utils.sheet_to_json(sheets[key]);
      data.forEach((item: any) => {
        let ansItem: any = {};
        sheetConfig.metaColumns.forEach((column) => {
          if (item[column.name] === 0) {
            ansItem[column.code] = '0';
          } else {
            ansItem[column.code] = String(item[column.name] ?? '');
          }
        });
        ansData.push(ansItem);
      });
      sheetConfig.data = ansData;
      return ansData.length;
    }
  }
  return 0;
};

/**
 * 表处理回调
 * @param key 键值
 */
let operating = async (
  key: string,
  excelConfig: ExcelConfig<any>,
  readConfigs: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<any>>[],
) => {
  for (let readConfig of readConfigs) {
    if (readConfig.sheetConfig.sheetName == key) {
      // 数据
      let data = readConfig.sheetConfig.data;

      // 校验数据
      readConfig.errors = [];
      await readConfig.checkData?.apply(readConfig, [data]);
      if (readConfig.errors.length > 0) {
        excelConfig.onReadError?.apply(excelConfig, [readConfig.errors]);
        throw new Error();
      }

      // 处理数据并显示进度
      for (let index = 0; index < data.length; index++) {
        await readConfig.operatingItem(data[index], index);
        excelConfig.onItemCompleted?.apply(excelConfig);
      }
      if (readConfig.errors.length > 0) {
        excelConfig.onReadError?.apply(excelConfig, [readConfig.errors]);
        throw new Error();
      }

      // 完成后回调
      await readConfig.completed?.apply(readConfig, [readConfigs]);
    }
  }
};

export { generateXlsx, readXlsx };
