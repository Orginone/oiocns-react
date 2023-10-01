import { getUuid } from "@/utils/tools";
import { ElementInit } from "./ElementTreeManager";
import { PageElement } from "./PageElement";
import { ElementMeta } from "./ElementMeta";

export default class ElementFactory {
  // TODO: 注册和解析元素属性元数据，包括默认值和校验
  readonly elementMeta: Dictionary<ElementMeta>;

  constructor(meta: Dictionary<ElementMeta>) {
    this.elementMeta = meta;
  }
  
  create<E extends PageElement>(kind: E["kind"], name: string, params: ElementInit<E> = {}): E {
    const e: E = {
      id: getUuid(),
      kind,
      name,
      ...params
    } as any;
    e.props ||= {};
    e.children ||= [];
    return e;
  }
}