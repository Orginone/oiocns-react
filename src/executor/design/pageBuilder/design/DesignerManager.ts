import { PageElement } from '../core/PageElement';
import HostManagerBase from '../render/HostManager';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import { IDisposable } from '@/ts/base/common';
import { ElementInit } from '../core/ElementTreeManager';
import { message } from 'antd';

export default class DesignerManager
  extends HostManagerBase<'design'>
  implements IDisposable
{
  constructor(pageFile: IPageTemplate) {
    super('design', pageFile);
    this.currentElement = this.rootElement;
  }

  dispose() {
    console.info('DesignerManager disposed');
    this.currentElement = null;
  }

  async update() {
    return await this.pageInfo.update(this.pageInfo.metadata);
  }

  /** 获取或设置根元素的子元素 */
  get rootChildren(): readonly PageElement[] {
    return this.treeManager.root.children;
  }
  set rootChildren(v: PageElement[]) {
    try {
      this.treeManager.root.children = v;
      this.treeManager.changeParent(v, this.treeManager.root.id);
      this.currentElement = null;
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  private _currentElement: PageElement | null = null;
  get currentElement() {
    return this._currentElement;
  }
  set currentElement(e) {
    this._currentElement = e;
    this.emitter('current', 'change');
  }

  addElement<E extends PageElement>(
    kind: E['kind'],
    name: string,
    slotName = 'default',
    parentId?: string,
    params: ElementInit<E> = {},
  ): E {
    try {
      const e = this.treeManager.createElement(kind, name, slotName, parentId, params);
      this.currentElement = e;
      this.emitter('elements', 'change');
      return e as any;
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  removeElement(e: PageElement, recursive?: boolean) {
    try {
      this.treeManager.removeElement(e, recursive);
      this.emitter('elements', 'change');
      this.currentElement = null;
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  changeElement(e: PageElement, targetId: string, slotName: string = 'default') {
    try {
      this.treeManager.changeParent([e], targetId, slotName);
      this.emitter('elements', 'change');
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  moveElement(e: PageElement, targetId: string, position: number) {
    try {
      this.treeManager.moveElement(e, targetId, position);
      this.emitter('elements', 'change');
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
