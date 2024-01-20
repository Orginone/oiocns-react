import * as i from '../../impl';
import * as t from '../../type';

export class FormSheet extends i.Sheet<t.Form> {
  constructor(directory: t.IDirectory) {
    super(
      t.generateUuid(),
      '表单定义',
      [
        { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: '表单类型', dataIndex: 'typeName', valueType: '描述型' },
        { title: '表单名称', dataIndex: 'name', valueType: '描述型' },
        { title: '表单代码', dataIndex: 'code', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '允许新增', dataIndex: 'allowAdd', valueType: '描述型' },
        { title: '允许编辑', dataIndex: 'allowEdit', valueType: '描述型' },
        { title: '允许选择', dataIndex: 'allowSelect', valueType: '描述型' },
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
      t.generateUuid(),
      '表单特性',
      [
        { title: '表单代码', dataIndex: 'formCode', valueType: '描述型' },
        { title: '特性名称', dataIndex: 'name', valueType: '描述型' },
        { title: '特性代码', dataIndex: 'code', valueType: '描述型' },
        { title: '关联属性代码/id', dataIndex: 'propCode', valueType: '描述型' },
        { title: '只读属性', dataIndex: 'readOnly', valueType: '描述型' },
        { title: '隐藏特性', dataIndex: 'hideField', valueType: '描述型' },
        { title: '必填特性', dataIndex: 'isRequired', valueType: '描述型' },
        { title: '默认显示列', dataIndex: 'visible', valueType: '描述型' },
        { title: '展示至摘要', dataIndex: 'showToRemark', valueType: '描述型' },
        { title: '显示到类目树', dataIndex: 'species', valueType: '描述型' },
        { title: '固定列', dataIndex: 'fixed', valueType: '描述型' },
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
    const bool = ['是', '否'];
    this.sheet.data.forEach((item, index) => {
      let hasDir = dirHandler?.sheet.data.find((dir) => dir.code == item.directoryCode);
      let errors = this.assert(index, [
        { res: !item.directoryCode, error: '目录未填写' },
        { res: !item.typeName, error: '表单类型未填写' },
        { res: !item.name, error: '表单名称未填写' },
        { res: !item.code, error: '表单代码未填写' },
        { res: !(item.typeName == '表单'), error: '表单类型只能填写表单' },
        { res: !hasDir, error: `未获取到目录代码：${item.directoryCode}` },
      ]);
      if (item.allowAdd) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.allowAdd),
            error: '允许新增只能填写是或否',
          }),
        );
      }
      if (item.allowEdit) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.allowEdit),
            error: '允许编辑只能填写是或否',
          }),
        );
      }
      if (item.allowSelect) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.allowSelect),
            error: '允许选择只能填写是或否',
          }),
        );
      }
      allErrors.push(...errors);
    });
    const attrHandler = excel.handlers.find((item) => item.sheet.name == '表单特性');
    const groups = new t.List(
      attrHandler?.sheet.data
        .map((item, index) => {
          return {
            index: index,
            data: item,
          };
        })
        .filter((item) => item.data.formCode) ?? [],
    ).GroupBy((item) => item.data.formCode);
    for (const group in groups) {
      const attrs = groups[group];
      const propGroup = new t.List(attrs).GroupBy((item) => item.data.propCode);
      for (const key in propGroup) {
        const props = propGroup[key];
        const errors =
          attrHandler?.assert(
            props.map((item) => item.index),
            [{ res: props.length > 1, error: `${key} 表单下存在多个相同属性的特性！` }],
          ) ?? [];
        allErrors.push(...errors);
      }
    }
    attrHandler?.sheet.data.forEach((item, index) => {
      let hasForm = this.sheet.data.find((dir) => dir.code == item.formCode);
      let hasProp = excel.context.properties[item.propCode];
      let errors = attrHandler?.assert(index, [
        { res: !item.formCode, error: '表单代码未填写' },
        { res: !item.name, error: '特性名称未填写' },
        { res: !item.code, error: '特性代码未填写' },
        { res: !item.propCode, error: '关联属性代码未填写' },
        { res: !hasForm, error: `未找到表单代码：${item.formCode}` },
        { res: !hasProp, error: `未获取到关联属性代码：${item.propCode}` },
      ]);
      if (item.readOnly) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.readOnly),
            error: '只读属性只能填写是或否',
          }),
        );
      }
      if (item.isRequired) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.isRequired),
            error: '必填属性只能填写是或否',
          }),
        );
      }
      if (item.hideField) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.hideField),
            error: '必填属性只能填写是或否',
          }),
        );
      }
      if (item.visible) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.visible),
            error: '默认显示列只能填写是或否',
          }),
        );
      }
      if (item.showToRemark) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.showToRemark),
            error: '展示至摘要只能填写是或否',
          }),
        );
      }
      if (item.species) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.species),
            error: '显示到类目树只能填写是或否',
          }),
        );
      }
      if (item.fixed) {
        allErrors.push(
          ...this.singleAssert(index, {
            res: !bool.includes(item.fixed),
            error: '固定列只能填写是或否',
          }),
        );
      }
      allErrors.push(...errors);
    });
    return allErrors;
  }
  private setFormDefault(form: t.Form) {
    form.options = form.options ?? { itemWidth: 300 };
    if (form.allowAdd) {
      form.options.allowAdd = form.allowAdd == '是';
    }
    if (form.allowEdit) {
      form.options.allowEdit = form.allowEdit == '是';
    }
    if (form.allowSelect) {
      form.options.allowSelect = form.allowSelect == '是';
    }
    delete form.allowAdd;
    delete form.allowEdit;
    delete form.allowSelect;
  }
  private setAttrDefault(attr: t.Attribute) {
    attr.options = attr.options ?? {};
    if (attr.readOnly) {
      attr.options.readOnly = attr.readOnly == '是';
    }
    if (attr.isRequired) {
      attr.options.isRequired = attr.isRequired == '是';
    }
    if (attr.hideField) {
      attr.options.hideField = attr.hideField == '是';
    }
    if (attr.visible) {
      attr.options.visible = attr.visible == '是';
    }
    if (attr.showToRemark) {
      attr.options.showToRemark = attr.showToRemark == '是';
    }
    if (attr.species) {
      attr.options.species = attr.species == '是';
    }
    if (attr.fixed) {
      attr.options.fixed = attr.fixed == '是';
    }
    delete attr.readOnly;
    delete attr.isRequired;
    delete attr.hideField;
    delete attr.visible;
    delete attr.showToRemark;
    delete attr.species;
    delete attr.fixed;
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
      const dir = excel.context.directories[row.directoryCode];
      row.directoryId = dir.meta.id;
      const old = dir.forms[row.code];
      if (old) {
        t.assignment(old.meta, row);
      }
      this.setFormDefault(row);
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
        let prop = excel.context.properties[newAttr.propCode]!;
        if (!newAttr.code) {
          newAttr.code = prop.code;
        }
        newAttr.property = prop;
        newAttr.propId = prop.id;
        this.setAttrDefault(newAttr);
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
