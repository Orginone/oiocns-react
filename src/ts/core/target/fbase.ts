import BaseTarget from './base';
import { schema, kernel } from '../../base';
export default class FlowTarget extends BaseTarget {
  private _defines: schema.XFlowDefine[];
  async getDefines(): Promise<schema.XFlowDefine[]> {
    if (this._defines.length > 0) {
      return this._defines;
    }
    const res = await kernel.queryDefine({ id: this.target.id });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this._defines.push(a);
      });
    }
    return this._defines;
  }
  async resetDefine(data: schema.XFlowDefine): Promise<schema.XFlowDefine[]> {
    const res = await kernel.resetDefine(data);
    if (res.success) {
      this._defines = this._defines.filter((a) => {
        return a.id == data.id;
      });
      this._defines.push(res.data);
    }
    return this._defines;
  }
}
