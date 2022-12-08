/* eslint-disable no-unused-vars */
import { IGroup } from '@/ts/core/target/itarget';
import { message } from 'antd';

type ResultType<T> = {
  // http代码
  code: number;
  // 数据体
  data: T;
  // 消息
  msg: string;
  // 结果
  success: boolean;
};

/**请求接口的服务 */
class GroupService {
  /** 切换页面后，构造一个虚拟的Group，是从公司加入的集团来获取数据  */
  private _root: IGroup | undefined;

  public setRoot(visualGroup: IGroup) {
    this._root = visualGroup;
  }

  public get rootGroup() {
    return this._root;
  }

  public messageAlert(res: ResultType<any>, operate: string): boolean {
    if (res.success) {
      message.info(`${operate}成功！`);
    } else {
      message.error(`${operate}失败！失败原因：${res.msg}`);
    }
    return res.success;
  }

  /** 搜索一级部门 */
  public async getSearchTopGroup(groupId: string): Promise<IGroup | undefined> {
    const groups = await this._root!.getSubGroups(false);
    const groupsSelect = groups.filter((e) => {
      return e.target.id === groupId;
    });

    if (groupsSelect.length > 0) {
      return groupsSelect[0];
    } else {
      return undefined;
    }
  }

  private async _search(
    item: IGroup,
    parent: IGroup | undefined,
    key: string,
  ): Promise<IGroup | undefined> {
    if (parent && item.target.id === key) {
      return parent;
    }

    const thisGroup = await item.getSubGroups(false);
    for (const i of thisGroup) {
      const parent = await this._search(i, item, key);
      if (parent) {
        return parent;
      }
    }
  }

  public async refParentItem(key: string): Promise<IGroup | undefined> {
    return await this._search(this._root!, undefined, key);
  }
}

export default new GroupService();
