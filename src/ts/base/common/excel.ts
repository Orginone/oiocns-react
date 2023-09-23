import { model } from '..';
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
