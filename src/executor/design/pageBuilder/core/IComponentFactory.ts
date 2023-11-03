export interface IComponentFactory<TComponent, TRender> {
  registerComponent<C extends TComponent>(name: string, component: C): void;

  registerComponents(components: Dictionary<TComponent>): void;

  getComponentRender(name: string): TRender;

  readonly rootRender: TRender;
}
