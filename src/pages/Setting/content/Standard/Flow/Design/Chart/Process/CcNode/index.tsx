import { AddNodeType, NodeModel } from '../../../processType';
import Node from '../Node';
import React from 'react';

type CcNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: NodeModel;
  isEdit: boolean;
};

/**
 * 抄送节点
 * @returns
 */
const CcNode: React.FC<CcNodeProps> = (props: CcNodeProps) => {
  return (
    <Node
      showError={false}
      config={props.config}
      title={props.config.name}
      content={props.config.destName}
      isEdit={props.isEdit}
      errorInfo="错误信息"
      placeholder="请设置抄送对象"
      headerBgc="#3296fa"
      headerIcon="el-icon-s-promotion"
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      type={AddNodeType.CC}
    />
  );
};

export default CcNode;
