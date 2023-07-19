import { List } from '@/ts/base';
import { SpeciesItemModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { assignment, batchRequests } from '../..';
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
  index: number;
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
      { title: '分类项代码', dataIndex: 'info', valueType: '描述型' },
      { title: '分类项代码（生成）', dataIndex: 'code', valueType: '描述型' },
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
    while (requests.length > 0) {
      await this.requests(requests.splice(0, 100), context, onItemCompleted);
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
    this.sheetConfig.data.forEach((item, index) => (item.index = index));
    let groups = new List(this.sheetConfig.data).GroupBy((item) => item.speciesCode);
    for (let key of Object.keys(groups)) {
      let tree = new Tree<SpeciesItem>(groups[key], 'info', 'parentInfo');
      await this.recursion(tree.root, context, onItemCompleted);
    }
  }
  /**
   * 根据层次递归插入
   * @param root 根节点
   */
  async recursion(
    root: Node<SpeciesItem>,
    context: Context,
    onItemCompleted: () => void,
  ) {
    let requests = [];
    for (let node of root.children) {
      let row = node.data;
      row.speciesId = context.speciesCodeMap.get(row.speciesCode)!.id;
      if (row.parentInfo) {
        row.parentId = context.speciesItemCodeMap
          .get(row.speciesCode)!
          .get(row.parentInfo)!.id;
      }
      requests.push({
        rowNumber: row.index,
        request: {
          module: 'thing',
          action: row.id ? 'UpdateSpeciesItem' : 'CreateSpeciesItem',
          params: row,
        },
      });
    }
    await this.requests(requests, context, onItemCompleted);
    for (let item of root.children) {
      await this.recursion(item, context, onItemCompleted);
    }
  }
  /**
   * 批量请求
   * @param requests 请求
   * @param context 上下文
   * @param onItemCompleted 回调
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

/**
 * 节点
 */ class Node<T extends { [key: string]: any }> {
  readonly id: string;
  readonly parentId?: string;
  readonly children: Node<T>[];
  public data: T;

  constructor(id: string, data: T, parentId?: string) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.children = [];
  }

  public addChild(node: Node<T>) {
    this.children.push(node);
  }
}

/**
 * 树
 */
export class Tree<T extends { [key: string]: any }> {
  /**
   * root 顶级虚拟节点,
   * nodeMap 存储当前节点，
   * freeMap 存储游离的节点，
   * 处理先进来的子节点找不到父类的问题
   */
  readonly root: Node<T>;
  readonly nodeMap: Map<string, Node<T>>;
  private readonly freeMap: Map<string, Node<T>>;

  constructor(nodeData: T[], id: string, parentId: string) {
    this.root = new Node<T>('root', {} as T, undefined);
    this.nodeMap = new Map<string, Node<T>>();
    this.freeMap = new Map<string, Node<T>>();
    nodeData.forEach((item) => this.addNode(item[id], item, item[parentId]));
    this.clearFree();
  }

  /**
   * 加入节点
   * @param id 节点 ID
   * @param parentId 父节点 ID
   * @param data 节点数据
   */
  addNode(id: string, data: T, parentId?: string) {
    if (id == null) return;
    if (this.nodeMap.has(id)) return;
    let node: Node<T> = new Node<T>(id, data, parentId);
    if (!parentId) this.root.addChild(node);
    else {
      let parentNode: Node<T> | undefined = this.nodeMap.get(parentId);
      if (!parentNode) {
        this.freeMap.set(id, node);
      } else {
        parentNode.addChild(node);
      }
    }
    this.nodeMap.set(id, node);
  }

  /**
   * 清空游离的节点
   */
  clearFree() {
    if (this.freeMap.size !== 0) {
      let hasParent: string[] = [];
      this.freeMap.forEach((value, key) => {
        let freeNodeParentId: string = value.parentId!;
        if (this.nodeMap.has(freeNodeParentId)) {
          let parentNode: Node<T> = this.nodeMap.get(freeNodeParentId)!;
          parentNode.addChild(value);
          hasParent.push(key);
        }
      });
      hasParent.forEach((nodeKey) => this.freeMap.delete(nodeKey));
    }
  }
}
