import { FormModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { assignment, batchRequests, partition } from '../..';
import {
  Context,
  ReadConfigImpl,
  RequestIndex,
  SheetConfigImpl,
  SheetName,
} from '../../types';

export interface Form extends FormModel {
  directoryCode: string;
}

export class FormSheetConfig extends SheetConfigImpl<Form> {
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

export class FormReadConfig extends ReadConfigImpl<Form, Context, FormSheetConfig> {
  /**
   * 初始化
   * @param c 上下文
   */
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheetConfig.data) {
      if (c.formCodeMap.has(item.code)) {
        let old = c.formCodeMap.get(item.code)!;
        assignment(old, item);
      }
      c.formCodeMap.set(item.code, item);
    }
  }
  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
      if (!item.directoryCode || !item.typeName || !item.name || !item.code) {
        this.pushError(index, `存在未填写的目录代码，表单类型、表单名称、表单代码`);
      }
      if (!context.directoryCodeMap.has(item.directoryCode)) {
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
    let requests: RequestIndex[] = [];
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let row = this.sheetConfig.data[index];
      let dir = context.directoryCodeMap.get(row.directoryCode)!;
      row.directoryId = dir.id;
      requests.push({
        rowNumber: index,
        request: {
          module: 'thing',
          action: row.id ? 'UpdateForm' : 'CreateForm',
          params: row,
        },
      });
    }
    for (let arr of partition(requests, 100)) {
      await this.requests(arr, context, onItemCompleted);
    }
  }
  /**
   * @param requests 批量请求
   */
  private async requests(
    requests: RequestIndex[],
    context: Context,
    onItemCompleted: () => void,
  ) {
    await batchRequests(requests, (request, result) => {
      if (result.success) {
        assignment(result.data, this.sheetConfig.data[request.rowNumber]);
        context.formCodeMap.set(result.data.code, result.data);
      } else {
        this.pushError(request.rowNumber, result.msg);
      }
      onItemCompleted();
    });
  }
}
