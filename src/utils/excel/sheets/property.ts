import * as i from '../impl';
import * as t from '../type';

export class PropSheet extends i.Sheet<t.Property> {
  constructor(directory: t.IDirectory) {
    super(
      t.generateUuid(),
      '属性定义',
      [
        { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: '属性名称', dataIndex: 'name', valueType: '描述型' },
        { title: '属性代码', dataIndex: 'code', valueType: '描述型' },
        { title: '属性类型', dataIndex: 'valueType', valueType: '描述型' },
        { title: '单位', dataIndex: 'unit', valueType: '描述型' },
        { title: '（字典/分类）代码/ID', dataIndex: 'speciesCode', valueType: '描述型' },
        { title: '属性定义', dataIndex: 'remark', valueType: '描述型' },
        { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型' },
        { title: '(字典/分类) ID', dataIndex: 'speciesId', valueType: '描述型' },
      ],
      directory,
    );
  }

  get coll(): t.XCollection<t.schema.XProperty> {
    return this.dir.resource.propertyColl;
  }
}

export class PropHandler extends i.SheetHandler<PropSheet> {
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(excel: t.IExcel) {
    const allErrors: t.Error[] = [];
    const species: string[] = ['选择型', '分类型'];
    const types: string[] = ['数值型', '描述型', '时间型', '日期型', '用户型', '附件型'];
    const all: string[] = [...species, ...types];
    const dirHandler = excel.handlers.find((item) => item.sheet.name == '目录');
    const dictHandler = excel.handlers.find((item) => item.sheet.name == '字典定义');
    const classifyHandler = excel.handlers.find((item) => item.sheet.name == '分类定义');
    this.sheet.data.forEach((item, index) => {
      let dir = dirHandler?.sheet.data.find((dir) => dir.code == item.directoryCode);
      let hasType = all.indexOf(item.valueType) != -1;
      let hasSpecies = species.indexOf(item.valueType) != -1;
      let errors = this.assert(index, [
        { res: !item.directoryCode, error: '目录代码不能为空！' },
        { res: !item.name, error: `属性名称不能为空！` },
        { res: !item.code, error: `属性代码不能为空！` },
        { res: !item.valueType, error: `属性类型代码不能为空！` },
        { res: !item.info, error: `附加信息不能为空！` },
        { res: !dir, error: `目录代码:${item.directoryCode}不存在！` },
        { res: !hasType, error: `属性类型只能在[${all.join(',')}]中选择！` },
      ]);
      if (hasSpecies) {
        let searched;
        if (item.valueType == '选择型') {
          const find = (dict: any) => dict.code == item.speciesCode;
          searched = dictHandler?.sheet.data.find(find);
        } else {
          const find = (classify: any) => classify.code == item.speciesCode;
          searched = classifyHandler?.sheet.data.find(find);
        }
        errors.push(
          ...this.assert(index, [
            { res: !item.speciesCode, error: `当属性类型为选择型时，必须填写代码！` },
            { res: !searched, error: `未获取到代码：${item.speciesCode}!` },
          ]),
        );
      }
      allErrors.push(...errors);
    });
    return allErrors;
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param excel 上下文
   */
  async operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void> {
    const species: string[] = ['选择型', '分类型'];
    for (const row of this.sheet.data) {
      const dir = excel.context[row.directoryCode];
      row.directoryId = dir.meta.id;
      if (row.speciesCode && species.indexOf(row.valueType) != -1) {
        const species = excel.searchSpecies(row.speciesCode)!;
        row.speciesId = species.meta.id;
      }
      const oldProp = dir.props[row.code];
      if (oldProp) {
        t.assignment(oldProp, row);
      } else {
        dir.props[row.code] = row;
      }
      onItemCompleted();
    }
    let res = await this.sheet.coll.replaceMany(this.sheet.data);
    res.forEach((item, index) => {
      Object.assign(this.sheet.data[index], item);
    });
  }
}
