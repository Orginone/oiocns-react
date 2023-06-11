import { XAttribute, XDictItem, XProperty } from '@/ts/base/schema';
import { ISpeciesItem, IDict, IForm } from '@/ts/core';

export enum SheetName {
  Property = '属性定义',
  Dict = '字典定义',
  DictItem = '字典项定义',
  Form = '表单定义',
  Attr = '特性定义',
}

/**
 * 导入上下文
 */
export interface Context {
  speciesIndex: { [key: string]: ISpeciesItem };
  propIndex: { [key: string]: { [key: string]: XProperty } };
  dictIndex: { [key: string]: IDict };
  dictItemIndex: { [key: string]: { [key: string]: XDictItem } };
  formIndex: { [key: string]: IForm };
  unfoldPropIndex: { [key: string]: XProperty };
  attrIndex: { [key: string]: { [key: string]: XAttribute } };
}

/**
 * 错误信息
 */
export interface ErrorMessage {
  sheetName: string;
  row: number;
  message: string;
}

/**
 * Sheet 表
 */
export interface SheetConfig<T> {
  sheetName: string;
  headerRows: number;
  metaColumns: MetaColumn[];
  data: T[];
}

/**
 * Sheet 表抽象的默认实现
 */
export class SheetConfigImpl<T> implements SheetConfig<T> {
  sheetName: string;
  headerRows: number;
  metaColumns: MetaColumn[];
  data: T[];

  constructor(sheetName: string, headersRows: number, metaColumns: MetaColumn[]) {
    this.sheetName = sheetName;
    this.headerRows = headersRows;
    this.metaColumns = metaColumns;
    this.data = [];
  }
}

/**
 * 读取 Excel 配置
 */
export interface ExcelConfig<C> {
  progress: number;
  context: C;
  initialize: () => void;
  onProgress: (progress: number) => void;
  addProgress: (partProgress: number) => void;
  onReadError: (errors: ErrorMessage[]) => void;
  onError: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 元字段
 */
export interface MetaColumn {
  name: string;
  code: string;
  type: string;
  options?: string[];
}

/**
 * 读取 Excel Sheet 配置
 */
export interface ReadConfig<T, C, S extends SheetConfig<T>, E extends ExcelConfig<C>> {
  sheetConfig: S;
  errors: ErrorMessage[];
  excelConfig: E;

  initContext?(): Promise<void>;
  checkData?(data: T[]): Promise<void>;
  pushError(index: number, error: string): void;
  operatingItem(index: number, row: T): Promise<void>;
  completed?(sheets: ReadConfig<any, any, SheetConfig<any>, E>[]): void;
}

/**
 * 读取 Excel Sheet 配置默认实现
 */
export abstract class ReadConfigImpl<
  T,
  C,
  S extends SheetConfig<T>,
  E extends ExcelConfig<C>,
> implements ReadConfig<T, C, S, E>
{
  sheetConfig: S;
  errors: ErrorMessage[];
  excelConfig: E;

  constructor(sheetConfig: S, excelConfig: E) {
    this.sheetConfig = sheetConfig;
    this.errors = [];
    this.excelConfig = excelConfig;
  }

  pushError(index: number, error: string): void {
    this.errors.push({
      sheetName: this.sheetConfig.sheetName,
      row: this.sheetConfig.headerRows + 1 + index,
      message: error,
    });
  }

  initContext?(): Promise<void>;
  checkData?(data: T[]): Promise<void>;
  abstract operatingItem(index: number, row: T): Promise<void>;
  completed?(sheets: ReadConfig<any, any, SheetConfig<any>, E>[]): void;
}
