import * as t from '../type';

export class Excel implements t.IExcel {
  handlers: t.ISheetHandler<t.model.Sheet<any>>[];
  dataHandler?: t.DataHandler;
  context: t.Context;

  constructor(sheets?: t.ISheetHandler<t.model.Sheet<any>>[], handler?: t.DataHandler) {
    this.handlers = [];
    this.dataHandler = handler;
    this.context = {};
    sheets?.forEach((item) => this.appendHandler(item));
  }

  getHandler(name: string) {
    return this.handlers.filter((item) => item.sheet.name == name)[0];
  }

  appendHandler(handler: t.ISheetHandler<any>): void {
    const judge = (item: any) => item.sheet.name == handler.sheet.name;
    const index = this.handlers.findIndex(judge);
    if (index == -1) {
      this.handlers.push(handler);
    } else {
      this.handlers[index] = handler;
    }
  }

  async handling(): Promise<void> {
    try {
      let totalRows = this.handlers
        .map((item) => item.sheet)
        .map((item) => item.data.length)
        .reduce((f, s) => f + s);
      this.dataHandler?.initialize?.(totalRows);

      for (const handler of this.handlers) {
        await handler.operating(this, (count?: number) =>
          this.dataHandler?.onItemCompleted?.(count),
        );
        handler.completed?.(this);
      }
      this.dataHandler?.onCompleted?.();
    } catch (error: any) {
      console.log(error);
      this.dataHandler?.onError?.('数据处理异常');
    }
  }

  searchSpecies(code?: string): t.SpeciesData | undefined {
    if (code) {
      for (const dirKey of Object.keys(this.context)) {
        const dir = this.context[dirKey];
        if (dir.species[code]) {
          return dir.species[code];
        }
      }
    }
  }

  searchProps(code?: string | undefined): t.Property | undefined {
    if (code) {
      for (const dirKey of Object.keys(this.context)) {
        const dir = this.context[dirKey];
        if (dir.props[code]) {
          return dir.props[code];
        }
      }
    }
  }
}
