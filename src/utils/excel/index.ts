import * as XLSX from "xlsx";

/**
 * 读取 Excel 配置
 */
export interface ExcelConfig {
  onProgress: (progress: number) => void;
  onError: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 元字段
 */
export interface MetaColumn {
  name: string;
  type: string;
  options?: { key: string, value: string }[];
}

/**
 * Sheet 表
 */
export interface SheetConfig {
  sheetName: string;
  metaColumns: MetaColumn[];
  data?: [];
}

/**
 * 读取 Excel Sheet 配置
 */
export interface SheetReadConfig extends SheetConfig {
  operatingItem: <T>(row: T) => void;
}

/**
 * 生成一份 Excel 文件
 * @param sheetConfigs 表格信息
 * @param filename 文件信息
 */
export const generateXlsx = (sheetConfigs: SheetConfig[], filename: string) => {
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
export const readXlsx = (file: File, excelConfig: ExcelConfig, sheetReadConfigs: SheetReadConfig[]) => {
  let reader = new FileReader();
  reader.onprogress = (event: ProgressEvent<FileReader>) => {
    excelConfig.onProgress((event.loaded / event.total) * 30.0);
  }
  reader.onload = async (e) => {
    /**
     * 表处理回调
     * @param key 键值
     * @param index 索引 
     * @param sheets 表格
     */
    let operating = async (key: string, index: number, sheets: { [sheet: string]: XLSX.WorkSheet }) => {
      let sheetSize = Object.keys(sheets).length;
      for (let config of sheetReadConfigs) {
        if (config.sheetName == key) {
          let data = XLSX.utils.sheet_to_json(sheets[key]);
          for (let item = 0; item < data.length; item++) {
            await config.operatingItem(data[item]);
            excelConfig.onProgress(((index + 1) / sheetSize) * ((item + 1) / data.length) * 70.0);
          }
        }
      }
    }
    /** 读取文件 */
    try {
      let workbook = XLSX.read(e.target?.result, { type: 'binary' });
      let keys = Object.keys(workbook.Sheets);
      for (let index = 0; index < keys.length; index++)
        await operating(keys[index], index, workbook.Sheets);

      excelConfig.onProgress(100);
      excelConfig.onCompleted?.apply(excelConfig);
    } catch (error) {
      excelConfig.onError("文件读取异常")
      return;
    }
  }
  reader.readAsArrayBuffer(file);
}
