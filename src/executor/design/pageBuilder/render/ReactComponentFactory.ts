import { IComponentFactory } from '../core/IComponentFactory';
import { HostMode } from '../core/IViewHost';
import { ElementFC } from '../elements/defineElement';
import { Render, createNullRender, createRender } from './createRender';

export default class ReactComponentFactory
  implements IComponentFactory<ElementFC, Render>
{
  get rootRender() {
    return this.getComponentRender('Root');
  }

  readonly componentDefinitions = new Map<string, ElementFC>();

  registerComponent<T extends ElementFC>(name: string, component: T) {
    this.componentDefinitions.set(name, component);
  }

  registerComponents(components: Dictionary<ElementFC>) {
    for (const [name, component] of Object.entries(components)) {
      this.registerComponent(name, component);
    }
  }

  readonly renderDefinitions = new WeakMap<ElementFC, Render>();

  /**
   * 创建或返回一个指定元素的包装渲染组件
   * @param element 元素名称
   * @returns 包装渲染组件
   */
  getComponentRender(name: string, mode: HostMode = 'view') {
    const component = this.componentDefinitions.get(name);
    if (!component) {
      return createNullRender(name);
    }

    let def: Render | undefined = this.renderDefinitions.get(component);
    if (!def) {
      def = createRender(component, mode);
      this.renderDefinitions.set(component, def);
    }
    return def;
  }
}
