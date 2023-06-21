import { FormModel } from '@/ts/base/model';
import { XAttribute } from '@/ts/base/schema';
import { IDirectory, IForm } from '@/ts/core';
import {
  Context,
  ExcelConfig,
  ReadConfig,
  ReadConfigImpl,
  SheetConfig,
  SheetConfigImpl,
  SheetName,
} from '../../types';

export interface Form extends FormModel {
  directoryName: string;
}

export class FormSheetConfig extends SheetConfigImpl<Form> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Form, 1, [
      { name: '目录', code: 'directoryName', type: '描述型' },
      { name: '表单名称', code: 'name', type: '描述型' },
      { name: '表单代码', code: 'code', type: '描述型' },
      { name: '表单定义', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

export class WorkSheetConfig extends SheetConfigImpl<Form> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Work, 1, [
      { name: '目录', code: 'directoryName', type: '描述型' },
      { name: '事项名称', code: 'name', type: '描述型' },
      { name: '事项代码', code: 'code', type: '描述型' },
      { name: '事项定义', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

class CommReadConfig<C extends FormSheetConfig | WorkSheetConfig> extends ReadConfigImpl<
  Form,
  Context,
  C,
  ExcelConfig<Context>
> {
  readonly replaceField: string;
  readonly formIndex: { [directoryId: string]: { [formName: string]: IForm } } = {};
  readonly formNameIndex: { [formName: string]: IForm } = {};

  constructor(
    sheetConfig: C,
    excelConfig: ExcelConfig<Context>,
    replaceField: string,
    formIndex: { [directoryId: string]: { [formName: string]: IForm } },
    formNameIndex: { [formName: string]: IForm },
  ) {
    super(sheetConfig, excelConfig);
    this.replaceField = replaceField;
    this.formIndex = formIndex;
    this.formNameIndex = formNameIndex;
  }

  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: Form[]): Promise<void> {
    let fields = ['directoryName', 'name', 'code'];
    let fieldsName = this.sheetConfig.metaColumns
      .filter((item) => fields.indexOf(item.code) != -1)
      .map((item) => item.name)
      .join('、');
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.directoryName || !item.name || !item.code) {
        this.pushError(index, `存在未填写的${fieldsName}！`);
      }
    }
  }
  /**
   * 缓存一些数据
   */
  async cacheData(form: IForm): Promise<void> {
    this.formNameIndex[form.name] = form;
    let attrs = await form.loadAttributes();
    let attrIndex: { [attrCode: string]: XAttribute } = {};
    this.context.formAttrIndex[form.id] = attrIndex;
    attrs.forEach((attr) => (attrIndex[attr.code] = attr));
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(row: Form, index: number): Promise<void> {
    let directory = this.context.directoryIndex[row.directoryName];
    let formIndex = this.formIndex[row.directoryId];
    let form: IForm | undefined = formIndex[row.name];
    let success: boolean = false;
    if (form) {
      success = await form.update({
        ...form.metadata,
        name: row.name,
        code: row.code,
        directoryId: row.directoryId,
        remark: row.remark,
      });
    } else {
      form = await directory.createForm(row);
      if (form) {
        formIndex[form.code] = form;
      }
      success = !!form;
    }
    if (form) {
      await this.cacheData(form);
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
    for (let readConfig of sheets) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasForm = sheetConfig.metaColumns.findIndex(
          (item) => item.name == this.replaceField,
        );
        if (hasForm != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.formName && this.formNameIndex[item.formName]) {
              item.formId = this.formNameIndex[item.formName].id;
              item.directoryId = this.formNameIndex[item.formName].metadata.id;
            } else {
              readConfig.pushError(index, '未找到表单：' + item.formName);
            }
            if (item.propCode && this.context.propCodeIndex[item.propCode]) {
              item.propId = this.context.propCodeIndex[item.propCode].metadata.id;
            } else {
              readConfig.pushError(index, '未找到库表要素：' + item.propCode);
            }
          }
          if (readConfig.errors.length > 0) {
            this.excelConfig.onReadError?.apply(this.excelConfig, [readConfig.errors]);
            throw new Error();
          }
        }
      }
    }
  }
}

export class FormReadConfig extends CommReadConfig<FormSheetConfig> {
  constructor(sheetConfig: FormSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      '表单名称',
      excelConfig.context.entityFormIndex,
      excelConfig.context.entityFormNameIndex,
    );
  }
  async operatingItem(row: Form, index: number): Promise<void> {
    row.typeName = '实体配置';
    await super.operatingItem(row, index);
  }
}

export class WorkReadConfig extends CommReadConfig<WorkSheetConfig> {
  constructor(sheetConfig: WorkSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      '事项名称',
      excelConfig.context.workFormIndex,
      excelConfig.context.workFormNameIndex,
    );
  }
  async operatingItem(row: Form, index: number): Promise<void> {
    row.typeName = '事项配置';
    await super.operatingItem(row, index);
  }
}
