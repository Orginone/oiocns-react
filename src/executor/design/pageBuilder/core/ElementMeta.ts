/* eslint-disable prettier/prettier */
/* prettier-ignore */
/** 不要格式化此文件，会对阅读源码造成严重影响 */

export type PrimitiveType = "string" | "number" | "boolean" | "date";
export type ComplexType = "enum" | "array" | "object" | "type";
export type DataType = PrimitiveType | ComplexType;
export type ElementType = "Element" | "Container" | 'Slot' | 'ArraySlot' | 'Template';
export enum ElementTypeName {
  Element = '元素',
  Container = '容器',
  Slot = '插槽',
  ArraySlot = '数组插槽',
  Template = '模板'
}

export interface TypeMetaBase<T extends DataType> {
  type: T;
  default?: any;
  required?: boolean;
  label?: string;
  readonly?: boolean;
  hidden?: boolean;
}

export interface PrimitiveTypeMeta<T extends PrimitiveType> extends TypeMetaBase<T> {}

export interface EnumItem<V = any> {
  label: string;
  value: V;
}

export interface EnumTypeMeta<V = any> extends TypeMetaBase<"enum"> {
  options: EnumItem<V>[];
}

export interface ArrayTypeMeta extends TypeMetaBase<"array"> {
  elementType: TypeMeta;
}

// @ts-ignore
// eslint-disable-next-line no-unused-vars
export interface ObjectTypeMeta<T = any> extends TypeMetaBase<"object"> {
  properties: Dictionary<TypeMeta>;
}

// 泛型 T 用来启用类型推导，不能去除
// @ts-ignore
// eslint-disable-next-line no-unused-vars
export interface ExistTypeMeta<T, C extends {} = Dictionary<any>>
  extends TypeMetaBase<"type"> {
  typeName: string;
  editorConfig?: C;
}

export type TypeMeta =
  | PrimitiveTypeMeta<PrimitiveType>
  | EnumTypeMeta<string | number>
  | ArrayTypeMeta
  | ObjectTypeMeta
  | ExistTypeMeta<any>;


export interface ParameterInfo<T extends TypeMeta = TypeMeta> {
  label: string;
  type: T;
}

interface SlotMetaBase<P extends Dictionary<ParameterInfo>> {
  /** 插槽的参数列表 */
  params: P;
  /** kind 组件或者组件数组 */
  default?: string | string[];
  label?: string;
}

export interface SingleSlotMeta<
  P extends Dictionary<ParameterInfo> = Dictionary<ParameterInfo>,
> extends SlotMetaBase<P> {
  single: true;
}
export interface MultipleSlotMeta<
  P extends Dictionary<ParameterInfo> = Dictionary<ParameterInfo>,
> extends SlotMetaBase<P> {
  single?: false;
}

export type SlotMeta = SingleSlotMeta | MultipleSlotMeta;

export type SlotFunction<
  S extends Dictionary<any> = Dictionary<any>,
> = (scope: S) => JSX.Element | JSX.Element[];

export interface ElementMeta {
  /** 定义属性的类型 */
  props: Dictionary<TypeMeta>;
  /** 组件中文名 */
  label: string;
  /** 元素类型 */
  type: ElementType;
  /** 元素插槽 */
  slots?: Dictionary<SlotMeta>;
  /** 模板图片 */
  photo?: string;
  /** 组件描述 */
  description?: string;
  /** 根排布 */
  layoutType?: 'scroll' | 'full';
}

/**
 * 类型体操，设计时解出一个`TypeMeta`字面量对应的数据类型
 */
export type ExtractType<T extends TypeMeta> = 
  T["type"] extends "string" ? string :
  T["type"] extends "number" ? number :
  T["type"] extends "boolean" ? boolean :
  T["type"] extends "date" ? string :
  T extends EnumTypeMeta<infer R> ? R :
  T extends ArrayTypeMeta ? ExtractType<T["elementType"]>[] :
  T extends ObjectTypeMeta<infer R> ? R extends any ? ({
    [P in keyof T["properties"]]: ExtractType<T["properties"][P]>
  }) : R : 
  T extends ExistTypeMeta<infer R> ? R :
  any;

/**
 * 类型体操，将`ParameterInfo数组`解成键值对形式
 */
export type ExtractParams<P extends Dictionary<ParameterInfo> = Dictionary<ParameterInfo>> = {
  [I in keyof P & string]: ExtractType<P[I]["type"]>;
};

export type ExtractSlot<T extends SlotMeta> = SlotFunction<ExtractParams<T["params"]>>;

export type ExtractMetaToType<T extends ElementMeta> = {
  [P in keyof T["props"]]: ExtractType<T["props"][P]>;
} & {
  [S in keyof T["slots"]]?: ExtractSlot<T["slots"][S]>;
};
