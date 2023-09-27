import { XAttribute } from '@/ts/base/schema';
import { IDirectory, orgAuth } from '@/ts/core';
import { Context, SheetHandler, Sheet, SheetName } from '../../types';
import { assignment } from '../..';
import { List } from '@/ts/base';

export interface Attribute extends XAttribute {
  directoryId: string;
  formCode: string;
  propInfo: string;
  info?: string;
  index?: number;
}

export class AttrSheet extends Sheet<Attribute> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.FormAttr, 1, [
      { title: '表单代码', dataIndex: 'formCode', valueType: '描述型' },
      { title: '特性名称', dataIndex: 'name', valueType: '描述型' },
      { title: '特性代码', dataIndex: 'code', valueType: '描述型' },
      { title: '关联属性代码/id', dataIndex: 'propInfo', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '表单主键', dataIndex: 'formId', valueType: '描述型', hide: true },
      { title: '关联属性主键', dataIndex: 'propId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class AttrHandler extends SheetHandler<Attribute, Context, AttrSheet> {
  /**
   * 初始化
   * @param context 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheet.data) {
      if (c.formAttrMap.has(item.formCode)) {
        let attrMap = c.formAttrMap.get(item.formCode)!;
        if (attrMap.has(item.propInfo)) {
          let old = attrMap.get(item.propInfo)!;
          assignment(old, item);
          item.code = old.code;
        }
        attrMap.set(item.code, item);
      }
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheet.data.length; index++) {
      let item = this.sheet.data[index];
      if (!item.formCode || !item.name || !item.code || !item.propInfo) {
        this.pushError(index, `存在未填写的表单代码、特性名称、特性代码、关联属性代码！`);
      }
      if (!context.formMap.has(item.formCode)) {
        this.pushError(index, `未获取到表单代码：${item.formCode}`);
      }
      if (!context.propertyMap.has(item.propInfo)) {
        this.pushError(index, `未获取到关联属性代码：${item.propInfo}`);
      }
    }
    return this.errors;
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param _context 上下文
   */
  async operating(context: Context, onItemCompleted: () => void): Promise<void> {
    this.sheet.data.forEach((item, index) => (item.index = index));
    let groups = new List(this.sheet.data).GroupBy((item) => item.formCode);
    for (const key in groups) {
      if (context.formMap.has(key)) {
        const form = context.formMap.get(key)!;
        const attrs = groups[key];
        attrs.forEach((attr) => {
          if (!attr.id) {
            attr.id = 'snowId()';
            attr.authId = orgAuth.SuperAuthId;
            attr.code = attr.code ?? 'SsnowId()';
          }
          attr.formId = form.id;
          let prop = context.propertyMap.get(attr.propInfo);
          if (prop) {
            attr.code = prop.code;
            attr.property = prop;
            attr.propId = prop.id;
          }
          onItemCompleted();
        });
        form.attributes = attrs;
        let result = await this.sheet.directory.resource.formColl.replace(form);
        result?.attributes.forEach((item) => {
          let attr = item as Attribute;
          this.sheet.data[attr.index!] = item as Attribute;
        });
      }
    }
  }
}
