import { XAttribute, XSpeciesItem } from '@/ts/base/schema';
import { IDirectory, IForm, IProperty, ISpecies } from '@/ts/core';
import { WorkBook } from 'xlsx';

export enum SheetName {
  Directory = '目录',
  Dict = '字典定义',
  DictItem = '字典项定义',
  Species = '分类项',
  SpeciesItem = '分类子项定义',
  Property = '属性定义',
  Form = '实体定义',
  FormAttr = '实体特性',
  Work = '事项定义',
  WorkAttr = '事项特性',
}

/**
 * 导入上下文
 */
export class Context {
  directoryIndex: { [directoryName: string]: IDirectory } = {};
  dictIndex: { [directoryId: string]: { [dictName: string]: ISpecies } } = {};
  dictNameIndex: { [dictName: string]: ISpecies } = {};
  dictCodeIndex: { [dictCode: string]: ISpecies } = {};
  dictItemIndex: { [speciesId: string]: { [name: string]: XSpeciesItem } } = {};
  dictItemCodeIndex: { [speciesId: string]: { [code: string]: XSpeciesItem } } = {};
  speciesIndex: { [directoryId: string]: { [speciesName: string]: ISpecies } } = {};
  speciesNameIndex: { [speciesName: string]: ISpecies } = {};
  speciesCodeIndex: { [speciesCode: string]: ISpecies } = {};
  speciesItemIndex: { [speciesId: string]: { [name: string]: XSpeciesItem } } = {};
  speciesItemCodeIndex: { [speciesId: string]: { [code: string]: XSpeciesItem } } = {};
  propIndex: { [directoryId: string]: { [propName: string]: IProperty } } = {};
  propCodeIndex: { [propCode: string]: IProperty } = {};
  entityFormIndex: { [directoryId: string]: { [formName: string]: IForm } } = {};
  entityFormNameIndex: { [formName: string]: IForm } = {};
  workFormIndex: { [directoryId: string]: { [formName: string]: IForm } } = {};
  workFormNameIndex: { [formName: string]: IForm } = {};
  formAttrIndex: { [formId: string]: { [attrCode: string]: XAttribute } } = {};
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
  context: C;
  initialize?: (totalRows: number, workbook?: WorkBook) => void;
  onItemCompleted?: () => void;
  onReadError?: (errors: ErrorMessage[]) => void;
  onError?: (error: string) => void;
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

  checkData?(data: T[]): Promise<void>;
  pushError(index: number, error: string): void;
  operatingItem(row: T, index?: number): Promise<void>;
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

  get context(): C {
    return this.excelConfig.context;
  }

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

  checkData?(data: T[]): Promise<void>;
  abstract operatingItem(row: T, index?: number): Promise<void>;
  completed?(sheets: ReadConfig<any, any, SheetConfig<any>, E>[]): void;
}
