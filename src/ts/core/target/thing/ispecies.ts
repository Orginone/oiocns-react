import { model, schema } from '@/ts/base';
import {
  AttributeModel,
  CreateDefineReq,
  OperationModel,
  PageRequest,
  SpeciesModel,
} from '@/ts/base/model';
import {
  XAttributeArray,
  XOperationArray,
  XSpecies,
  XAttribute,
  XFlowInstance,
  XFlowDefine,
  XFlowDefineArray,
  FlowNode,
} from '@/ts/base/schema';
import { ITarget } from '../itarget';

/** 可为空的标准分类 */
export type INullSpeciesItem = ISpeciesItem | undefined;
/** 可为空的进度回调 */
export type OnProgressType = (p: number) => void | undefined;

/**
 * 标准分类系统项接口
 */
export interface ISpeciesItem {
  /** 主键 */
  key: string;
  /** 唯一 */
  id: string;
  /** 名称 */
  name: string;
  /** 标准分类项对应的目标 */
  target: XSpecies;
  /** 上级标准分类项 */
  parent: INullSpeciesItem;
  /** 下级标准分类项数组 */
  children: ISpeciesItem[];
  /** 属性 */
  attrs?: XAttribute[];
  /** 流程实例 */
  instances?: XFlowInstance[];
  /** 团队 */
  team: ITarget;
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
  /* 加载办事 */
  loadWork(page: PageRequest): Promise<XFlowDefineArray>;
  /* 加载办事 */
  loadWorkNode(id: string): Promise<FlowNode>;
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
   * 创建业务标准
   * @param data 创建参数
   */
  createOperation(
    data: Omit<OperationModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<model.ResultType<schema.XOperation>>;
  /**
   * 更新标准分类项
   * @param data 创建参数
   */
  update(data: Omit<SpeciesModel, 'id' | 'parentId' | 'code'>): Promise<ISpeciesItem>;
  /**
   * 更新分类特性项
   * @param data 创建参数
   */
  updateAttr(data: Omit<AttributeModel, 'speciesId' | 'speciesCode'>): Promise<boolean>;
  /**
   * 更新业务标准
   * @param data 创建参数
   */
  updateOperation(
    data: Omit<OperationModel, 'speciesId' | 'speciesCode'>,
  ): Promise<boolean>;
  /** 发布办事 */
  publishWork(data: Omit<CreateDefineReq, 'belongId'>): Promise<XFlowDefine>;
  /**
   * 删除标准分类项
   */
  delete(): Promise<boolean>;
  /**
   * 删除分类特性项
   * @param id 特性项id
   */
  deleteAttr(id: string): Promise<boolean>;
  /**
   * 删除业务标准
   * @param id 特性项id
   */
  deleteOperation(id: string): Promise<boolean>;
  /** 删除办事 */
  deleteWork(id: string): Promise<boolean>;
}
