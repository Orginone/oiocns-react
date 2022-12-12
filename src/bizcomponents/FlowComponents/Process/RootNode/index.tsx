import React from 'react';
import Node from '@/bizcomponents/Flow/Process/Node';

type RootNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  [key: string]: any;
};

/**
 * 开始节点
 * @returns
 */
const RootNode: React.FC<RootNodeProps> = (props: RootNodeProps) => {
  return (
    <Node
      title={props.config.name}
      isRoot={true}
      showError={false}
      content=""
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      errorInfo="错误信息"
      placeholder="所有人"
      headerBgc="#576a95"
      headerIcon="el-icon-user-solid"
    />
  );
};

export default RootNode;
