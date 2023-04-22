/**
 * 办事接口
 */
export interface ITodo {
  /** 事项名称 */
  name: string;
  /** 事项类型 */
  type: string;
  /** 事项数据 */
  data: string;
  /** 用户ID */
  userId: string;
  /** 共享组织 */
  shareId: string;
  /** 所在空间ID */
  spaceId: string;
  /** 分类Id */
  speciesId: string;
  /** 审批办事 */
  approval(status: number, comment: string): Promise<boolean>;
}
