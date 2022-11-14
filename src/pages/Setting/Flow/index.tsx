import { Card } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import RootNode from '@/bizcomponents/Flow/Process/RootNode'
import ApprovalNode from '@/bizcomponents/Flow/Process/ApprovalNode'
import CcNode from '@/bizcomponents/Flow/Process/CcNode'
import ConcurrentNode from '@/bizcomponents/Flow/Process/ConcurrentNode'
import ConditionNode from '@/bizcomponents/Flow/Process/ConditionNode'
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign'
import FlowDrawer from '@/bizcomponents/Flow/FlowDrawer';
/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const [isRootNodeOpen, setIsRootNodeOpen] = useState<boolean>(false); // 发起人根节点
  const [isApprovalNodeOpen, setIsApprovalNodeOpen] = useState<boolean>(false); // 审批对象节点
  const onClose = () => {
    setIsRootNodeOpen(false);
    setIsApprovalNodeOpen(false);
  };
  const content = (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
          <ProcessDesign></ProcessDesign>
      </Card>
    </div>
  );
  return (
    <Card>
      {content}
      <FlowDrawer open={isRootNodeOpen} onClose={onClose} title={'发起人'} type="ROOT" />
      <FlowDrawer
        open={isApprovalNodeOpen}
        onClose={onClose}
        title={'审批对象'}
        type="APPROVAL"
      />
    </Card>
  );
};

export default SettingFlow;
