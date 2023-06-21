import { SpeciesModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  ReadConfig,
  SheetConfig,
  SheetName,
  ExcelConfig,
} from '../../types';
import { IDirectory, ISpecies } from '@/ts/core';
import { XSpeciesItem } from '@/ts/base/schema';

interface ClassifyModel extends SpeciesModel {
  directoryName: string;
}

export class DictSheetConfig extends SheetConfigImpl<ClassifyModel> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Dict, 1, [
      { name: '目录', code: 'directoryName', type: '描述型' },
      { name: '字典代码', code: 'code', type: '描述型' },
      { name: '字典名称', code: 'name', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

export class ClassifySheetConfig extends SheetConfigImpl<ClassifyModel> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Species, 1, [
      { name: '目录', code: 'directoryName', type: '描述型' },
      { name: '名称', code: 'name', type: '描述型' },
      { name: '代码', code: 'code', type: '描述型' },
      { name: '编码规则', code: 'info', type: '描述型' },
      { name: '备注', code: 'remark', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

class CommonReadConfig<
  S extends DictSheetConfig | ClassifySheetConfig,
> extends ReadConfigImpl<ClassifyModel, Context, S, ExcelConfig<Context>> {
  readonly replaceField: string;
  readonly speciesIndex: {
    [directoryId: string]: { [dictName: string]: ISpecies };
  };
  readonly speciesNameIndex: { [name: string]: ISpecies };
  readonly speciesCodeIndex: { [code: string]: ISpecies };
  readonly speciesItemIndex: {
    [speciesId: string]: { [itemName: string]: XSpeciesItem };
  };
  readonly speciesItemCodeIndex: {
    [speciesId: string]: { [itemCode: string]: XSpeciesItem };
  };

  constructor(
    sheetConfig: S,
    excelConfig: ExcelConfig<Context>,
    replaceField: string,
    speciesIndex: { [directoryId: string]: { [name: string]: ISpecies } },
    speciesNameIndex: { [name: string]: ISpecies },
    speciesCodeIndex: { [code: string]: ISpecies },
    speciesItemNameIndex: { [speciesId: string]: { [itemName: string]: XSpeciesItem } },
    speciesItemCodeIndex: { [speciesId: string]: { [itemCode: string]: XSpeciesItem } },
  ) {
    super(sheetConfig, excelConfig);
    this.replaceField = replaceField;
    this.speciesIndex = speciesIndex;
    this.speciesNameIndex = speciesNameIndex;
    this.speciesCodeIndex = speciesCodeIndex;
    this.speciesItemIndex = speciesItemNameIndex;
    this.speciesItemCodeIndex = speciesItemCodeIndex;
  }
  
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: ClassifyModel[]): Promise<void> {
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
   * 缓存数据
   */
  async cacheData(species: ISpecies): Promise<void> {
    await species.loadContent();
    this.speciesNameIndex[species.name] = species;
    this.speciesCodeIndex[species.code] = species;
    let speciesItemIndex: { [itemName: string]: XSpeciesItem } = {};
    let speciesItemCodeIndex: { [itemCode: string]: XSpeciesItem } = {};
    this.speciesItemIndex[species.id] = speciesItemIndex;
    this.speciesItemCodeIndex[species.id] = speciesItemCodeIndex;
    species.items.forEach((item) => {
      speciesItemIndex[item.name] = item;
      speciesItemCodeIndex[item.info] = item;
    });
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(row: ClassifyModel, index: number): Promise<void> {
    let context = this.excelConfig.context;
    let directory = context.directoryIndex[row.directoryName];
    let speciesIndex = this.speciesIndex[row.directoryId];
    let species: ISpecies | undefined = speciesIndex[row.name];
    let success = false;
    if (species) {
      success = await species.update({
        ...species.metadata,
        name: row.name,
        code: row.code,
        directoryId: row.directoryId,
        remark: row.remark,
      });
    } else {
      species = await directory.createSpecies(row);
      if (species) {
        speciesIndex[species.name] = species;
      }
      success = !!species;
    }
    if (species) {
      await this.cacheData(species);
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
    for (let readConfig of readConfigs) {
      let sheetConfig = readConfig.sheetConfig;
      if (sheetConfig.sheetName != this.sheetConfig.sheetName) {
        let hasDict = sheetConfig.metaColumns.findIndex(
          (item) => item.name == this.replaceField,
        );
        if (hasDict != -1) {
          for (let index = 0; index < sheetConfig.data.length; index++) {
            let item = sheetConfig.data[index];
            if (item.speciesName && this.speciesNameIndex[item.speciesName]) {
              item.speciesId = this.speciesNameIndex[item.speciesName].id;
              item.directoryId =
                this.speciesNameIndex[item.speciesName].metadata.directoryId;
            } else {
              readConfig.pushError(
                index,
                `未找到${this.replaceField}：` + item.speciesName,
              );
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

export class DictReadConfig extends CommonReadConfig<DictSheetConfig> {
  constructor(sheetConfig: DictSheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      '字典名称',
      excelConfig.context.dictIndex,
      excelConfig.context.dictNameIndex,
      excelConfig.context.dictCodeIndex,
      excelConfig.context.dictItemIndex,
      excelConfig.context.dictItemCodeIndex,
    );
  }

  async operatingItem(row: ClassifyModel, index: number): Promise<void> {
    row.typeName = '字典';
    await super.operatingItem(row, index);
  }
}

export class ClassifyReadConfig extends CommonReadConfig<ClassifySheetConfig> {
  constructor(sheetConfig: ClassifySheetConfig, excelConfig: ExcelConfig<Context>) {
    super(
      sheetConfig,
      excelConfig,
      '分类项名称',
      excelConfig.context.speciesIndex,
      excelConfig.context.speciesNameIndex,
      excelConfig.context.speciesCodeIndex,
      excelConfig.context.speciesItemIndex,
      excelConfig.context.speciesItemCodeIndex,
    );
  }

  async operatingItem(row: ClassifyModel, index: number): Promise<void> {
    row.typeName = '分类';
    await super.operatingItem(row, index);
  }
}
