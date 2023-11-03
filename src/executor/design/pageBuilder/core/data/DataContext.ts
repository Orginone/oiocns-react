export interface DataContext<T extends string = string> {
  code: string;
  name: string;
  kind: T;
  thingId: string;
}

declare module '@/ts/base/schema' {
  interface XPageTemplate {
    data?: DataContext[];
  }
}
