import { AttributeModel } from '@/ts/base/model';
import { XAttribute } from '@/ts/base/schema';
import { IDirectory, IForm } from '@/ts/core';
import {
  Context,
  ExcelConfig,
  ReadConfigImpl,
  SheetConfigImpl,
  SheetName,
} from '../../types';

interface Attribute extends AttributeModel {
  directoryId: string;
  formName: string;
  propCode: string;
}

export class FormAttrSheetConfig extends SheetConfigImpl<Attribute> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.FormAttr, 1, [
      { name: '表单名称', code: 'formName', type: '描述型' },
      { name: '特性名称', code: 'name', type: '描述型' },
      { name: '特性代码', code: 'code', type: '描述型' },
      { name: '库表要素', code: 'propCode', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

export class WorkAttrSheetConfig extends SheetConfigImpl<Attribute> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.WorkAttr, 1, [
      { name: '事项名称', code: 'formName', type: '描述型' },
      { name: '特性名称', code: 'name', type: '描述型' },
      { name: '特性代码', code: 'code', type: '描述型' },
      { name: '库表要素', code: 'propCode', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

class CommAttrReadConfig<
  C extends WorkAttrSheetConfig | FormAttrSheetConfig,
> extends ReadConfigImpl<AttributeModel, Context, C, ExcelConfig<Context>> {
  readonly formNameIndex: { [formName: string]: IForm };

  constructor(
    sheetConfig: C,
    config: ExcelConfig<Context>,
    formNameIndex: { [formName: string]: IForm },
  ) {
    super(sheetConfig, config);
    this.formNameIndex = formNameIndex;
  }

  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: Attribute[]): Promise<void> {
    let fields = ['formName', 'name', 'code', 'propCode'];
    let fieldsName = this.sheetConfig.metaColumns
      .filter((item) => fields.indexOf(item.code) != -1)
      .map((item) => item.name)
      .join('、');
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.formName || !item.name || !item.code || !item.propCode) {
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
  async operatingItem(row: Attribute, index: number): Promise<void> {
    let form: IForm = this.formNameIndex[row.formName];
    let prop = this.context.propCodeIndex[row.propCode];
    let attr: XAttribute | undefined = this.context.formAttrIndex[row.formId][row.code];
    let success: boolean = false;
    if (attr) {
      success = await form.updateAttribute(
        {
          ...attr,
          name: row.name,
          code: row.code,
          remark: prop.remark,
        },
        prop.metadata,
      );
    } else {
      attr = await form.createAttribute({ ...row }, prop.metadata);
      if (attr) {
        this.context.formAttrIndex[row.formId][row.code] = attr;
      }
      success = !!form;
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}

export class FormAttrReadConfig extends CommAttrReadConfig<FormAttrSheetConfig> {
  constructor(sheetConfig: FormAttrSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(sheetConfig, excelConfig, excelConfig.context.entityFormNameIndex);
  }
}

export class WorkAttrReadConfig extends CommAttrReadConfig<WorkAttrSheetConfig> {
  constructor(sheetConfig: FormAttrSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(sheetConfig, excelConfig, excelConfig.context.workFormNameIndex);
  }
}
