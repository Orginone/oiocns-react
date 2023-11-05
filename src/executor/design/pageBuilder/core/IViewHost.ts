import { ElementMeta } from './ElementMeta';
import { IComponentFactory } from './IComponentFactory';
import ElementTreeManager from './ElementTreeManager';
import ElementFactory from './ElementFactory';

export type HostMode = 'design' | 'view';
export interface PageBuilderStaticContext<TComponent> {
  components: Dictionary<TComponent>;
  metas: Dictionary<ElementMeta>;
}

export interface IViewHost<T extends HostMode, F extends IComponentFactory<any, any>> {
  readonly mode: T;
  treeManager: ElementTreeManager;
  components: F;
  elements: ElementFactory;
}
