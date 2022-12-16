import React from 'react';
import { Drawer } from 'antd';
import EditTitle from './components/EditTitle';
import RootNode from './components/RootNode';
import ApprovalNode from './components/ApprovalNode';
import CcNode from './components/CcNode';
import ConditionNode from './components/ConditionNode';
import { useAppwfConfig } from '../flow';

/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface Iprops {
  open: boolean;
  onClose: () => void;
}

const FlowDrawer = (props: Iprops) => {
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const { open, onClose } = props;

  let Comp = null;

  switch (selectedNode.type) {
    case 'ROOT':
      Comp = <RootNode />;
      break;
    case 'APPROVAL':
      Comp = <ApprovalNode />;
      break;
    case 'CC':
      Comp = <CcNode />;
      break;
    case 'CONDITION':
      Comp = <ConditionNode />;
      break;
  }

  return (
    <Drawer
      title={<EditTitle />}
      placement="right"
      open={open}
      onClose={() => onClose()}
      width={600}>
      <>{Comp}</>
    </Drawer>
  );
};

export default FlowDrawer;
