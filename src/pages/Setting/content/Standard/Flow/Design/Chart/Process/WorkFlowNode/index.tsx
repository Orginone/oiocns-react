import React, { useMemo } from 'react';
import Node from '../Node';

type WorkFlowNodeProps = {
  operateOrgId?: string;
  nodeOperateOrgId?: string;
  setNodeOperateOrgId: Function;
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  type: {};
  config: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 子流程节点
 * @returns
 */
const WorkFlowNode: React.FC<WorkFlowNodeProps> = (props: WorkFlowNodeProps) => {
  const content: any = useMemo(() => {
    if (
      props.config &&
      !!props.config.props &&
      !!props.config.props.assignedUser &&
      props.config.props.assignedUser.length > 0
    ) {
      let texts: any[] = [];
      props.config.props.assignedUser.forEach((org: any) => {
        texts.push(org.name);
      });
      return String(texts).replaceAll(',', '、');
    } else {
      return null;
    }
  }, [props.config]);

  return (
    <Node
      title={props.config.name}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      operateOrgId={props.operateOrgId}
      defaultEditable={props.defaultEditable}
      type={props?.config.type}
      showError={false}
      content={content}
      belongId={props.config.belongId}
      config={props?.config}
      errorInfo="错误信息"
      placeholder="请选择其他办事"
      headerBgc="#ffffff"
      headerIcon="el-icon-s-check"
    />
  );
};

export default WorkFlowNode;
