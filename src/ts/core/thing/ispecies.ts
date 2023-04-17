import { model, schema } from '@/ts/base';
import {
  AttributeModel,
  CreateDefineReq,
  OperationModel,
  PageRequest,
  SpeciesModel,
  TargetShare,
} from '../../base/model';
import {
  XAttributeArray,
  XFlowDefine,
  XOperationArray,
  XSpecies,
  XAttribute,
  XFlowInstance,
} from '../../base/schema';
import { IFlowDefine } from './iflowDefine';

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
  /** 属性 */
  attrs?: XAttribute[];
  /** 流程设计 */
  defines?: IFlowDefine[];
  /** 流程实例 */
  instances?: XFlowInstance[];
  /** 加载信息 */
  loadInfo(info: TargetShare): Promise<ISpeciesItem>;
  /** 加载分类特性 */
  loadAttrs(reload: boolean): Promise<XAttribute[]>;
  /** 分页查询分类特性 */
  loadAttrsByPage(
    id: string,
    recursionOrg: boolean,
    recursionSpecies: boolean,
    page: PageRequest,
  ): Promise<XAttributeArray>;
  /** 加载业务标准 */
  loadOperations(
    id: string,
    filterAuth: boolean,
    recursionOrg: boolean,
    recursionSpecies: boolean,
    page: PageRequest,
  ): Promise<XOperationArray>;
  /** 加载流程设计 */
  loadFlowDefines(reload?: boolean): Promise<IFlowDefine[]>;
  /**查询流程实例 */
  loadFlowInstances(status: number[], page: PageRequest): Promise<XFlowInstance[]>;
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
  ): Promise<model.ResultType<schema.XOperation>>;
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
