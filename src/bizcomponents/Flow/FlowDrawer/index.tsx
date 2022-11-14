import React from 'react';

import { Drawer } from 'antd';
import EditTitle from './components/EditTitle';
import RootNode from './components/RootNode';
import ApprovalNode from './components/ApprovalNode';
import CcNode from './components/CcNode';
import ConditionNode from './components/ConditionNode';
import { useAppwfConfig } from '@/module/flow/flow';
/* 
    流程设置抽屉
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
      // setDafaultTitle(title?title:'发起人')
      break;
    case 'APPROVAL':
      Comp = <ApprovalNode />;
      // setDafaultTitle(title?title:'审批对象')
      break;
    case 'CC':
      Comp = <CcNode />;
      // setDafaultTitle(title?title:'抄送对象')
      break;
    case 'CONDITION':
      Comp = <ConditionNode />;
      // setDafaultTitle(title?title:'条件')
      break;
  }

  return (
    <Drawer
      title={<EditTitle />}
      placement="right"
      open={open}
      onClose={onClose}
      width={500}>
      <>{Comp && Comp}</>
    </Drawer>
  );
};

export default FlowDrawer;
