import { SpeciesItemModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
} from '../../types';
import { IDirectory, ISpecies } from '@/ts/core';
import { XSpeciesItem } from '@/ts/base/schema';

interface ClassifyItemModel extends SpeciesItemModel {
  directoryId: string;
  speciesName: string;
  parentName: string;
}

export class DictItemSheetConfig extends SheetConfigImpl<ClassifyItemModel> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.DictItem, 1, [
      { name: '字典名称', code: 'speciesName', type: '描述型' },
      { name: '名称', code: 'name', type: '描述型' },
      { name: '值', code: 'info', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

export class ClassifyItemSheetConfig extends SheetConfigImpl<ClassifyItemModel> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.SpeciesItem, 1, [
      { name: '分类项名称', code: 'speciesName', type: '描述型' },
      { name: '名称', code: 'name', type: '描述型' },
      { name: '父类名称', code: 'parentName', type: '描述型' },
      { name: '分类代码', code: 'code', type: '描述型' },
      { name: '附加信息', code: 'info', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

class CommonItemReadConfig<
  S extends DictItemSheetConfig | ClassifyItemSheetConfig,
> extends ReadConfigImpl<ClassifyItemModel, Context, S, ExcelConfig<Context>> {
  readonly speciesIndex: {
    [directoryId: string]: { [dictName: string]: ISpecies };
  };
  readonly speciesItemIndex: {
    [speciesId: string]: { [itemName: string]: XSpeciesItem };
  };

  constructor(
    sheetConfig: S,
    excelConfig: ExcelConfig<Context>,
    speciesIndex: { [directoryId: string]: { [dictName: string]: ISpecies } },
    speciesItemIndex: { [speciesId: string]: { [itemName: string]: XSpeciesItem } },
  ) {
    super(sheetConfig, excelConfig);
    this.speciesIndex = speciesIndex;
    this.speciesItemIndex = speciesItemIndex;
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData(data: ClassifyItemModel[]): Promise<void> {
    let fields = ['speciesId', 'name', 'info'];
    let fieldsName = this.sheetConfig.metaColumns
      .filter((item) => fields.indexOf(item.code) != -1)
      .map((item) => item.name)
      .join('、');
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.speciesId || !item.name || !item.info) {
        this.pushError(index, `存在未填写的${fieldsName}！`);
      }
    }
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(row: ClassifyItemModel, index: number): Promise<void> {
    let dict = this.speciesIndex[row.directoryId][row.speciesName];
    let dictItem = this.speciesItemIndex[row.speciesId][row.name];
    let success: boolean = false;
    if (dictItem) {
      success = await dict.updateItem({
        ...dictItem,
        name: row.name,
        info: row.info,
        speciesId: row.speciesId,
        remark: row.remark,
      });
    } else {
      let speciesItem = await dict.createItem(row);
      success = !!speciesItem;
      if (speciesItem) {
        this.speciesItemIndex[row.speciesId][row.name] = speciesItem;
      }
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}

export class DictItemReadConfig extends CommonItemReadConfig<DictItemSheetConfig> {
  constructor(sheetConfig: DictItemSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      excelConfig.context.dictIndex,
      excelConfig.context.dictItemIndex,
    );
  }
}

export class ClassifyItemReadConfig extends CommonItemReadConfig<ClassifyItemSheetConfig> {
  constructor(sheetConfig: DictItemSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      excelConfig.context.speciesIndex,
      excelConfig.context.speciesItemIndex,
    );
  }
  async operatingItem(row: ClassifyItemModel, index: number): Promise<void> {
    if (row.parentName) {
      let parent = this.speciesItemIndex[row.speciesId][row.parentName];
      if (parent) {
        row.parentId = parent.id;
      } else {
        this.pushError(index, `未获取到父类：${row.parentName ?? ""}`);
        return;
      }
    }
    super.operatingItem(row, index);
  }
}
