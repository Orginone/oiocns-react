import { FormModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
  ReadConfig,
  SheetConfig,
} from '../../types';
import { IForm, ISpeciesItem, IThingClass, IWorkClass } from '@/ts/core';

export class FormSheetConfig extends SheetConfigImpl<FormModel> {
  species: IThingClass;

  constructor(species: ISpeciesItem) {
    super(SheetName.Form, 1, [
      { name: '类型', code: 'speciesId', type: '描述型' },
      { name: '表单名称', code: 'name', type: '描述型' },
      { name: '表单代码', code: 'code', type: '描述型' },
      { name: '表单定义', code: 'remark', type: '描述型' },
    ]);
    this.species = species as IThingClass;
  }
}

export class WorkSheetConfig extends SheetConfigImpl<FormModel> {
  species: IWorkClass;

  constructor(species: ISpeciesItem) {
    super(SheetName.Work, 1, [
      { name: '类型', code: 'speciesId', type: '描述型' },
      { name: '事项名称', code: 'name', type: '描述型' },
      { name: '事项代码', code: 'code', type: '描述型' },
      { name: '事项定义', code: 'remark', type: '描述型' },
    ]);
    this.species = species as IWorkClass;
  }
}

class CommReadConfig<C extends FormSheetConfig | WorkSheetConfig> extends ReadConfigImpl<
  FormModel,
  Context,
  C,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: C, excelConfig: ExcelConfig<Context>) {
    super(sheetConfig, excelConfig);
  }

  /**
   * 初始化已存在字典
   * @param context 导入上下文
   */
  async initContext(): Promise<void> {
    debugger
    let context = this.excelConfig.context;
    context.formIndex = {};
    let thingSpecies = this.sheetConfig.species;
    let forms = await thingSpecies.loadForms();
    for (let form of forms) {
      context.formIndex[form.code] = form;
      context.formIndex[form.name] = form;
      context.formIndex[form.id] = form;
    }
    for (let child of thingSpecies.children) {
      let forms = await (child as IThingClass | IWorkClass).loadForms();
      for (let form of forms) {
        context.formIndex[form.code] = form;
        context.formIndex[form.name] = form;
        context.formIndex[form.id] = form;
      }
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: FormModel[]): Promise<void> {
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.speciesId || !item.name || !item.code) {
        this.pushError(index, '存在未填写的类型、表单名称、表单代码！');
      }
    }
  }

  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(index: number, row: FormModel): Promise<void> {
    let context = this.excelConfig.context;
    let child = context.speciesIndex[row.speciesId];
    let form: IForm | undefined = context.formIndex[row.code];
    let success: boolean = false;
    if (form) {
      success = await form.update({
        ...form.metadata,
        name: row.name,
        code: row.code,
        speciesId: row.speciesId,
        remark: row.remark,
      });
    } else {
      form = await (child as IThingClass).createForm(row);
      if (form) {
        context.formIndex[form.code] = form;
        context.formIndex[form.name] = form;
        context.formIndex[form.id] = form;
      }
      success = !!form;
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
  /**
   * 完成后回写特性表
   * @param sheets 表格
   */
  completed(
    sheets: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<Context>>[],
  ): void {
    let context = this.excelConfig.context;
    for (let readConfig of sheets) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasForm = sheetConfig.metaColumns.findIndex(
          (item) => item.name == '表单名称' || item.name == "事项名称",
        );
        if (hasForm != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.formId && context.formIndex[item.formId]) {
              item.formId = context.formIndex[item.formId].id;
            } else {
              readConfig.pushError(index, '未找到表单：' + item.formId);
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

export class FormReadConfig extends CommReadConfig<FormSheetConfig> {
}

export class WorkReadConfig extends CommReadConfig<WorkSheetConfig> {
}