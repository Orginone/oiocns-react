import { XProperty } from '@/ts/base/schema';
import { IDirectory, orgAuth } from '@/ts/core';
import { assignment } from '../..';
import { Context, ReadConfigImpl, SheetConfigImpl, SheetName } from '../../types';

export interface Property extends XProperty {
  directoryCode: string;
  speciesCode: string;
}

export class PropSheetConfig extends SheetConfigImpl<Property> {
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

const types = [
  '数值型',
  '描述型',
  '选择型',
  '分类型',
  '附件型',
  '日期型',
  '时间型',
  '用户型',
];

export class PropReadConfig extends ReadConfigImpl<Property, Context, PropSheetConfig> {
  /**
   * 数据初始化
   * @param context 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheetConfig.data) {
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
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
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
    let insertProperties: { index: number; row: Property }[] = [];
    let replaceProperties: { index: number; row: Property }[] = [];
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let row = this.sheetConfig.data[index];
      row.directoryId = context.directoryMap.get(row.directoryCode)!.id;
      if (row.speciesCode) {
        row.speciesId = context.speciesMap.get(row.speciesCode)!.id;
      }
      if (row.id) {
        replaceProperties.push({ index, row: row });
      } else {
        row.code = "TsnowId()";
        insertProperties.push({ index, row: row });
      }
      onItemCompleted();
    }
    if (insertProperties.length > 0) {
      let insertRes = await this.sheetConfig.directory.resource.propertyColl.insertMany(
        insertProperties.map((item) => item.row),
      );
      for (let index = 0; index < insertRes.length; index++) {
        const newProperty = insertRes[index] as Property;
        this.sheetConfig.data[insertProperties[index].index] = newProperty;
        context.propertyMap.set(newProperty.code, newProperty);
      }
    }
    if (replaceProperties.length > 0) {
      let replaceRes = await this.sheetConfig.directory.resource.propertyColl.replaceMany(
        replaceProperties.map((item) => item.row),
      );
      for (let index = 0; index < replaceRes.length; index++) {
        const newProperty = replaceRes[index] as Property;
        this.sheetConfig.data[replaceProperties[index].index] = newProperty;
        context.propertyMap.set(newProperty.code, newProperty);
      }
    }
  }
}
