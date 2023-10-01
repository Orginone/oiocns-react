import { ComponentType } from "react";
import { IComponentFactory } from "../core/IComponentFactory";
import { Render, createNullRender, createRender } from "./createRender";
import { HostMode } from "../core/IViewHost";


export default class ReactComponentFactory implements IComponentFactory<ComponentType, Render> {

  get rootRender() {
    return this.getComponentRender("Root");
  }

  readonly componentDefinitions = new Map<string, ComponentType>();

  registerComponent<T extends ComponentType>(name: string, component: T) {
    this.componentDefinitions.set(name, component);
  }

  registerComponents(components: Dictionary<ComponentType>) {
    for (const [name, component] of Object.entries(components)) {
      this.registerComponent(name, component);
    }
  }


  readonly renderDefinitions = new WeakMap<ComponentType, Render>();

  /**
   * 创建或返回一个指定元素的包装渲染组件
   * @param element 元素名称
   * @returns 包装渲染组件
   */
  getComponentRender(name: string, mode: HostMode = "view") {
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