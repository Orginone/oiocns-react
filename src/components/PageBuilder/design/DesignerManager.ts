import { PageElement } from "../core/PageElement";
import HostManagerBase from "../render/HostManager";

export default class DesignerManager extends HostManagerBase<"design"> {
 
  async update() {
    return await this.pageInfo.update(this.pageInfo.metadata);
  }
  
  /** 获取或设置根元素的子元素 */
  get rootChildren(): readonly PageElement[] {
    return this.treeManager.root.children;
  }
  set rootChildren(v: PageElement[]) {
    this.treeManager.root.children = v;
    this.treeManager.changeParent(v, this.treeManager.root.id);
    this.onNodeChange?.(this.treeManager.root);
  }

  onNodeChange: ((root: PageElement) => void) | null = null;



}