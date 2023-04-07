import { schema } from '@/ts/base';
import { DictItemModel, PageRequest, TargetShare } from '../../base/model';
import { XDict, XDictItem } from '../../base/schema';

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
  /**字典对应的子项 */
  items?: XDictItem[];
  /** 上级字典  用于级联 */
  // parent: INullDict;
  // /** 下级字典数组 用于级联*/
  // children: IDict[];
  /** 归属信息 */
  belongInfo: TargetShare;
  /** 加载信息 */
  loadInfo(info: TargetShare): Promise<IDict>;
  /** 加载字典子项 */
  loadItems(reload?: boolean): Promise<XDictItem[]>;
  /** 查询字典子项 */
  loadItemsByPage(spaceId: string, page: PageRequest): Promise<schema.XDictItemArray>;
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
}
