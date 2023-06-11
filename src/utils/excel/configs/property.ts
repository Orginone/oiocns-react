import { PropertyModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
} from '../types';
import { IPropClass, ISpeciesItem } from '@/ts/core';

export class PropSheetConfig extends SheetConfigImpl<PropertyModel> {
  species: ISpeciesItem;

  constructor(spceies: ISpeciesItem) {
    super(SheetName.Property, 1, [
      { name: '类型', code: 'speciesId', type: '描述型' },
      { name: '属性名称', code: 'name', type: '描述型' },
      {
        name: '属性类型',
        code: 'valueType',
        type: '选择型',
        options: [
          '数值型',
          '描述型',
          '选择型',
          '分类型',
          '附件型',
          '日期型',
          '时间型',
          '用户型',
        ],
      },
      { name: '单位', code: 'unit', type: '描述型' },
      { name: '枚举字典', code: 'dictId', type: '选择型' },
      { name: '属性定义', code: 'remark', type: '描述型' },
    ]);
    this.species = spceies;
  }
}

export class PropReadConfig extends ReadConfigImpl<
  PropertyModel,
  Context,
  PropSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: PropSheetConfig, config: ExcelConfig<Context>) {
    super(sheetConfig, config);
  }
  /**
   * 初始化属性索引
   */
  async initContext(): Promise<void> {
    let context = this.excelConfig.context;
    context.propIndex = {};
    for (let key of Object.keys(context.speciesIndex)) {
      let speciesItem = context.speciesIndex[key] as IPropClass;
      context.propIndex[key] = {};
      let properties = await speciesItem.loadAllProperty();
      for (let property of properties) {
        context.propIndex[key][property.name] = property;
      }
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: PropertyModel[]): Promise<void> {
    let species = this.sheetConfig.species;
    let dicts = await species.current.space.loadDicts();
    let dictMap: { [key: string]: string } = {};
    dicts.forEach((item) => (dictMap[item.metadata.code] = item.metadata.id));
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.speciesId || !item.name || !item.valueType) {
        this.pushError(index, '存在未填写的类型、属性名称、属性类型！');
      }
      if (item.valueType == '选择型') {
        if (item.dictId) {
          if (!dictMap[item.dictId]) {
            this.pushError(index, `未获取到名称为${item.dictId}的字典！`);
          }
          item.dictId = dictMap[item.dictId];
        } else {
          this.pushError(index, '当属性类型为选择型时，必须填写枚举字典！');
        }
      }
    }
  }

  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(index: number, row: PropertyModel): Promise<void> {
    let context = this.excelConfig.context;
    let species = context.speciesIndex[row.speciesId];
    let property = context.propIndex[row.speciesId][row.name];
    let success: boolean = false;
    if (property) {
      success = await (species as IPropClass).updateProperty({
        ...property,
        name: row.name,
        code: row.code,
        valueType: row.valueType,
        unit: row.unit,
        speciesId: row.speciesId,
        dictId: row.valueType == '选择型' ? row.dictId : undefined!,
        remark: row.remark,
      });
    } else {
      success = !!(await (species as IPropClass).createProperty({
        ...row,
        dictId: row.valueType == '选择型' ? row.dictId : undefined!,
      }));
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}
