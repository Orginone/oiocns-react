import { AttributeModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { assignment, batchRequests } from '../..';
import {
  Context,
  ReadConfigImpl,
  RequestIndex,
  SheetConfigImpl,
  SheetName,
} from '../../types';

export interface Attribute extends AttributeModel {
  directoryId: string;
  formCode: string;
  propInfo: string;
}

export class AttrSheetConfig extends SheetConfigImpl<Attribute> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.FormAttr, 1, [
      { title: '表单代码', dataIndex: 'formCode', valueType: '描述型' },
      { title: '特性名称', dataIndex: 'name', valueType: '描述型' },
      { title: '特性代码', dataIndex: 'code', valueType: '描述型' },
      { title: '关联属性代码/id', dataIndex: 'propInfo', valueType: '描述型' },
      { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '表单主键', dataIndex: 'formId', valueType: '描述型', hide: true },
      { title: '关联属性主键', dataIndex: 'propId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class AttrReadConfig extends ReadConfigImpl<Attribute, Context, AttrSheetConfig> {
  /**
   * 初始化
   * @param context 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheetConfig.data) {
      if (c.formAttrCodeMap.has(item.formCode)) {
        let attrCodeMap = c.formAttrCodeMap.get(item.formCode)!;
        if (attrCodeMap.has(item.code)) {
          let old = attrCodeMap.get(item.code)!;
          assignment(old, item);
        }
        attrCodeMap.set(item.code, item);
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
      if (!item.formCode || !item.name || !item.code || !item.propInfo) {
        this.pushError(index, `存在未填写的表单代码、特性名称、特性代码、关联属性代码！`);
      }
      if (!context.formCodeMap.has(item.formCode)) {
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
   * @param context 上下文
   */
  async operating(context: Context, onItemCompleted: () => void): Promise<void> {
    let requests: RequestIndex[] = [];
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let row = this.sheetConfig.data[index];
      row.formId = context.formCodeMap.get(row.formCode)!.id;
      row.directoryId = context.formCodeMap.get(row.formCode)!.directoryId;
      row.propId = context.propertyMap.get(row.propInfo)!.id;
      requests.push({
        rowNumber: index,
        request: {
          module: 'thing',
          action: row.id ? 'UpdateAttribute' : 'CreateAttribute',
          params: row,
        },
      });
    }
    while (requests.length > 0) {
      await this.requests(requests.splice(0, 100), context, onItemCompleted);
    }
  }
  /**
   * @param requests 批量请求
   */
  private async requests(
    requests: RequestIndex[],
    _context: Context,
    onItemCompleted: () => void,
  ) {
    await batchRequests(requests, (request, result) => {
      if (result.success) {
        assignment(result.data, this.sheetConfig.data[request.rowNumber]);
      } else {
        this.pushError(request.rowNumber, result.msg);
      }
      onItemCompleted();
    });
  }
}
