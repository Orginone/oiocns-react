import { DictItemModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
} from '../types';
import { ISpeciesItem } from '@/ts/core';

export class DictItemSheetConfig extends SheetConfigImpl<DictItemModel> {
  species: ISpeciesItem;

  constructor(spceies: ISpeciesItem) {
    super(SheetName.DictItem, 1, [
      { name: '字典名称', code: 'dictId', type: '描述型' },
      { name: '名称', code: 'name', type: '描述型' },
      { name: '值', code: 'value', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.species = spceies;
  }
}

export class DictItemReadConfig extends ReadConfigImpl<
  DictItemModel,
  Context,
  DictItemSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: DictItemSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(sheetConfig, excelConfig);
  }
  /**
   * 初始化原有字典项
   * @param context 导入上下文
   */
  async initContext(): Promise<void> {
    let context = this.excelConfig.context;
    context.dictItemIndex = {};
    for (let key of Object.keys(context.dictIndex)) {
      if (context.dictIndex[key]) {
        let dict = context.dictIndex[key];
        let items = await dict.loadItems();
        context.dictItemIndex[key] = {};
        for (let item of items) {
          context.dictItemIndex[key][item.name] = item;
        }
      }
    }
  }

  /**
   * 数据校验
   * @param data 数据
   */
  async checkData(data: DictItemModel[]): Promise<void> {
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      item.value = item.value?.toString();
      if (!item.dictId || !item.name || item.value == '') {
        this.pushError(index, '存在未填写的字典名称、名称、值！');
      }
    }
  }

  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(index: number, row: DictItemModel): Promise<void> {
    let context = this.excelConfig.context;
    let dict = context.dictIndex[row.dictId];
    let dictItem = context.dictItemIndex[row.dictId][row.name];
    let success: boolean = false;
    if (dictItem) {
      success = await dict.updateItem({
        ...dictItem,
        name: row.name,
        value: row.value,
        dictId: row.dictId,
        remark: row.remark,
      });
    } else {
      success = !!(await dict.createItem(row));
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}
