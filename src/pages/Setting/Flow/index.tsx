import { Card } from 'antd';
import React from 'react';
import cls from './index.module.less';
import RootNode from '@/bizcomponents/Flow/Process/RootNode';
import ApprovalNode from '@/bizcomponents/Flow/Process/ApprovalNode';
import CcNode from '@/bizcomponents/Flow/Process/CcNode';
import ConcurrentNode from '@/bizcomponents/Flow/Process/ConcurrentNode';
import ConditionNode from '@/bizcomponents/Flow/Process/ConditionNode';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const content = (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <ProcessDesign></ProcessDesign>
      </Card>
    </div>
  );
  return <Card>{content}</Card>;
};

export default SettingFlow;
