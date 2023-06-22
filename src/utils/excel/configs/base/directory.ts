import { DirectoryModel } from '@/ts/base/model';
import { IDirectory, IForm, IProperty, ISpecies } from '@/ts/core';
import {
  Context,
  ExcelConfig,
  ReadConfig,
  ReadConfigImpl,
  SheetConfig,
  SheetConfigImpl,
  SheetName,
} from '../../types';

interface DirectoryImportModel {
  first: string;
  second: string;
  third: string;
  code: string;
  remark: string;
}

export class DirectorySheetConfig extends SheetConfigImpl<DirectoryImportModel> {
  root: IDirectory;

  constructor(root: IDirectory) {
    super(SheetName.Directory, 1, [
      { name: '一级目录', code: 'first', type: '描述型' },
      { name: '二级目录', code: 'second', type: '描述型' },
      { name: '三级目录', code: 'third', type: '描述型' },
      { name: '代码', code: 'code', type: '描述型' },
      { name: '定义', code: 'remark', type: '描述型' },
    ]);
    this.root = root;
  }
}

export class DirectoryReadConfig extends ReadConfigImpl<
  DirectoryImportModel,
  Context,
  DirectorySheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: DirectorySheetConfig, config: ExcelConfig<Context>) {
    super(sheetConfig, config);
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData(data: DirectoryImportModel[]): Promise<void> {
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.code || !item.second || !item.third || !item.code) {
        this.pushError(index, '一级目录、二级目录、三级目录、代码不能为空！');
      }
    }
  }
  /**
   * 创建一个目录
   */
  async create(
    name: string,
    code: string,
    remark: string,
    root?: IDirectory,
  ): Promise<IDirectory | undefined> {
    let next = root?.children
      .filter((item) => item.typeName == '目录')
      .find((item) => item.name == name);
    if (!next) {
      next = await root?.create({
        name: name,
        code: code,
        remark: remark,
      } as DirectoryModel);
    }
    if (next) {
      await this.cacheData(next);
    }
    return next;
  }
  /**
   * 建立上下文的一些索引
   */
  async cacheData(directory: IDirectory): Promise<void> {
    await directory.loadContent();
    this.context.directoryIndex[directory.name] = directory;
    let dictIndex: { [dictName: string]: ISpecies } = {};
    this.context.dictIndex[directory.id] = dictIndex;
    let speciesIndex: { [speciesName: string]: ISpecies } = {};
    this.context.speciesIndex[directory.id] = speciesIndex;
    directory.specieses.forEach((item) => {
      if (item.typeName == '字典') {
        dictIndex[item.name] = item;
        this.context.dictNameIndex[item.name] = item;
        this.context.dictCodeIndex[item.code] = item;
      } else if (item.typeName == '分类') {
        speciesIndex[item.name] = item;
        this.context.speciesNameIndex[item.name] = item;
        this.context.speciesCodeIndex[item.code] = item;
      }
    });
    let propertyIndex: { [propName: string]: IProperty } = {};
    this.context.propIndex[directory.id] = propertyIndex;
    directory.propertys.forEach((item) => {
      propertyIndex[item.name] = item;
      this.context.propCodeIndex[item.metadata.info] = item;
    });
    let entityFormIndex: { [formName: string]: IForm } = {};
    this.context.entityFormIndex[directory.id] = entityFormIndex;
    let workFormIndex: { [formName: string]: IForm } = {};
    this.context.workFormIndex[directory.id] = workFormIndex;
    directory.forms.forEach((item) => {
      if (item.typeName == '实体配置') {
        entityFormIndex[item.name] = item;
        this.context.entityFormNameIndex[item.name] = item;
      } else if (item.typeName == '事项配置') {
        workFormIndex[item.name] = item;
        this.context.workFormNameIndex[item.name] = item;
      }
    });
  }

  /**
   * 更新/创建属性
   * @param _index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(row: DirectoryImportModel): Promise<void> {
    let root = this.sheetConfig.root;
    await this.cacheData(root);
    let first = await this.create(row.first, row.first, row.first, root);
    let second = await this.create(row.second, row.second, row.second, first);
    await this.create(row.third, row.code, row.remark, second);
  }

  /**
   * 完成后回写后面有目录的表
   * @param sheets
   */
  completed(
    sheets: ReadConfig<any, any, SheetConfig<any>, ExcelConfig<Context>>[],
  ): void {
    let directoryIndex = this.excelConfig.context.directoryIndex;
    for (let readConfig of sheets) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasDirectory = sheetConfig.metaColumns.findIndex(
          (item) => item.name == '目录',
        );
        if (hasDirectory != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.directoryName && directoryIndex[item.directoryName]) {
              item.directoryId = directoryIndex[item.directoryName].id;
            } else {
              readConfig.pushError(index, '未找到目录：' + item.directoryName);
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
