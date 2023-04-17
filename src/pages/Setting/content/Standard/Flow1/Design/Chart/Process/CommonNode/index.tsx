import Node from '../Node';
import React from 'react';

type Iprops = {
  node: any;
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  defaultEditable: boolean;
  [key: string]: any;
  errorInfo: string;
  placeholder: string;
  headerBgc: string;
  headerIcon: string;
};

/**
 *  通用节点
 * @returns
 */
const CommonNode: React.FC<Iprops> = (props) => {
  return (
    <Node
      title={props.config.name}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      operateOrgId={props.operateOrgId}
      showError={false}
      content={props.node.props.assignedUser.name}
      node={props.node}
      errorInfo={props.errorInfo}
      placeholder={props.placeholder}
      headerBgc={props.headerBgc}
      headerIcon={props.headerIcon}
    />
  );
};

export default CommonNode;
