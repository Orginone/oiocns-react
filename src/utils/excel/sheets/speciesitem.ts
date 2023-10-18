import * as i from '../impl';
import * as t from '../type';

export class DictItemSheet extends i.Sheet<t.SpeciesItem> {
  constructor(directory: t.IDirectory) {
    super(
      t.generateUuid(),
      '字典项定义',
      [
        { title: '字典代码', dataIndex: 'speciesCode', valueType: '描述型' },
        { title: '字典项名称', dataIndex: 'name', valueType: '描述型' },
        { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '字典主键', dataIndex: 'speciesId', valueType: '描述型' },
      ],
      directory,
    );
  }
  get coll(): t.XCollection<t.schema.XSpeciesItem> {
    return this.dir.resource.speciesItemColl;
  }
}

export class ClassifyItemSheet extends i.Sheet<t.SpeciesItem> {
  constructor(directory: t.IDirectory) {
    super(
      t.generateUuid(),
      '分类项定义',
      [
        { title: '分类代码', dataIndex: 'speciesCode', valueType: '描述型' },
        { title: '上级分类项代码', dataIndex: 'parentInfo', valueType: '描述型' },
        { title: '分类项名称', dataIndex: 'name', valueType: '描述型' },
        { title: '分类项代码', dataIndex: 'info', valueType: '描述型' },
        { title: '分类项代码（生成）', dataIndex: 'code', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '分类主键', dataIndex: 'speciesId', valueType: '描述型' },
        { title: '上级分类项主键', dataIndex: 'parentId', valueType: '描述型' },
      ],
      directory,
    );
  }
  get coll(): t.XCollection<t.schema.XSpeciesItem> {
    return this.dir.resource.speciesItemColl;
  }
}

export class DictItemHandler extends i.SheetHandler<DictItemSheet> {
  /**
   * 数据校验
   * @param context 上下文
   * @returns 错误信息
   */
  checkData(excel: t.IExcel) {
    const allErrors: t.Error[] = [];
    const handler = excel.handlers.find((item) => item.sheet.name == '字典定义');
    this.sheet.data.forEach((item, index) => {
      const species = handler?.sheet.data.find((spe) => spe.code == item.speciesCode);
      let errors = this.assert(index, [
        { res: !item.speciesCode, error: '字典代码不能为空！' },
        { res: !item.name, error: `字典项名称不能为空！` },
        { res: !item.info, error: `附加信息不能为空！` },
        { res: !species, error: `未获取到：${item.speciesCode}字典！` },
      ]);
      allErrors.push(...errors);
    });
    return allErrors;
  }
  /**
   * 更新/创建分类项
   */
  async operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void> {
    const groups = new t.List(this.sheet.data).GroupBy((item) => item.speciesCode);
    for (const key of Object.keys(groups)) {
      const items = groups[key];
      const species = excel.searchSpecies(key)!;
      for (const item of items) {
        item.speciesId = species.meta.id;
        const oldItem = species.items[item.info];
        if (oldItem) {
          t.assignment(oldItem, item);
        } else {
          item.code = 'TsnowId()';
        }
        onItemCompleted();
      }
      let res = await this.sheet.coll.replaceMany(items);
      res.forEach((item, index) => Object.assign(items[index], item));
    }
  }
}

export class ClassifyItemHandler extends i.SheetHandler<ClassifyItemSheet> {
  /**
   * 数据
   * @param excel 上下文
   * @returns
   */
  checkData(excel: t.IExcel) {
    const allErrors: t.Error[] = [];
    const handler = excel.handlers.find((item) => item.sheet.name == '分类定义');
    this.sheet.data.forEach((item, index) => {
      let species = handler?.sheet.data.find((spe) => spe.code == item.speciesCode);
      let errors = this.assert(index, [
        { res: !item.speciesCode, error: '分类代码不能为空！' },
        { res: !item.name, error: `分类项名称名称不能为空！` },
        { res: !item.info, error: `附加信息不能为空！` },
        { res: !species, error: `未获取到：${item.speciesCode}分类！` },
      ]);
      allErrors.push(...errors);
    });
    if (allErrors.length == 0) {
      const list = new t.List<{ index: number; item: t.SpeciesItem }>(
        this.sheet.data.map((item, index) => ({
          index: index,
          item: item,
        })),
      );
      const group = list.GroupBy((item) => item.item.speciesCode);
      Object.keys(group).forEach((key) => {
        const tree = new i.Tree(
          group[key],
          (item) => item.item.info,
          (item) => item.item.parentInfo,
        );
        for (const node of tree.freeMap.values()) {
          const parentInfo = node.data.item.parentInfo;
          allErrors.push(
            ...this.assert(node.data.index, [
              { res: true, error: '未找到父类：' + parentInfo },
            ]),
          );
        }
      });
    }
    return allErrors;
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param excel 上下文
   */
  async operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void> {
    const groups = new t.List(this.sheet.data).GroupBy((item) => item.speciesCode);
    for (const key of Object.keys(groups)) {
      const tree = new i.Tree<t.SpeciesItem>(
        groups[key],
        (item) => item.info,
        (item) => item.parentInfo,
      );
      const species = excel.searchSpecies(key)!;
      await this.recursion(species, tree.root, excel, onItemCompleted);
    }
  }
  /**
   * 根据层次递归插入
   * @param root 根节点
   */
  async recursion(
    species: t.SpeciesData,
    root: i.Node<t.SpeciesItem>,
    excel: t.IExcel,
    onItemCompleted: () => void,
  ) {
    const data = root.children.map((item) => item.data);
    for (let row of data) {
      row.speciesId = species.meta.id;
      if (row.parentInfo) {
        row.parentId = species.items[row.parentInfo].id;
      }
      if (species.items[row.info]) {
        t.assignment(species.items[row.info], row);
      } else {
        row.code = 'TsnowId()';
      }
      onItemCompleted();
    }
    (await this.sheet.coll.replaceMany(data))
      .map((item) => item as t.SpeciesItem)
      .forEach((item, index) => {
        Object.assign(data[index], item);
        species.items[item.info] = item;
      });
    for (let item of root.children) {
      await this.recursion(species, item, excel, onItemCompleted);
    }
  }
}
