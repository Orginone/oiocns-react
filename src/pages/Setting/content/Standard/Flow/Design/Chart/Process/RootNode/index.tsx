import React, { useMemo } from 'react';
import Node, { AddNodeType } from '../Node';

type RootNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 开始节点
 * @returns
 */
const RootNode: React.FC<RootNodeProps> = (props: RootNodeProps) => {
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
      isRoot={true}
      showError={false}
      content={content}
      defaultEditable={props.defaultEditable}
      onInsertNode={props.onInsertNode}
      onDelNode={props.onDelNode}
      onSelected={props.onSelected}
      config={props.config}
      errorInfo="错误信息"
      placeholder="全员"
      headerBgc="#576a95"
      headerIcon="el-icon-user-solid"
      type={AddNodeType.START}
    />
  );
};

export default RootNode;
