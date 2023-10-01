import ElementFactory from "./ElementFactory";
import { IComponentFactory } from "./IComponentFactory";
import ElementTreeManager from "./ElementTreeManager";

export type HostMode = "design" | "view";
export interface PageBuilderStaticContext<T extends IComponentFactory<any, any>> {
  components: T;
  elements: ElementFactory;
}

export interface IViewHost<T extends HostMode, F extends IComponentFactory<any, any>> extends PageBuilderStaticContext<F> {
  readonly mode: T;
  treeManager: ElementTreeManager;
}

