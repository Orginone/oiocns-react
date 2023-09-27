import React, { useState } from 'react';
import { Tabs } from 'antd';
import { IForm } from '@/ts/core';
import FormSetting from './FormSetting';
import ItemSetting from './ItemSetting';
import RuleSetting from './RuleSetting/index';
import { XAttribute } from '@/ts/base/schema';

interface SettingsType {
  schemaRef: { current: { setValue: Function; getValue: Function } };
  current: IForm; //当前的表单
  canvasWidth: number;
  selectedFiled?: {
    id: string;
    name: string;
    valueType: string;
    $id: string;
    type?: string;
  }; //当前选中的 表单项
}
/* 表单设计侧边栏配置 */
const Settings: React.FC<SettingsType> = ({
  schemaRef,
  current,
  canvasWidth,
  selectedFiled,
}) => {
  const [activeKey, setActiveKey] = useState<string>(selectedFiled?.$id ? '2' : '1');

  const selectedAttr = current.attributes?.find((attr: { id: string }) => {
    const $id = selectedFiled?.$id;
    const id = $id?.split('/')?.at(-1);
    return attr.id === id;
  });

  /* 计算拖动宽度设置 */
  const renderWidth = () => {
    if (canvasWidth) {
      if (typeof canvasWidth == 'string') {
        return canvasWidth;
      }
      return `calc( 100% - 200px - ${canvasWidth}px)`;
    }
    return '40%';
  };

  return (
    <div
      style={{
        width: renderWidth(),
      }}>
      <Tabs
        defaultActiveKey={activeKey}
        style={{ paddingLeft: '10px', minWidth: '10px' }}
        onChange={(key) => setActiveKey(key)}
        items={[
          {
            label: `表单配置`,
            key: '1',
            children: (
              <FormSetting
                current={current}
                schemaRef={schemaRef}
                // comp={comp}
              />
            ),
          },
          {
            label: `组件配置`,
            key: '2',
            children: (
              <ItemSetting
                selectedFiled={
                  (selectedFiled?.type === 'object'
                    ? selectedFiled
                    : { ...selectedAttr, $id: selectedFiled?.$id }) as XAttribute & {
                    $id?: string;
                  }
                }
                current={current}
                schemaRef={schemaRef}
                superAuth={undefined}
              />
            ),
          },
          {
            label: `规则配置`,
            key: '3',
            children: (
              <RuleSetting
                current={current}
                activeKey={activeKey}
                selectedFiled={selectedAttr}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default React.memo(Settings);
