import React, { useState } from 'react';
import { Button, message } from 'antd';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import ConditionGroupItemConfig from '@/bizcomponents/Flow/FlowDrawer/components/ConditionGroupItemConfig';

/**
 * @description: 条件
 * @return {*}
 */

const ConditionNode = () => {
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const [key, setKey] = useState(0);
  /**点击添加的时候默认增加一行 */
  const addConditionGroup = () => {
    if (DefaultProps.getFormFields().length > 0) {
      selectedNode.conditions?.push({
        pos: selectedNode.conditions.length + 1,
        paramKey: '',
        paramLabel: '',
        key: '',
        label: '',
        type: 'NUMERIC',
        val: null,
      });
    } else {
      message.warning('你还未设置条件，请到基本信息填写条件字段');
    }
    setSelectedNode(selectedNode);
    setKey(key + 1);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>

      {DefaultProps.getFormFields().length > 0 ? <ConditionGroupItemConfig /> : null}
    </div>
  );
};
export default ConditionNode;
