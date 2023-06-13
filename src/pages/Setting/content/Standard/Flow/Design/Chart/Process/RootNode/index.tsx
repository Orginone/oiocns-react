import React from 'react';
import Node from '../Node';
import { AddNodeType } from '../../../processType';

type RootNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  isEdit: boolean;
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
      content={props.config.destName}
      isEdit={props.isEdit}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      config={props.config}
      errorInfo="错误信息"
      placeholder="全员"
      headerBgc="#576a95"
      headerIcon="el-icon-user-solid"
      type={AddNodeType.ROOT}
    />
  );
};

export default RootNode;
