import { ILink } from '@/ts/core/thing/link';
import React from 'react';
import GraphTools from './widgets/graphTools';
import Nodes from './widgets/nodes';
import Operate from './widgets/operate';
import NodeForms from './widgets/nodeForms';
import Settings from './widgets/settings';
import Editable from './widgets/editable';

interface IProps {
  current: ILink;
}

export const ToolBar: React.FC<IProps> = ({ current }) => {
  return (
    <>
      <GraphTools current={current} />
      <Settings current={current} />
      <Nodes current={current} />
      <NodeForms current={current} />
      <Operate current={current} />
      <Editable current={current} />
    </>
  );
};
