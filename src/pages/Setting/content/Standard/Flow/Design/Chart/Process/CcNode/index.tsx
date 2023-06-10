import Node, { AddNodeType } from '../Node';
import React, { useMemo } from 'react';

type CcNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 抄送节点
 * @returns
 */
const CcNode: React.FC<CcNodeProps> = (props: CcNodeProps) => {
  const content: any = useMemo(() => {
    if (
      props.config &&
      !!props.config.props &&
      !!props.config.props.assignedUser &&
      props.config.props.assignedUser.length > 0
    ) {
      let texts: any[] = [];
      props.config.props.assignedUser.forEach((org: any) => texts.push(org.name));
      return String(texts).replaceAll(',', '、');
    } else {
      return null;
    }
  }, [props.config]);
  return (
    <Node
      title={props.config.name}
      showError={false}
      content={content}
      config={props?.config}
      defaultEditable={props.defaultEditable}
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
