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
  static workSpaceList: SpaceType[];

  /**切换工作空间 */
  public static changeWorkSpace(space: SpaceType) {
    Provider.setWorkSpace(space);
    // 判断是否是个人空间
    if (Provider.getPerson?.target.id === space.id) {
      space.isUserSpace = true;
    } else {
      space.isUserSpace = false;
    }
  }
  public static async getAllWorkSpaces() {
    let workSpaces: SpaceType[] = [];
    if (Provider.getPerson?.target != null) {
      workSpaces.push({
        id: Provider.getPerson.target.id,
        name: '个人空间',
        isUserSpace: true,
      });
      const companys = await Provider.getPerson.getJoinedCompanys();
      companys.forEach((element) => {
        workSpaces.push({
          id: element.target.id,
          name: element.target.name,
          isUserSpace: false,
        });
      });
    }
    SettingController.workSpaceList = workSpaces;
    // return workSpaces;
  }

  /**
   * 获取当前工作空间
   * @returns 工作当前空间
   */
  static get currentWorkSpace() {
    return SettingController.workSpaceList
      ? SettingController.workSpaceList.find((n) => n.id === Provider.spaceId)
      : {
          id: Provider.getPerson!.target.id,
          name: '个人空间',
          isUserSpace: true,
        };
  }
  // public static async getWorkSpace(): Promise<spaceTarget | undefined> {
  //   if (this._workSpace == null) {
  //     let id = sessionStorage.getItem('_workSpaceId') + '';
  //     const companys = await this._person.getJoinedCompanys();
  //     let company = companys.find((company) => {
  //       return company.target.id == id;
  //     });
  //     this._workSpace = company ? company : this._person;
  //   }
  //   return this._workSpace;
  // }
}
