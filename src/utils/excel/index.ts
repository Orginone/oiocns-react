import * as XLSX from "xlsx";
import { getConfigs, ReadError, } from "@/utils/excel/config";

/**
 * 读取 Excel 配置
 */
interface ExcelConfig<T> {
  context: T;
  onProgress: (progress: number) => void;
  onError: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 元字段
 */
interface MetaColumn {
  name: string;
  type: string;
  options?: string[];
}

/**
 * Sheet 表
 */
interface SheetConfig {
  sheetName: string;
  metaColumns: MetaColumn[];
  data?: any[];
}

/**
 * 读取 Excel Sheet 配置
 */
interface SheetReadConfig extends SheetConfig {
  initContext?: (context: any) => void;
  checkData?: (data: any[]) => Promise<void>;
  operatingItem: (row: { [key: string]: string }, context: any) => Promise<void>;
  completed?: (current: SheetReadConfig, sheets: SheetReadConfig[]) => void;
}

/**
 * 生成一份 Excel 文件
 * @param sheetConfigs 表格信息
 * @param filename 文件信息
 */
const generateXlsx = (sheetConfigs: SheetConfig[], filename: string) => {
  try {
    let workbook = XLSX.utils.book_new();
    for (let sheetConfig of sheetConfigs) {
      let headers = sheetConfig.metaColumns.map(item => item.name);
      let sheet = XLSX.utils.json_to_sheet(sheetConfig.data ?? [], { header: headers, skipHeader: false });
      XLSX.utils.book_append_sheet(workbook, sheet, sheetConfig.sheetName);
    }
    XLSX.writeFileXLSX(workbook, filename + ".xlsx");
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 读取一份 Excel
 * @param file 文件
 * @param excelConfig 进度配置
 * @param sheetReadConfigs 读取配置
 */
const readXlsx = <T>(file: File, excelConfig: ExcelConfig<T>, sheetReadConfigs: SheetReadConfig[]) => {
  let reader = new FileReader();
  reader.onprogress = (event: ProgressEvent<FileReader>) => {
    excelConfig.onProgress((event.loaded / event.total) * 30.0);
  }
  reader.onload = async (e) => {
    /**
     * 数据收集
     */
    let collecting = async (key: string, sheets: { [sheet: string]: XLSX.WorkSheet }) => {
      for (let config of sheetReadConfigs) {
        if (config.sheetName == key) {
          config.data = XLSX.utils.sheet_to_json(sheets[key]);
        }
      }
    }
    /**
     * 表处理回调
     * @param key 键值
     * @param index 索引 
     * @param sheets 表格
     */
    let operating = async (key: string, index: number) => {
      let sheetSize = sheetReadConfigs.length;
      for (let config of sheetReadConfigs) {
        if (config.sheetName == key) {
          let data = config.data ?? [];
          config.initContext?.apply(config, [excelConfig.context]);
          await config.checkData?.apply(config, [data]);
          for (let item = 0; item < data.length; item++) {
            await config.operatingItem(data[item], excelConfig.context);
            let progress = (30.0 + ((index + 1) / sheetSize) * ((item + 1) / data.length) * 70.0).toFixed(2);
            excelConfig.onProgress(Number(progress));
          }
          await config.completed?.apply(config, [config, sheetReadConfigs]);
        }
      }
    }
    /** 读取文件 */
    try {
      let workbook = XLSX.read(e.target?.result, { type: 'binary' });
      let keys = Object.keys(workbook.Sheets);
      for (let index = 0; index < keys.length; index++)
        await collecting(keys[index], workbook.Sheets);
      for (let index = 0; index < keys.length; index++)
        await operating(keys[index], index);

      excelConfig.onProgress(100);
      excelConfig.onCompleted?.apply(excelConfig);
    } catch (error: any) {
      console.log(error);
      if (error instanceof ReadError) {
        excelConfig.onError(error.message);
        return;
      }
      excelConfig.onError("文件读取异常")
    }
  }
  reader.readAsArrayBuffer(file);
}

export {
  generateXlsx,
  readXlsx,
  getConfigs
}

export type {
  ExcelConfig,
  MetaColumn,
  SheetConfig,
  SheetReadConfig
}