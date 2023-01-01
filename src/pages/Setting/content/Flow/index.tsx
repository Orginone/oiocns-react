import Design from './Design';
import React, { useState } from 'react';
import { XFlowDefine } from '../../../../ts/base/schema';
import FlowList from './info';

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const [tabKey, SetTabKey] = useState(0);
  const [current, setCurrent] = useState<XFlowDefine>();

  return tabKey === 0 ? (
    <FlowList
      onCurrentChaned={(item) => {
        setCurrent(item);
      }}
      onDesign={() => SetTabKey(1)}
    />
  ) : (
    <Design current={current} onBack={() => SetTabKey(0)} />
  );
};

export default SettingFlow;
