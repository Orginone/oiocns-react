import React, { useState, useMemo } from 'react';
import Node from '@/bizcomponents/Flow/Process/Node';
import useEventEmitter from '@/hooks/useEventEmitter';
type ApprovalNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  [key: string]: any;
};

/**
 * 审批节点
 * @returns
 */
const ApprovalNode: React.FC<ApprovalNodeProps> = (props:ApprovalNodeProps) => {
  const content:any = useMemo(() => {
    if (props.config && !!props.config.props && !!props.config.props.assignedUser && props.config
      .props.assignedUser.length > 0) {
      let texts: any[] = [];
      props.config.props.assignedUser.forEach((org: any) => texts.push(org.name))
      return String(texts).replaceAll(',', '、')
    } else {
      return null
    }
  }, [props.config]);
  return (
    <Node
      title={props.config.name}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      showError={false}
      content={content}
      errorInfo="错误信息"
      placeholder="请设置审批对象"
      headerBgc="#ff943e"
      headerIcon="el-icon-s-check"
    />
  );
};

export default ApprovalNode;
