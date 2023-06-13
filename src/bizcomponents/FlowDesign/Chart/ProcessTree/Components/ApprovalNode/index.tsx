import React from 'react';
import Node from '../Node';
import { NodeModel } from '../../../../processType';
type ApprovalNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  type: {};
  config: NodeModel;
  isEdit: boolean;
};

/**
 * 审批节点
 * @returns
 */
const ApprovalNode: React.FC<ApprovalNodeProps> = (props: ApprovalNodeProps) => {
  return (
    <Node
      title={props.config.name}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      isEdit={props.isEdit}
      type={props.config.type}
      showError={false}
      content={props.config.destName}
      config={props.config}
      errorInfo="错误信息"
      placeholder="请设置审批对象"
      headerBgc="#ff943e"
      headerIcon="el-icon-s-check"
    />
  );
};

export default ApprovalNode;
