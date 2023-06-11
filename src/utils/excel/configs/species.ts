import { ISpeciesItem } from '@/ts/core';
import { SpeciesModel } from '@/ts/base/model';
import {
  SheetConfigImpl,
  ReadConfigImpl,
  ReadConfig,
  SheetConfig,
  Context,
  ExcelConfig,
} from '../types';

export class SpeciesSheetConfig extends SheetConfigImpl<SpeciesModel> {
  species: ISpeciesItem;

  constructor(species: ISpeciesItem) {
    super(species.typeName, 1, [
      { name: '名称', code: 'name', type: '描述型' },
      { name: '代码', code: 'code', type: '描述型' },
      { name: '类型', code: 'typeName', type: '选择型', options: species.speciesTypes },
      { name: '定义', code: 'remark', type: '描述型' },
    ]);
    this.species = species;
  }
}

export class SpeciesReadConfig extends ReadConfigImpl<
  SpeciesModel,
  Context,
  SpeciesSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: SpeciesSheetConfig, config: ExcelConfig<Context>) {
    super(sheetConfig, config);
  }

  /**
   * 初始化上下文，存储分类索引
   */
  async initContext(): Promise<void> {
    this.excelConfig.context.speciesIndex = {};
  }

  /**
   * 必填以及能创建的分类子类型校验
   * @param data
   */
  async checkData(data: SpeciesModel[]): Promise<void> {
    let sheetConfig = this.sheetConfig;
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.name || !item.code || !item.typeName || !item.remark) {
        this.pushError(index, '存在未填写的名称、代码、类型以及定义！');
      }
      let position = sheetConfig.species.speciesTypes.indexOf(item.typeName);
      if (position == -1) {
        let types = sheetConfig.species.speciesTypes.join('，');
        let error = `子类型不存在[${item.typeName}]类型，请在[${types}]几个选项中选择！`;
        this.pushError(index, error);
      }
    }
  }

  /**
   * Excel 每一行处理
   * @param row 行
   * @param context 上下文
   */
  async operatingItem(index: number, row: SpeciesModel): Promise<void> {
    let species = this.sheetConfig.species;
    let child = species.children.find((child) => child.metadata.code == row.code);
    if (child) {
      let success = await child.update({
        ...child.metadata,
        name: row.name,
        code: row.code,
        typeName: row.typeName,
        remark: row.remark,
      });
      if (!success) {
        this.pushError(index, '生成失败，请根据提示修改错误！');
        return;
      }
    } else {
      child = await species.create({
        ...row,
        parentId: species.metadata.id,
        shareId: species.metadata.shareId,
        authId: species.metadata.authId,
      });
      if (!child) {
        this.pushError(index, '生成失败，请根据提示修改错误！');
        return;
      }
    }
    this.excelConfig.context.speciesIndex[child.id] = child;
  }

  /**
   * 表处理完成需要回写后面的表
   * @param readConfigs
   */
  completed(
    readConfigs: ReadConfig<any, Context, SheetConfig<any>, ExcelConfig<Context>>[],
  ): void {
    let typeMap: { [key: string]: string } = {};
    let species = this.sheetConfig.species;
    species.children.forEach((item) => (typeMap[item.metadata.name] = item.metadata.id));
    for (let readConfig of readConfigs) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasSpecies = sheetConfig.metaColumns.findIndex((item) => item.name == '类型');
        if (hasSpecies != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.speciesId && typeMap[item.speciesId]) {
              item.speciesId = typeMap[item.speciesId];
            } else {
              readConfig.pushError(index, '未找到类型：' + item.speciesId);
            }
          }
          if (readConfig.errors.length > 0) {
            throw new Error();
          }
        }
      }
    }
  }
}
