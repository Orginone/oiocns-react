import React from 'react';
import Node from '../Node';
import { AddNodeType } from '../../../processType';

type EmptyNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  isEdit: boolean;
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
      isEdit={props.isEdit}
      type={AddNodeType.EMPTY}
    />
  );
};

export default EmptyNode;
