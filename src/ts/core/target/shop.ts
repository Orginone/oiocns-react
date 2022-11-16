import { kernel, model, common, schema } from '../../base';
import BaseTarget from './base';
export default class Shop extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }

  // 重命名
  RenameItem() {}
  // 拷贝副本
  copyItem() {}
  // 复制链接
  copyLink() {}
  // 移动到
  moveTo() {}
  // 收藏
  favorite() {}
  // 删除
  deleteItem() {}
  //获取列表
  getapps() {}
}
