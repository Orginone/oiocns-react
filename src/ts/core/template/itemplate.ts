import { TemplateType } from '.';
import { TargetShare } from '../../base/model';
import { XAuthority, XTarget } from '../../base/schema';

/** 可为空的标准分类 */
export type INullTemplate = ITemplate | undefined;

/**
 * schema
 * TODO 待后台生成
 */
export interface XTemplate {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 父模板ID
  parentId: string;
  // 创建组织/个人
  belongId: string;
  // 工作职权Id
  authId: string;
  // 状态
  status: number;
  // 创建人员ID
  createUser: string;
  // 更新人员ID
  updateUser: string;
  // 修改次数
  version: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
  // 分类的结构
  parent: XTemplate | undefined;
  // 分类的结构
  nodes: XTemplate[] | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  // 创建模板标准的组织/个人
  belong: XTarget | undefined;

  // 分类
  type: TemplateType;
  // 布局
  layout: any;
  // 内容
  content: any;
}

/**
 * 模板
 */
export interface ITemplate {
  /** 主键,唯一 */
  id: string;
  /** 名称 */
  name: string;
  /** 模板对应的目标 */
  target: XTemplate;
  /** 上级标准分类项 */
  parent: INullTemplate;
  /** 下级标准分类项数组 */
  children: ITemplate[];
  /** 归属信息 */
  belongInfo: TargetShare;
}
