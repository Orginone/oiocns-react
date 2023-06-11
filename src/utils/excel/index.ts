import * as XLSX from 'xlsx';
import { ExcelConfig, SheetConfig, ReadConfig } from './types';

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
  file: File,
  excelConfig: ExcelConfig<T>,
  readConfigs: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<any>>[],
) => {
  // 进度分块
  let loadPro = 30.0;
  let operatePro = 70.0;

  let reader = new FileReader();
  reader.onprogress = (event: ProgressEvent<FileReader>) => {
    excelConfig.onProgress((event.loaded / event.total) * loadPro);
  };
  reader.onload = async (e) => {
    /**
     * 数据收集，将中文名称转换为英文名称
     */
    let collecting = async (key: string, sheets: { [sheet: string]: XLSX.WorkSheet }) => {
      for (let readConfig of readConfigs) {
        let sheetConfig = readConfig.sheetConfig;
        if (sheetConfig.sheetName == key) {
          let ansData: any[] = [];
          let data = XLSX.utils.sheet_to_json(sheets[key]);
          data.forEach((item: any) => {
            let ansItem: any = {};
            sheetConfig.metaColumns.forEach((column) => {
              ansItem[column.code] = item[column.name];
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
    let operating = async (key: string, number: number) => {
      let sheetSize = readConfigs.length;
      for (let readConfig of readConfigs) {
        if (readConfig.sheetConfig.sheetName == key) {
          // 初始化
          let data = readConfig.sheetConfig.data;
          await readConfig.initContext?.apply(readConfig);

          // 校验数据
          readConfig.errors = [];
          await readConfig.checkData?.apply(readConfig, [data]);
          if (readConfig.errors.length > 0) {
            excelConfig.onReadError(readConfig.errors);
            throw new Error();
          }

          // 处理数据并显示进度
          let len = data.length;
          let percent = (number / sheetSize) * operatePro;
          let itemPro = percent / len;
          for (let index = 0; index < len; index++) {
            await readConfig.operatingItem(index, data[index]);
            excelConfig.addProgress(itemPro);
          }
          if (readConfig.errors.length > 0) {
            excelConfig.onReadError(readConfig.errors);
            throw new Error();
          }

          // 完成后回调
          await readConfig.completed?.apply(readConfig, [readConfigs]);
        }
      }
    };
    /** 读取文件 */
    try {
      let workbook = XLSX.read(e.target?.result, { type: 'binary' });
      let keys = Object.keys(workbook.Sheets);

      // 初始化
      excelConfig.initialize();

      // 收集数据并处理
      for (let index = 0; index < keys.length; index++)
        await collecting(keys[index], workbook.Sheets);
      for (let index = 0; index < keys.length; index++)
        await operating(keys[index], index);

      // 完成回调
      excelConfig.onProgress(100);
      excelConfig.onCompleted?.apply(excelConfig);
    } catch (error: any) {
      console.error(error)
      excelConfig.onError('文件读取异常');
    }
  };
  reader.readAsArrayBuffer(file);
};

export { generateXlsx, readXlsx };
