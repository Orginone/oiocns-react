import { model } from '@/ts/base';
import { DataHandler, ISheetHandler } from './types';

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
