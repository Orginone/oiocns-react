import * as i from '../impl';
import * as t from '../type';

export class FormSheet extends i.Sheet<t.Form> {
  constructor(directory: t.IDirectory) {
    super(
      '表单定义',
      [
        { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: '表单类型', dataIndex: 'typeName', valueType: '描述型' },
        { title: '表单名称', dataIndex: 'name', valueType: '描述型' },
        { title: '表单代码', dataIndex: 'code', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型' },
      ],
      directory,
    );
  }

  get coll(): t.XCollection<t.schema.XForm> {
    return this.dir.resource.formColl;
  }
}

export class AttrSheet extends i.Sheet<t.Attribute> {
  constructor(directory: t.IDirectory) {
    super(
      '表单特性',
      [
        { title: '表单代码', dataIndex: 'formCode', valueType: '描述型' },
        { title: '特性名称', dataIndex: 'name', valueType: '描述型' },
        { title: '特性代码', dataIndex: 'code', valueType: '描述型' },
        { title: '关联属性代码/id', dataIndex: 'propCode', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '表单主键', dataIndex: 'formId', valueType: '描述型' },
        { title: '关联属性主键', dataIndex: 'propId', valueType: '描述型' },
      ],
      directory,
    );
  }
}

export class FormHandler extends i.SheetHandler<FormSheet> {
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(excel: t.IExcel) {
    const allErrors: t.Error[] = [];
    const dirHandler = excel.handlers.find((item) => item.sheet.name == '目录');
    this.sheet.data.forEach((item, index) => {
      let right = ['实体配置', '事项配置'].indexOf(item.typeName) != -1;
      let hasDir = dirHandler?.sheet.data.find((dir) => dir.code == item.directoryCode);
      let errors = this.assert(index, [
        { res: !item.directoryCode, error: '目录未填写' },
        { res: !item.typeName, error: '表单类型未填写' },
        { res: !item.name, error: '表单名称未填写' },
        { res: !item.code, error: '表单代码未填写' },
        { res: !right, error: '表单类型只能填写实体配置或事项配置' },
        { res: !hasDir, error: `未获取到目录代码：${item.directoryCode}` },
      ]);
      allErrors.push(...errors);
    });
    const attrHandler = excel.handlers.find((item) => item.sheet.name == '表单特性');
    const propHandler = excel.handlers.find((item) => item.sheet.name == '属性定义');
    attrHandler?.sheet.data.forEach((item, index) => {
      let hasForm = this.sheet.data.find((dir) => dir.code == item.formCode);
      let hasProp = propHandler?.sheet.data.find((prop) => prop.code == item.propCode);
      let errors = attrHandler?.assert(index, [
        { res: !item.formCode, error: '表单代码未填写' },
        { res: !item.name, error: '特性名称未填写' },
        { res: !item.code, error: '特性代码未填写' },
        { res: !item.propCode, error: '关联属性代码未填写' },
        { res: !hasForm, error: `未找到表单代码：${item.formCode}` },
        { res: !hasProp, error: `未获取到关联属性代码：${item.propCode}` },
      ]);
      allErrors.push(...errors);
    });
    return allErrors;
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operating(excel: t.IExcel, onItemCompleted: () => void): Promise<void> {
    const handler = excel.getHandler('表单特性');
    const attrData = new t.List(handler?.sheet.data ?? []);
    const attrGroup = attrData.GroupBy((item) => item.formCode);
    for (const row of this.sheet.data) {
      const dir = excel.context[row.directoryCode];
      row.directoryId = dir.meta.id;
      const old = dir.forms[row.code];
      if (old) {
        t.assignment(old.meta, row);
      }
      let res = await this.sheet.coll.replace(row);
      Object.assign(row, res);
      let oldMap: { [key: string]: t.schema.XAttribute } = {};
      if (!row.attributes) {
        row.attributes = [];
      }
      row.attributes.forEach((o) => (oldMap[o.code] = o));

      const newAttrs = attrGroup[row.code] ?? [];
      newAttrs.forEach((newAttr) => {
        newAttr.formId = row.id;
        let prop = excel.searchProps(newAttr.propCode)!;
        if (!newAttr.code) {
          newAttr.code = prop.code;
        }
        newAttr.property = prop;
        newAttr.propId = prop.id;
        const old = oldMap[newAttr.code];
        if (old) {
          Object.assign(old, newAttr);
        } else {
          newAttr.id = 'snowId()';
          newAttr.authId = t.orgAuth.SuperAuthId;
          newAttr.code = newAttr.code ?? 'SsnowId()';
          row.attributes.push(newAttr);
        }
        onItemCompleted();
      });

      res = await this.sheet.coll.replace(row);
      if (res) {
        Object.assign(row, res);
        for (const oldItem of newAttrs) {
          for (const newItem of res.attributes) {
            if (newItem.code == oldItem.code) {
              Object.assign(oldItem, newItem);
            }
          }
        }
      }
      onItemCompleted();
    }
  }
}

export class AttrHandler extends i.SheetHandler<AttrSheet> {
  checkData(_: t.IExcel): t.Error[] {
    return [];
  }
  async operating(_: t.IExcel, __: () => void): Promise<void> {}
}
