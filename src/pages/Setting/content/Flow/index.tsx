import Design from './Design';
import React, { useState } from 'react';
import { XFlowDefine } from '../../../../ts/base/schema';
import FlowList from './info';

enum TabType {
  'List' = '流程列表', //表格
  'Design' = '流程设计', //流程
}

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const [tabKey, SetTabKey] = useState(TabType.List);
  const [current, setCurrent] = useState<XFlowDefine>();

  return tabKey === TabType.List ? (
    <FlowList
      onCurrentChaned={(item) => {
        setCurrent(item);
      }}
      onDesign={() => SetTabKey(TabType.Design)}
    />
  ) : (
    <Design current={current} onBack={() => SetTabKey(TabType.List)} />
  );
};

export default SettingFlow;
