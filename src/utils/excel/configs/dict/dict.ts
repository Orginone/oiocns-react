import { DictModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  ReadConfig,
  SheetConfig,
  SheetName,
  ExcelConfig,
} from '../../types';
import { IDict, IDictClass, ISpeciesItem } from '@/ts/core';

export class DictSheetConfig extends SheetConfigImpl<DictModel> {
  species: ISpeciesItem;

  constructor(spceies: ISpeciesItem) {
    super(SheetName.Dict, 1, [
      { name: '类型', code: 'speciesId', type: '描述型' },
      { name: '字典名称', code: 'name', type: '描述型' },
      { name: '字典代码', code: 'code', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.species = spceies;
  }
}

export class DictReadConfig extends ReadConfigImpl<
  DictModel,
  Context,
  DictSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: DictSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(sheetConfig, excelConfig);
  }

  /**
   * 初始化已存在字典
   * @param context 导入上下文
   */
  async initContext(): Promise<void> {
    let context = this.excelConfig.context;
    context.dictIndex = {};
    let dicts = await (this.sheetConfig.species as IDictClass).loadAllDicts();
    for (let dict of dicts) {
      context.dictIndex[dict.name] = dict;
      context.dictIndex[dict.id] = dict;
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: DictModel[]): Promise<void> {
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.speciesId || !item.name || !item.code) {
        this.pushError(index, '存在未填写的类型、字典名称、字典代码！');
      }
    }
  }

  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(index: number, row: DictModel): Promise<void> {
    let context = this.excelConfig.context;
    let child = context.speciesIndex[row.speciesId];
    let dict: IDict | undefined = context.dictIndex[row.name];
    let success: boolean = false;
    if (dict) {
      success = await dict.update({
        ...dict.metadata,
        name: row.name,
        code: row.code,
        speciesId: row.speciesId,
        remark: row.remark,
      });
    } else {
      dict = await (child as IDictClass).createDict(row);
      if (dict) {
        context.dictIndex[dict.id] = dict;
      }
      success = !!dict;
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }

  /**
   * 完成后回写字典项字典 ID
   * @param readConfigs
   */
  async completed(
    readConfigs: ReadConfig<any, Context, SheetConfig<any>, ExcelConfig<Context>>[],
  ): Promise<void> {
    let context = this.excelConfig.context;
    for (let readConfig of readConfigs) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasDict = sheetConfig.metaColumns.findIndex(
          (item) => item.name == '字典名称',
        );
        if (hasDict != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.dictId && context.dictIndex[item.dictId]) {
              item.dictId = context.dictIndex[item.dictId].id;
            } else {
              readConfig.pushError(index, '未找到字典：' + item.dictId);
            }
          }
          if (readConfig.errors.length > 0) {
            this.excelConfig.onReadError(readConfig.errors);
            throw new Error();
          }
        }
      }
    }
  }
}
