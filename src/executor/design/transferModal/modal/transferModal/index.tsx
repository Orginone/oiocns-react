import { ITransfer } from '@/ts/core';
import React from 'react';
import GraphEditor from './widgets/graphEditor';
import GraphTools from './widgets/graphTools';
import Settings from './widgets/settings';
import Nodes from './widgets/nodes';
import NodeForms from '../../common/widgets/nodeForms';
import Operate from './widgets/operate';
import Editable from '../../common/widgets/center';
import Tasks from './widgets/tasks';
import { FullModal } from '../..';

interface IProps {
  current: ITransfer;
  finished: () => void;
  title?: string;
  status?: 'Editable' | 'Viewable';
  event?: 'EditRun' | 'ViewRun';
}

const TransferModal: React.FC<IProps> = ({
  current,
  finished,
  title = '迁移配置',
  status = 'Editable',
  event = 'EditRun',
}) => {
  return (
    <FullModal title={title} finished={finished}>
      <GraphEditor current={current} initStatus={status} initEvent={event} />
      <GraphTools current={current} initStatus={status} />
      <Settings current={current} />
      <Nodes current={current} />
      <NodeForms current={current} />
      <Operate current={current} />
      <Editable current={current} />
      <Tasks current={current} />
    </FullModal>
  );
};

export { TransferModal };
