import Node from './Node';
import Concurrent from './ConcurrentNode';
import Condition from './ConditionNode';
import DeptWay from './DeptWayNode';
import { AddNodeType, NodeModel } from '../../processType';
import React from 'react';
import { ITarget } from '@/ts/core';

export interface NodeProps {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  level: any;
  isEdit: boolean;
  target?: ITarget;
}

//解码渲染的时候插入dom到同级
export const decodeAppendDom = (node: NodeModel, props: NodeProps) => {
  switch (node.type) {
    case AddNodeType.CONDITION:
      return <Condition {...props} />;
    case AddNodeType.CONCURRENTS:
      return <Concurrent {...props} />;
    case AddNodeType.ORGANIZATIONA:
      return <DeptWay {...props} />;
    default:
      return <Node {...props} />;
  }
};
