import { XSpecies } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import { assignment } from '../..';
import { Context, ReadConfigImpl, SheetConfigImpl, SheetName } from '../../types';

export interface Species extends XSpecies {
  directoryCode: string;
}

export class DictSheetConfig extends SheetConfigImpl<Species> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Dict, 1, [
      { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
      { title: '字典代码', dataIndex: 'code', valueType: '描述型' },
      { title: '字典名称', dataIndex: 'name', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class ClassifySheetConfig extends SheetConfigImpl<Species> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Species, 1, [
      { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
      { title: '分类名称', dataIndex: 'name', valueType: '描述型' },
      { title: '分类代码', dataIndex: 'code', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

class CommonReadConfig<
  S extends DictSheetConfig | ClassifySheetConfig,
> extends ReadConfigImpl<Species, Context, S> {
  /**
   * 初始化
   * @param c 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheetConfig.data) {
      if (c.speciesMap.has(item.code)) {
        let old = c.speciesMap.get(item.code)!;
        assignment(old, item);
      }
      c.speciesMap.set(item.code, item);
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
      if (!item.directoryCode || !item.name || !item.code) {
        if (item.typeName == '分类') {
          this.pushError(index, `存在未填写的目录代码、分类名称、分类代码！`);
        } else if (item.typeName == '字典') {
          this.pushError(index, `存在未填写的目录代码、字典代码、字典名称！`);
        }
      }
      if (!context.directoryMap.has(item.directoryCode)) {
        this.pushError(index, `未获取到目录代码：${item.directoryCode}`);
      }
    }
    return this.errors;
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operating(context: Context, onItemCompleted: () => void): Promise<void> {
    let speciesMap: { index: number; species: XSpecies }[] = [];
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let row = this.sheetConfig.data[index];
      let dir = context.directoryMap.get(row.directoryCode)!;
      row.directoryId = dir.id;
      speciesMap.push({ index, species: row });
      onItemCompleted();
    }
    if (speciesMap.length > 0) {
      let replaceRes = await this.sheetConfig.directory.resource.speciesColl.replaceMany(
        speciesMap.map((item) => item.species),
      );
      for (let index = 0; index < replaceRes.length; index++) {
        let species = replaceRes[index] as Species;
        this.sheetConfig.data[speciesMap[index].index] = species;
        context.speciesMap.set(species.code, species);
      }
    }
  }
}

export class DictReadConfig extends CommonReadConfig<DictSheetConfig> {
  async operating(context: Context, onItemCompleted: () => void): Promise<void> {
    this.sheetConfig.data.forEach((row) => (row.typeName = '字典'));
    await super.operating(context, onItemCompleted);
  }
}

export class ClassifyReadConfig extends CommonReadConfig<ClassifySheetConfig> {
  async operating(context: Context, onItemCompleted: () => void): Promise<void> {
    this.sheetConfig.data.forEach((row) => (row.typeName = '分类'));
    await super.operating(context, onItemCompleted);
  }
}
