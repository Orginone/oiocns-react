import { SpeciesItemModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { assignment, batchRequests, partition } from '../..';
import {
  Context,
  ErrorMessage,
  ReadConfigImpl,
  RequestIndex,
  SheetConfigImpl,
  SheetName,
} from '../../types';

export interface SpeciesItem extends SpeciesItemModel {
  speciesCode: string;
  parentInfo?: string;
}

export class DictItemSheetConfig extends SheetConfigImpl<SpeciesItem> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.DictItem, 1, [
      { title: '字典代码', dataIndex: 'speciesCode', valueType: '描述型' },
      { title: '字典项名称', dataIndex: 'name', valueType: '描述型' },
      { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '字典主键', dataIndex: 'speciesId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class ClassifyItemSheetConfig extends SheetConfigImpl<SpeciesItem> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.SpeciesItem, 1, [
      { title: '分类代码', dataIndex: 'speciesCode', valueType: '描述型' },
      { title: '上级分类项代码', dataIndex: 'parentInfo', valueType: '描述型' },
      { title: '分类项名称', dataIndex: 'name', valueType: '描述型' },
      { title: '分类项代码', dataIndex: 'code', valueType: '描述型' },
      { title: '附加信息', dataIndex: 'info', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述型', hide: true },
      { title: '分类主键', dataIndex: 'speciesId', valueType: '描述型', hide: true },
      { title: '上级分类项主键', dataIndex: 'parentId', valueType: '描述型', hide: true },
    ]);
    this.directory = directory;
  }
}

export class DictItemReadConfig extends ReadConfigImpl<
  SpeciesItem,
  Context,
  DictItemSheetConfig
> {
  async initContext(c: Context): Promise<void> {
    for (let item of this.sheetConfig.data) {
      if (c.speciesItemCodeMap.has(item.speciesCode)) {
        let itemCodeMap = c.speciesItemCodeMap.get(item.speciesCode)!;
        if (itemCodeMap.has(item.info)) {
          let old = itemCodeMap.get(item.info)!;
          assignment(old, item);
        }
        itemCodeMap.set(item.code, item);
      }
    }
  }
  /**
   * 数据校验
   * @param context 上下文
   * @returns 错误信息
   */
  checkData(context: Context): ErrorMessage[] {
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
      if (!item.speciesCode || !item.name || !item.info) {
        this.pushError(index, `存在未填写的字典代码、字典项名称、附加信息！`);
      }
      if (!context.speciesCodeMap.has(item.speciesCode)) {
        this.pushError(index, `未找到字典代码：${item.speciesCode}！`);
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
      row.speciesId = context.speciesCodeMap.get(row.speciesCode)!.id;
      requests.push({
        rowNumber: index,
        request: {
          module: 'thing',
          action: row.id ? 'UpdateSpeciesItem' : 'CreateSpeciesItem',
          params: row,
        },
      });
    }
    for (let arr of partition(requests, 100)) {
      await this.requests(arr, context, onItemCompleted);
    }
  }
  /**
   *
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

export class ClassifyItemReadConfig extends ReadConfigImpl<
  SpeciesItem,
  Context,
  DictItemSheetConfig
> {
  /**
   * 初始化数据
   * @param context 上下文
   */
  async initContext(context: Context): Promise<void> {
    let speciesItemCodeMap = context.speciesItemCodeMap;
    for (let item of this.sheetConfig.data) {
      if (!speciesItemCodeMap.has(item.speciesCode)) {
        speciesItemCodeMap.set(item.speciesCode, new Map());
      }
      let itemCodeMap = speciesItemCodeMap.get(item.speciesCode)!;
      if (itemCodeMap.has(item.info)) {
        let old = itemCodeMap.get(item.info)!;
        assignment(old, item);
      }
      itemCodeMap.set(item.info, item);
    }
  }
  /**
   * 数据
   * @param context 上下文
   * @returns
   */
  checkData(context: Context): ErrorMessage[] {
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
      if (!item.speciesCode || !item.name || !item.info) {
        this.pushError(index, `存在未填写的分类代码、分类项名称、附加信息！`);
      }
      if (!context.speciesCodeMap.has(item.speciesCode)) {
        this.pushError(index, `未找到分类代码：${item.speciesCode}！`);
      }
      if (item.parentInfo) {
        if (!context.speciesItemCodeMap.get(item.speciesCode)?.get(item.parentInfo)) {
          this.pushError(index, `未找到上级分类项代码：${item.parentInfo}！`);
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
    let requests: RequestIndex[] = [];
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let row = this.sheetConfig.data[index];
      row.speciesId = context.speciesCodeMap.get(row.speciesCode)!.id;
      if (row.parentInfo) {
        row.parentId = context.speciesItemCodeMap
          .get(row.speciesCode)!
          .get(row.parentInfo)!.id;
      }
      requests.push({
        rowNumber: index,
        request: {
          module: 'thing',
          action: row.id ? 'UpdateSpeciesItem' : 'CreateSpeciesItem',
          params: row,
        },
      });
    }
    for (let arr of partition(requests, 500)) {
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
        let data = result.data;
        assignment(data, this.sheetConfig.data[request.rowNumber]);
        context.speciesItemCodeMap.get(data.speciesCode)?.set(data.code, data);
      } else {
        this.pushError(request.rowNumber, result.msg);
      }
      onItemCompleted();
    });
  }
}
