/**
 * 设置层， 总控制器
 */
import Provider from '../../core/provider';

/** 空间类型申明 */
export type SpaceType = {
  /** 空间标识 */
  id: string;
  /** 空间名称 */
  name: string;
  /**是否是个人空间 */
  isUserSpace?: boolean;
};

export default class SettingController {
  // 当前的工作空间, 静态存储
  static workSpace: SpaceType;

  /**切换工作空间 */
  public static changeWorkSpace(space: SpaceType) {
    // 判断是否是个人空间
    if (Provider.getPerson?.target.id === space.id) {
      space.isUserSpace = true;
    } else {
      space.isUserSpace = false;
    }
    SettingController.workSpace = space;
  }
}
