import {
  AttributeModel,
  FileItemShare,
  PageRequest,
  SpeciesModel,
} from '../../base/model';
import { XAttributeArray, XSpecies } from '../../base/schema';

/** 可为空的标准分类 */
export type INullSpeciesItem = ISpeciesItem | undefined;
/** 可为空的进度回调 */
export type OnProgressType = (p: number) => void | undefined;

/**
 * 标准分类系统项接口
 */
export interface ISpeciesItem {
  /** 主键,唯一 */
  id: string;
  /** 名称 */
  name: string;
  /** 标准分类项对应的目标 */
  target: XSpecies;
  /** 上级标准分类项 */
  parent: INullSpeciesItem;
  /** 下级标准分类项数组 */
  children: ISpeciesItem[];
  /** 归属信息 */
  belongInfo: FileItemShare | undefined;
  /** 加载信息 */
  loadInfo(info: FileItemShare | undefined): Promise<ISpeciesItem>;
  /** 加载分类特性 */
  loadAttrs(id: string, page: PageRequest): Promise<XAttributeArray>;
  /**
   * 创建标准分类项
   * @param data 创建参数
   */
  create(data: Omit<SpeciesModel, 'id' | 'parentId'>): Promise<INullSpeciesItem>;
  /**
   * 创建分类特性项
   * @param data 创建参数
   */
  createAttr(
    data: Omit<AttributeModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<boolean>;
  /**
   * 删除分类特性项
   * @param id 特性项id
   */
  deleteAttr(id: string): Promise<boolean>;
  /**
   * 删除标准分类项
   */
  delete(): Promise<boolean>;
}
