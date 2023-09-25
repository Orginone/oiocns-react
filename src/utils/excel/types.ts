import { model } from '@/ts/base';
import { Attribute } from './configs/base/attribute';
import { Directory } from './configs/base/directory';
import { Form } from './configs/base/form';
import { Species } from './configs/species/species';
import { SpeciesItem } from './configs/species/speciesitem';
import { Property } from './configs/store/property';

export enum SheetName {
  'Directory' = '目录',
  'Dict' = '字典定义',
  'DictItem' = '字典项定义',
  'Species' = '分类定义',
  'SpeciesItem' = '分类项定义',
  'Property' = '属性定义',
  'Form' = '表单定义',
  'FormAttr' = '表单特性',
}

/**
 * 导入上下文
 */
export class Context {
  directoryMap: Map<string, Directory> = new Map();
  speciesMap: Map<string, Species> = new Map();
  speciesItemMap: Map<String, Map<String, SpeciesItem>> = new Map();
  propertyMap: Map<String, Property> = new Map();
  formMap: Map<String, Form> = new Map();
  formAttrMap: Map<String, Map<String, Attribute>> = new Map();
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
 * Sheet 表抽象的默认实现
 */
export class Sheet<T> implements model.Sheet<T> {
  name: string;
  headers: number;
  columns: model.Column[];
  data: T[];

  constructor(sheetName: string, headersRows: number, metaColumns: model.Column[]) {
    this.name = sheetName;
    this.headers = headersRows;
    this.columns = metaColumns;
    this.data = [];
  }
}

/**
 * 读取 Excel 配置
 */
export interface DataHandler {
  initialize?: (totalRows: number) => void;
  onItemCompleted?: () => void;
  onReadError?: (errors: ErrorMessage[]) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 读取 Excel Sheet 配置
 */
export interface ISheetHandler<T, C, S extends model.Sheet<T>> {
  sheet: S;
  errors: ErrorMessage[];

  initContext?(context: C): Promise<void>;
  pushError(index: number, error: string): void;
  checkData(context?: C): ErrorMessage[];
  operating(context: C, onItemCompleted: () => void): Promise<void>;
  completed?(sheets: ISheetHandler<any, any, model.Sheet<any>>[], context: C): void;
}

/**
 * 读取 Excel Sheet 配置默认实现
 */
export abstract class SheetHandler<T, C, S extends model.Sheet<T>>
  implements ISheetHandler<T, C, S>
{
  sheet: S;
  errors: ErrorMessage[];

  constructor(sheetConfig: S) {
    this.sheet = sheetConfig;
    this.errors = [];
  }

  pushError(index: number, error: string): void {
    this.errors.push({
      sheetName: this.sheet.name,
      row: this.sheet.headers + 1 + index,
      message: error,
    });
  }

  initContext?(context: C): Promise<void>;
  abstract checkData(context: C): ErrorMessage[];
  abstract operating(context: C, onItemCompleted: () => void): Promise<void>;
  completed?(sheets: ISheetHandler<any, any, model.Sheet<any>>[], context: C): void;
}
