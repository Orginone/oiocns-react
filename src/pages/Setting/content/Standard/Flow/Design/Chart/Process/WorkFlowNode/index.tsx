import React from 'react';
import Node from '../Node';

type WorkFlowNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  type: {};
  config: any;
  isEdit: boolean;
};

/**
 * 子流程节点
 * @returns
 */
const WorkFlowNode: React.FC<WorkFlowNodeProps> = (props: WorkFlowNodeProps) => {
  return (
    <Node
      title={props.config.name}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      isEdit={props.isEdit}
      type={props?.config.type}
      showError={false}
      content={props.config.destName}
      config={props?.config}
      errorInfo="错误信息"
      placeholder="请选择其他办事"
      headerBgc="#ffffff"
      headerIcon="el-icon-s-check"
    />
  );
};

export default WorkFlowNode;
