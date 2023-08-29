import React, { useState } from 'react';
import { Tabs } from 'antd';
import { IForm } from '@/ts/core';
import FormSetting from './FormSetting';
import ItemSetting from './ItemSetting';
import RuleSetting from './RuleSetting/index';

interface SettingsType {
  current: IForm; //当前的表单
  selectedFiled?: { id: string; name: string; valueType: string }; //当前选中的 表单项
}
/* 表单设计侧边栏配置 */
const Settings: React.FC<SettingsType> = ({ current, selectedFiled }) => {
  const [activeKey, setActiceKey] = useState<string>('1');
  return (
    <>
      <Tabs
        defaultActiveKey={activeKey}
        style={{ paddingLeft: '10px' }}
        onChange={(key) => setActiceKey(key)}
        items={[
          {
            label: `表单配置`,
            key: '1',
            children: <FormSetting />,
          },
          {
            label: `组件配置`,
            key: '2',
            children: <ItemSetting />,
          },
          {
            label: `规则配置`,
            key: '3',
            children: <RuleSetting current={current} selectedFiled={selectedFiled} />,
          },
        ]}
      />
    </>
  );
};

export default React.memo(Settings);
