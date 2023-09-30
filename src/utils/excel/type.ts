import { schema, model } from '@/ts/base';
export * as XLSX from 'xlsx';

/**
 * 上下文
 */
export type Context = {
  // 目录编码
  [key: string]: DirData;
};

/**
 * 目录数据
 */
export type DirData = {
  // 元数据
  meta: Directory;
  // 目录下的字典/分类
  species: { [key: string]: SpeciesData };
  // 目录下的属性
  props: { [key: string]: Property };
  // 目录下的表单
  forms: { [key: string]: FormData };
};

// 字典/分类数据
export type SpeciesData = {
  // 元数据
  meta: Species;
  // 字典/分类下的项
  items: { [key: string]: SpeciesItem };
};

// 表单数据
export type FormData = {
  // 元数据
  meta: Form;
  // 表单下的特性
  attrs: { [key: string]: Attribute };
};

/**
 * 错误信息
 */
export interface Error {
  name: string;
  row: number;
  message: string;
}

// 目录
export interface Directory extends schema.XDirectory {
  directoryCode?: string;
}

// 属性
export interface Property extends schema.XProperty {
  directoryCode: string;
  speciesCode?: string;
}

// 表单
export interface Form extends schema.XForm {
  directoryCode: string;
}

// 特性
export interface Attribute extends schema.XAttribute {
  formCode: string;
  propCode: string;
}

// 分类
export interface Species extends schema.XSpecies {
  directoryCode: string;
}

// 分类项
export interface SpeciesItem extends schema.XSpeciesItem {
  speciesCode: string;
  parentInfo?: string;
}

/**
 * 读取 Excel 配置
 */
export interface DataHandler {
  initialize?: (totalRows: number) => void;
  onItemCompleted?: (count?: number) => void;
  onReadError?: (errors: Error[]) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 读取 Excel Sheet 配置
 */
export interface ISheetHandler<S extends model.Sheet<any>> {
  sheet: S;

  assert(index: number, asserts: { res: boolean; error: string }[]): Error[]
  checkData(excel: IExcel): Error[];
  operating(excel: IExcel, onItemCompleted: () => void): Promise<void>;
  completed?(excel: IExcel): void;
}

/**
 * 文件
 */
export interface IExcel {
  // 表格处理
  handlers: ISheetHandler<model.Sheet<any>>[];
  // 回调
  dataHandler?: DataHandler;
  // 上下文
  context: Context;
  // 加入处理
  appendHandler(sheet: ISheetHandler<any>): void;
  // 获取处理
  getHandler(name: string): ISheetHandler<model.Sheet<any>> | undefined;
  // 开始处理
  handling(): Promise<void>;
  // 搜索分类
  searchSpecies(code?: string): SpeciesData | undefined;
  // 搜索属性
  searchProps(code?: string): Property | undefined;
}

// 基本模型
export { schema, model, List } from '@/ts/base';

// 文件模型
export { orgAuth, ValueType } from '@/ts/core';

// 类型
export type { IDirectory, XCollection } from '@/ts/core';

// 文件模型
export { assignment } from '../index';
