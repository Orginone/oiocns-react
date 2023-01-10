import { DictItemModel, PageRequest, DictModel, TargetShare } from '../../../base/model';
import { XDict, XDictItemArray } from '../../../base/schema';

/** 可为空的字典 */
export type INullDict = IDict | undefined;
/** 可为空的进度回调 */
export type OnProgressType = (p: number) => void | undefined;

/**
 * 字典系统项接口
 */
export interface IDict {
  /** 主键,唯一 */
  id: string;
  /** 名称 */
  name: string;
  /** 字典对应的目标 */
  target: XDict;
  /** 上级字典  用于级联 */
  // parent: INullDict;
  // /** 下级字典数组 用于级联*/
  // children: IDict[];
  /** 归属信息 */
  belongInfo: TargetShare;
  /** 加载信息 */
  loadInfo(info: TargetShare): Promise<IDict>;
  /** 加载字典子项 */
  loadItems(spaceId: string, page: PageRequest): Promise<XDictItemArray>;
  /**
   * 创建字典
   * @param data 创建参数
   */
  create(data: Omit<DictModel, 'id' | 'parentId'>): Promise<INullDict>;
  /**
   * 更新字典
   * @param data 创建参数
   */
  update(data: Omit<DictModel, 'id' | 'parentId' | 'code'>): Promise<IDict>;
  /**
   * 创建字典子项
   * @param data 创建参数
   */
  createItem(data: Omit<DictItemModel, 'id' | 'dictId'>): Promise<boolean>;
  /**
   * 更新字典子项
   * @param data 创建参数
   */
  updateItem(data: DictItemModel): Promise<boolean>;
  /**
   * 删除字典子项
   * @param id 子项id
   */
  deleteItem(id: string): Promise<boolean>;
  /**
   * 删除字典
   */
  delete(): Promise<boolean>;
}
