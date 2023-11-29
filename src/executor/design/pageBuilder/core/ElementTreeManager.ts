import type ElementFactory from './ElementFactory';
import { PageElement } from './PageElement';

export type ElementInit<E extends PageElement> = Partial<
  Pick<E, 'className' | 'style' | 'props' | 'data' | 'slots'>
>;

export interface PageElementView extends PageElement {
  parentId?: string;
  slotName?: string;
}

export interface SlotChildren {
  name: string;
  children: PageElementView[];
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
      id: '$root',
      kind: 'Root',
      name: '模板根节点',
      children: [],
      props: {},
      slots: {},
    };
  }

  constructor(factory: ElementFactory, root?: PageElement) {
    this.factory = factory;

    if (!root) {
      root = ElementTreeManager.createRoot();
    }

    this.root = root;
    this.initElements([this.root]);
  }

  initElements(elements: PageElement[], parentId = '', slotName = 'default') {
    for (const e of elements) {
      Object.defineProperty(e, 'parentId', {
        value: parentId,
        configurable: true,
        enumerable: false,
      });
      if (slotName) {
        Object.defineProperty(e, 'slotName', {
          value: slotName,
          configurable: true,
          enumerable: false,
          writable: true,
        });
      }
      this.allElements[e.id] = e;
      for (const slot of this.getSlotChildren(e)) {
        this.initElements(slot.children, e.id, slot.name);
      }
    }
  }

  private getSlotChildren(e: PageElement) {
    const ret: SlotChildren[] = [];
    for (const [name, slot] of Object.entries(e.slots || {})) {
      if (!slot) continue;

      if (Array.isArray(slot)) {
        ret.push({
          name,
          children: slot,
        });
      } else {
        ret.push({
          name,
          children: [slot],
        });
      }
    }
    ret.push({
      name: 'default',
      children: e.children,
    });
    return ret;
  }

  /** 批量修改元素的直接上级，不处理子级 */
  changeParent(elements: PageElementView[], parentId: string, slotName = 'default') {
    const parent = this.getParent(parentId);
    for (const e of elements) {
      const currentParent = this.allElements[e.parentId!];
      if (!currentParent) {
        throw new ReferenceError(`找不到元素 ${e.id} 的父级：${e.parentId}`);
      }
      this.removeElement(e, false);
      this.setParent(e, parent, slotName);
      Object.defineProperty(e, 'parentId', {
        value: parentId,
        configurable: true,
        enumerable: false,
      });
    }
  }

  getParent(parentId?: string) {
    const parent = parentId ? this.allElements[parentId] : this.root;
    if (!parent) {
      throw new ReferenceError('找不到父级：' + parentId);
    }
    return parent;
  }

  private setParent(e: PageElement, parent: PageElement, slotName: string) {
    this.initElements([e], parent.id, slotName);
    if (slotName == 'default') {
      parent.children.push(e);
    } else {
      if (parent.slots) {
        if (Array.isArray(parent.slots[slotName])) {
          (parent.slots[slotName] as PageElement[]).push(e);
        } else {
          parent.slots[slotName] = e;
        }
      } else {
        throw new Error(`父级 ${parent.id} 没有插槽`);
      }
    }
  }

  createElement<E extends PageElement>(
    kind: E['kind'],
    name: string,
    slotName = 'default',
    parentId?: string,
    params: ElementInit<E> = {},
  ): PageElementView {
    const parent = this.getParent(parentId);
    const e: PageElementView = this.factory.create(kind, name, params);
    this.setParent(e, parent, slotName);

    return e;
  }

  removeElement(e: PageElementView, recursive = true) {
    if (recursive) {
      // 后序遍历递归删除
      for (const c of e.children) {
        this.removeElement(c, true);
      }
    }

    const parent = e.parentId ? this.allElements[e.parentId] : this.root;
    if (parent) {
      if (e.slotName == 'default') {
        parent.children.splice(parent.children.indexOf(e), 1);
      } else {
        if (parent.slots) {
          const slots = parent.slots[e.slotName!];
          if (Array.isArray(slots)) {
            slots.splice(slots.indexOf(e), 1);
          } else {
            delete parent.slots![e.slotName!];
          }
        } else {
          throw new Error(`父级 ${parent.id} 没有插槽`);
        }
      }
    } else {
      console.warn('删除时未能找到父级：' + e.parentId);
    }

    delete this.allElements[e.id];
  }

  removeElementById(id: string, recursive = true) {
    const e = this.allElements[id];
    if (e) {
      this.removeElement(e, recursive);
      return true;
    }
    return false;
  }

  moveElement(e: PageElement, parentId: string, position: number) {
    const view = e as PageElementView;
    if (view.parentId != parentId) {
      throw new Error('此方法用于平级元素拖动！');
    }
    const parent = this.getParent(parentId);
    const index = parent.children.indexOf(e);
    parent.children.splice(position, 0, parent.children.splice(index, 1)[0]);
  }
}
