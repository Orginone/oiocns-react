import { PageElement } from "@/components/PageBuilder/core/PageElement";
import type ElementFactory from "./ElementFactory";


export type ElementInit<E extends PageElement> = Partial<Pick<E, "className" | "style" | "props" | "data">>;

export interface PageElementView extends PageElement {
  parentId?: string;
}

/**
 * 元素树管理器，用于维护一颗元素树的状态，提供了增删改的方法
 */
export default class ElementTreeManager {

  readonly root: PageElementView;
  readonly allElements: Dictionary<PageElementView> = {};

  readonly factory!: ElementFactory;

  static createRoot(): PageElement {
    return {
      id: "$root",
      kind: "Root",
      name: "模板根节点",
      children: [],
      props: {}
    }
  }

  constructor(factory: ElementFactory, root?: PageElement) {
    this.factory = factory;

    if (!root) {
      root = ElementTreeManager.createRoot();
    }

    this.root = root;
    this.initElements([this.root]);
  }

  initElements(elements: PageElement[], parentId = "") {
    for (const e of elements) {
      Object.defineProperty(e, "parentId", {
        value: parentId,
        configurable: true,
        enumerable: false
      });
      this.allElements[e.id] = e;
      for (const slot of e.children) {
        this.initElements(slot.children, e.id);
      }
    }
  }

  /** 批量修改元素的直接上级，不处理子级 */
  changeParent(elements: PageElement[], parentId: string) {
    for (const e of elements) {
      Object.defineProperty(e, "parentId", {
        value: parentId,
        configurable: true,
        enumerable: false
      });
      this.allElements[e.id] = e;
    }
  }
  

  createElement<E extends PageElement>(kind: E["kind"], name: string, parentId?: string, params: ElementInit<E> = {}): PageElementView {
    const parent = parentId ? this.allElements[parentId] : this.root;
    if (!parent) {
      throw new ReferenceError("找不到父级："+ parentId);
    }

    const e: PageElementView = this.factory.create(kind, name, params);
    this.initElements([e], parent.id);
    parent.children.push(e);

    return e;
  }

  removeElement(e: PageElementView, recursive = true) {
    if (recursive) {
      // 后序遍历递归删除
      for (const c of e.children) {
        this.removeElement(c, true)
      }      
    }

    const parent = e.parentId ? this.allElements[e.parentId] : this.root;
    if (parent) {
      parent.children.splice(parent.children.indexOf(e), 1);
    } else {
      console.warn("删除时未能找到父级："+ e.parentId);
    }
    
    delete this.allElements[e.id];
    console.log(`删除 ${e.id}`)
  }

  removeElementById(id: string, recursive = true) {
    const e = this.allElements[id];
    if (e) {
      this.removeElement(e, recursive);
      return true;
    } 
    return false;
  }


}