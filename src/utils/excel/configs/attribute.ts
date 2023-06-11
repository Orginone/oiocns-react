import { AttributeModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
} from '../types';
import { IForm, IPropClass, ISpeciesItem, IThingClass, SpeciesType } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';

export class AttrSheetConfig extends SheetConfigImpl<AttributeModel> {
  species: IThingClass;

  constructor(spceies: ISpeciesItem) {
    super(SheetName.Attr, 1, [
      { name: '表单名称', code: 'formId', type: '描述型' },
      { name: '特性名称', code: 'name', type: '描述型' },
      { name: '特性代码', code: 'code', type: '描述型' },
      { name: '库表要素', code: 'propId', type: '描述型' },
    ]);
    this.species = spceies as IThingClass;
  }
}

export class AttrReadConfig extends ReadConfigImpl<
  AttributeModel,
  Context,
  AttrSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: AttrSheetConfig, config: ExcelConfig<Context>) {
    super(sheetConfig, config);
  }
  /**
   * 初始化属性索引
   */
  async initContext(): Promise<void> {
    let current = this.sheetConfig.species;
    let context = this.excelConfig.context;
    let all = await current.current.space.loadSpecies();
    context.unfoldPropIndex = {};
    for (let species of all) {
      if (species.typeName == SpeciesType.Store) {
        let props = await (species as IPropClass).loadAllProperty();
        for (let prop of props) {
          if (prop.info) {
            context.unfoldPropIndex[prop.info] = prop;
          }
        }
      }
    }
    context.attrIndex = {};
    for (let key of Object.keys(context.formIndex)) {
      let form = context.formIndex[key];
      context.attrIndex[form.id] = {};
      let attrs = await form.loadAttributes();
      for (let attr of attrs) {
        context.attrIndex[form.id][attr.code] = attr;
      }
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: AttributeModel[]): Promise<void> {
    let unfoldPropIndex = this.excelConfig.context.unfoldPropIndex;
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.formId || !item.name || !item.code || !item.propId) {
        this.pushError(index, '存在未填写的表单名称、特性名称、特性代码、库表要素！');
      }
      if (!unfoldPropIndex[item.propId]) {
        this.pushError(index, `未获取到库表要素：${item.propId}`);
      }
    }
  }

  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(index: number, row: AttributeModel): Promise<void> {
    let context = this.excelConfig.context;
    let form: IForm | undefined = context.formIndex[row.formId];
    let attr: XAttribute | undefined = context.attrIndex[row.formId][row.code];
    let success: boolean = false;
    if (attr) {
      let prop = context.unfoldPropIndex[row.propId];
      success = await form.updateAttribute(
        {
          ...attr,
          name: row.name,
          code: row.code,
          remark: prop.remark,
        },
        prop,
      );
    } else {
      let prop = context.unfoldPropIndex[row.propId];
      attr = await form.createAttribute(
        { ...row, dictId: prop.dictId, remark: prop.remark },
        prop,
      );
      if (attr) {
        context.attrIndex[row.formId][row.code] = attr;
      }
      success = !!form;
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}
