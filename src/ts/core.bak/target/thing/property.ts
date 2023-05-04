import { PageRequest, PropertyModel } from '../../../base/model';
import { XProperty, XPropertyArray } from '../../../base/schema';
import { kernel } from '../../../base';

export class Property {
  belongId: string;
  constructor(id: string) {
    this.belongId = id;
  }

  /* 加载属性 */
  async loadPropertys(page: PageRequest): Promise<XPropertyArray> {
    const res = await kernel.queryPropertys({
      id: this.belongId,
      page: page,
    });
    return res.data;
  }
  /* 创建属性  */
  async createProperty(data: PropertyModel): Promise<XProperty> {
    data.belongId = this.belongId;
    const res = await kernel.createProperty(data);
    return res.data;
  }
  /* 更新属性  */
  async updateProperty(data: PropertyModel): Promise<XProperty> {
    data.belongId = this.belongId;
    const res = await kernel.updateProperty(data);
    return res.data;
  }

  /* 删除属性  */
  async deleteProperty(id: string): Promise<boolean> {
    const res = await kernel.deleteProperty(id);
    return res.data;
  }
}
