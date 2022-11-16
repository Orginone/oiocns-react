import { Card } from 'antd';
import React from 'react';
import cls from './index.module.less';
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
