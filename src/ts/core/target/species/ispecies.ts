import {
  AttributeModel,
  CreateDefineReq,
  DictModel,
  OperationModel,
  PageRequest,
  SpeciesModel,
  TargetShare,
} from '../../../base/model';
import {
  XAttributeArray,
  XFlowDefine,
  XFlowDefineArray,
  XDictArray,
  XOperationArray,
  XSpecies,
} from '../../../base/schema';
import { IDict, INullDict } from './idict';

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
  belongInfo: TargetShare;
  /** 加载信息 */
  loadInfo(info: TargetShare): Promise<ISpeciesItem>;
  /** 加载分类特性 */
  loadAttrs(id: string, page: PageRequest): Promise<XAttributeArray>;
  /** 加载分类字典 */
  loadDicts(id: string, page: PageRequest): Promise<XDictArray>;
  /** 加载分类字典实体 */
  loadDictsEntity(spaceId: string, page: PageRequest): Promise<IDict[]>;
  /** 加载业务标准 */
  loadOperations(id: string, page: PageRequest): Promise<XOperationArray>;
  /** 加载流程设计 */
  loadFlowDefines(id: string, page: PageRequest): Promise<XFlowDefineArray>;
  /**
   * 创建标准分类项
   * @param data 创建参数
   */
  create(data: Omit<SpeciesModel, 'id' | 'parentId'>): Promise<INullSpeciesItem>;
  /**
   * 更新标准分类项
   * @param data 创建参数
   */
  update(data: Omit<SpeciesModel, 'id' | 'parentId' | 'code'>): Promise<ISpeciesItem>;
  /**
   * 创建分类特性项
   * @param data 创建参数
   */
  createAttr(
    data: Omit<AttributeModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<boolean>;
  /**
   * 更新分类特性项
   * @param data 创建参数
   */
  updateAttr(data: Omit<AttributeModel, 'speciesId' | 'speciesCode'>): Promise<boolean>;
  /**
   * 删除分类特性项
   * @param id 特性项id
   */
  deleteAttr(id: string): Promise<boolean>;
  /**
   * 创建字典
   * @param data 创建参数
   */
  createDict(data: Omit<DictModel, 'id' | 'parentId'>): Promise<INullDict>;
  /**
   * 更新字典
   * @param data 创建参数
   */
  updateDict(data: DictModel): Promise<boolean>;
  /**
   * 删除字典
   * @param id 特性项id
   */
  deleteDict(id: string): Promise<boolean>;
  /**
   * 创建流程设计
   * @param data 创建参数
   */
  createFlowDefine(data: Omit<CreateDefineReq, 'id' | 'speciesId'>): Promise<XFlowDefine>;
  /**
   * 更新流程设计
   * @param data 创建参数
   */
  updateFlowDefine(data: CreateDefineReq): Promise<boolean>;
  /**
   * 删除流程设计
   * @param id 流程设计id
   */
  deleteFlowDefine(id: string): Promise<boolean>;

  /**
   * 创建业务标准
   * @param data 创建参数
   */
  createOperation(
    data: Omit<OperationModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<boolean>;
  /**
   * 更新业务标准
   * @param data 创建参数
   */
  updateOperation(
    data: Omit<OperationModel, 'speciesId' | 'speciesCode'>,
  ): Promise<boolean>;
  /**
   * 删除业务标准
   * @param id 特性项id
   */
  deleteOperation(id: string): Promise<boolean>;
  /**
   * 删除标准分类项
   */
  delete(): Promise<boolean>;
}
