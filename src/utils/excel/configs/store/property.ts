import { XProperty } from '@/ts/base/schema';
import { IDirectory, ValueType } from '@/ts/core';
import { assignment } from '../..';
import { Context, SheetHandler, Sheet, SheetName } from '../../types';

export interface Property extends XProperty {
  directoryCode: string;
  speciesCode: string;
}

export class PropSheet extends Sheet<Property> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Property, 1, [
      { title: '目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
      { title: '属性名称', dataIndex: 'name', valueType: '描述型' },
      { title: '属性代码', dataIndex: 'code', valueType: '描述型' },
      { title: '属性类型', dataIndex: 'valueType', valueType: '选择型' },
      { title: '单位', dataIndex: 'unit', valueType: '描述型' },
      { title: '（字典/分类）代码/ID', dataIndex: 'speciesCode', valueType: '选择型' },
      { title: '属性定义', dataIndex: 'remark', valueType: '描述型' },
      { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '目录主键', dataIndex: 'directoryId', valueType: '描述型', hide: true },
      {
        title: '(字典/分类) ID',
        dataIndex: 'speciesId',
        valueType: '描述型',
        hide: true,
      },
    ]);
    this.directory = directory;
  }
}

export class PropHandler extends SheetHandler<Property, Context, PropSheet> {
  /**
   * 数据初始化
   * @param context 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheet.data) {
      if (c.propertyMap.has(item.info)) {
        let old = c.propertyMap.get(item.info)!;
        c.propertyMap.set(item.info, { ...old, ...item });
        assignment(old, item);
      } else {
        c.propertyMap.set(item.info, item);
      }
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    const types: string[] = Object.entries(ValueType).map((value) => value[1]);
    for (let index = 0; index < this.sheet.data.length; index++) {
      let item = this.sheet.data[index];
      if (!item.directoryCode || !item.name || !item.valueType || !item.info) {
        this.pushError(index, '存在未填写的目录代码、属性名称、属性类型、附加信息！');
      }
      if (!context.directoryMap.has(item.directoryCode)) {
        this.pushError(index, `未获取到目录代码：${item.directoryCode}`);
      }
      if (types.indexOf(item.valueType) == -1) {
        this.pushError(index, `属性类型只能在[${types.join('，')}]中选择！`);
      }
      if (item.valueType == '选择型') {
        if (item.speciesCode) {
          if (!context.speciesMap.has(item.speciesCode)) {
            this.pushError(index, `未获取到（字典/分类）代码：${item.speciesCode}！`);
            continue;
          }
        } else {
          this.pushError(index, '当属性类型为选择型时，必须填写（字典/分类）代码！');
        }
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
      row.directoryId = context.directoryMap.get(row.directoryCode)!.id;
      if (row.speciesCode) {
        row.speciesId = context.speciesMap.get(row.speciesCode)!.id;
      }
      if (!row.id) {
        row.code = 'TsnowId()';
      }
      onItemCompleted();
    }
    (await this.sheet.directory.resource.propertyColl.replaceMany(data))
      .map((i) => i as Property)
      .forEach((item, index) => {
        data[index] = item;
        context.propertyMap.set(item.code, item);
      });
  }
}
