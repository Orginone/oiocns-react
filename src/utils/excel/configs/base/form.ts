import { XForm } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import { assignment } from '../..';
import { Context, SheetHandler, Sheet, SheetName } from '../../types';

export interface Form extends XForm {
  directoryCode: string;
}

export class FormSheet extends Sheet<Form> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Form, 1, [
      { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
      { title: '表单类型', dataIndex: 'typeName', valueType: '描述型' },
      { title: '表单名称', dataIndex: 'name', valueType: '描述型' },
      { title: '表单代码', dataIndex: 'code', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class FormHandler extends SheetHandler<Form, Context, FormSheet> {
  /**
   * 初始化
   * @param c 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheet.data) {
      if (c.formMap.has(item.code)) {
        let old = c.formMap.get(item.code)!;
        assignment(old, item);
      }
      c.formMap.set(item.code, item);
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheet.data.length; index++) {
      let item = this.sheet.data[index];
      if (!item.directoryCode || !item.typeName || !item.name || !item.code) {
        this.pushError(index, `存在未填写的目录代码，表单类型、表单名称、表单代码`);
      }
      if (!context.directoryMap.has(item.directoryCode)) {
        this.pushError(index, `未获取到目录代码：${item.directoryCode}`);
      }
      if (['实体配置', '事项配置'].indexOf(item.typeName) == -1) {
        this.pushError(index, `表单类型只能填写实体配置或事项配置`);
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
    const data = this.sheet.data;
    for (let index = 0; index < data.length; index++) {
      let row = data[index];
      let dir = context.directoryMap.get(row.directoryCode)!;
      row.directoryId = dir.id;
      onItemCompleted();
    }
    (await this.sheet.directory.resource.formColl.replaceMany(data))
      .map((item) => item as Form)
      .forEach((item, index) => {
        data[index] = item;
        context.formMap.set(item.code, item);
      });
  }
}
