import { model } from '@/ts/base';
import { Directory } from './configs/base/directory';
import { Form } from './configs/base/form';
import { Species } from './configs/species/species';
import { SpeciesItem } from './configs/species/speciesitem';
import { Property } from './configs/store/property';
import { Attribute } from './configs/base/attribute';

export enum SheetName {
  Directory = '目录',
  Dict = '字典定义',
  DictItem = '字典项定义',
  Species = '分类定义',
  SpeciesItem = '分类项定义',
  Property = '属性定义',
  Form = '表单定义',
  FormAttr = '表单特性',
}

/**
 * 导入上下文
 */
export class Context {
  directoryCodeMap: Map<string, Directory> = new Map();
  speciesCodeMap: Map<string, Species> = new Map();
  speciesItemCodeMap: Map<String, Map<String, SpeciesItem>> = new Map();
  propertyMap: Map<String, Property> = new Map();
  formCodeMap: Map<String, Form> = new Map();
  formAttrCodeMap: Map<String, Map<String, Attribute>> = new Map();
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
 * 请求
 */
export interface RequestIndex {
  rowNumber: number;
  request: model.ReqestType;
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
export interface DataHandler {
  initialize?: (totalRows: number) => void;
  onItemCompleted?: () => void;
  onReadError?: (errors: ErrorMessage[]) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

/**
 * 元字段
 */
export interface MetaColumn {
  title: string;
  dataIndex: string;
  valueType: string;
  hide?: boolean;
}

/**
 * 读取 Excel Sheet 配置
 */
export interface ReadConfig<T, C, S extends SheetConfig<T>> {
  sheetConfig: S;
  errors: ErrorMessage[];

  initContext?(context: C): Promise<void>;
  pushError(index: number, error: string): void;
  checkData(context?: C): ErrorMessage[];
  operating(context: C, onItemCompleted: () => void): Promise<void>;
  completed?(sheets: ReadConfig<any, any, SheetConfig<any>>[], context: C): void;
}

/**
 * 读取 Excel Sheet 配置默认实现
 */
export abstract class ReadConfigImpl<T, C, S extends SheetConfig<T>>
  implements ReadConfig<T, C, S>
{
  sheetConfig: S;
  errors: ErrorMessage[];

  constructor(sheetConfig: S) {
    this.sheetConfig = sheetConfig;
    this.errors = [];
  }

  pushError(index: number, error: string): void {
    this.errors.push({
      sheetName: this.sheetConfig.sheetName,
      row: this.sheetConfig.headerRows + 1 + index,
      message: error,
    });
  }

  initContext?(context: C): Promise<void>;
  abstract checkData(context: C): ErrorMessage[];
  abstract operating(context: C, onItemCompleted: () => void): Promise<void>;
  completed?(sheets: ReadConfig<any, any, SheetConfig<any>>[], context: C): void;
}
