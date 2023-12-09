import * as i from '../../impl';
import * as t from '../../type';

export class SpeciesSheet extends i.Sheet<t.Species> {
  typeName: string;
  constructor(directory: t.IDirectory, typeName: string) {
    super(
      t.generateUuid(),
      typeName + '定义',
      [
        { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: `${typeName}代码`, dataIndex: 'code', valueType: '描述型' },
        { title: `${typeName}名称`, dataIndex: 'name', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型' },
      ],
      directory,
    );
    this.typeName = typeName;
  }
  get coll(): t.XCollection<t.schema.XSpecies> {
    return this.dir.resource.speciesColl;
  }
}

export class DictSheet extends SpeciesSheet {
  constructor(directory: t.IDirectory) {
    super(directory, '字典');
  }
}

export class ClassifySheet extends SpeciesSheet {
  constructor(directory: t.IDirectory) {
    super(directory, '分类');
  }
}

export class SpeciesHandler<
  S extends DictSheet | ClassifySheet,
> extends i.SheetHandler<S> {
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(excel: t.IExcel) {
    const allErrors: t.Error[] = [];
    const codeSets = new Set();
    const dirHandler = excel.handlers.find((item) => item.sheet.name == '目录');
    this.sheet.data.forEach((item, index) => {
      let dir = dirHandler?.sheet.data.find((dir) => dir.code == item.directoryCode);
      let errors = this.assert(index, [
        { res: !item.directoryCode, error: '目录代码不能为空！' },
        { res: !item.name, error: `${this.sheet.typeName}名称不能为空！` },
        { res: !item.code, error: `${this.sheet.typeName}代码不能为空！` },
        { res: !dir, error: `目录代码:${item.directoryCode}不存在！` },
        { res: codeSets.has(item.code), error: `${this.sheet.typeName}编码不能重复！` },
      ]);
      codeSets.add(item.code);
      allErrors.push(...errors);
    });
    return allErrors;
  }
  /**
   * 更新/创建属性
   * @param excel 上下文
   * @param onItemCompleted
   */
  async operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void> {
    for (const row of this.sheet.data) {
      const dir = excel.context.directories[row.directoryCode];
      row.typeName = this.sheet.typeName;
      row.directoryId = dir.meta.id;
      const oldSpecies = excel.context.species[row.code];
      if (oldSpecies) {
        t.assignment(oldSpecies.meta, row);
      } else {
        excel.context.species[row.code] = { meta: row, items: {} };
      }
      onItemCompleted();
    }
    let res = await this.sheet.coll.replaceMany(this.sheet.data);
    res.forEach((item, index) => Object.assign(this.sheet.data[index], item));
  }
}
