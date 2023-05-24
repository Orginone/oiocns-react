import * as XLSX from "xlsx";

/**
 * 生成一份 Excel 文件
 * @param data 表格数据
 * @param header 表头
 * @param sheetName 表格名称
 * @param filename 文件名称
 */
export const generateXlsx = <T>(header: string[], filename: string, sheetName: string, data?: T[]) => {
  try {
    let workbook = XLSX.utils.book_new();
    let sheet = XLSX.utils.json_to_sheet(data ?? [], { header: header, skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFileXLSX(workbook, filename + ".xlsx");
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 读取一份 Excel 的某一个 sheet
 * @param file
 * @param sheetNumber
 * @param operatingItem
 * @param onProgress
 * @param onCompleted
 */
export const readXlsx = (file: File, sheetNumber: number, operatingItem: (row: any) => void, onProgress: (progress: number | string) => void) => {
  let reader = new FileReader();
  let loadingProgress = 30.0;
  let operatingProgress = 70.0;
  reader.onprogress = (event: ProgressEvent<FileReader>) => {
    onProgress((event.loaded / event.total) * loadingProgress);
  }
  reader.onload = async (e) => {
    let data = e.target?.result;
    if (!data) {
      onProgress("文件读取异常！");
      return
    }
    try {
      let workbook = XLSX.read(data, { type: 'binary' });
      let sheets = workbook.Sheets;
      let keys = Object.keys(sheets);
      for (let index = 0; index < keys.length; index++) {
        let sheet = sheets[keys[index]];
        let data = XLSX.utils.sheet_to_json(sheet);
        if (sheetNumber == index) {
          let length = data.length;
          for (let index = 0; index < length; index++) {
            await operatingItem(data[index]);
            onProgress(loadingProgress + ((index + 1) / length) * operatingProgress);
          }
        }
      }
      onProgress(100);
    } catch (error) {
      onProgress("文件读取异常")
      return;
    }
  }
  reader.readAsArrayBuffer(file);
}
