import React from 'react';
import Node, { AddNodeType } from '../Node';

type EmptyNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 空节点
 * @returns
 */
const EmptyNode: React.FC<EmptyNodeProps> = (props: EmptyNodeProps) => {
  return (
    <Node
      title="空节点"
      show={false}
      showError={false}
      content="空节点"
      errorInfo="空节点"
      placeholder="空节点"
      headerBgc="#ff943e"
      headerIcon="el-icon-s-check"
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      defaultEditable={props.defaultEditable}
      type={AddNodeType.EMPTY}
    />
  );
};

export default EmptyNode;
