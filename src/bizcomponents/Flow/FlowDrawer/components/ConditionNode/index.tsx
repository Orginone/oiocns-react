import React, { useState } from 'react';
import { Button } from 'antd';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
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
    console.log('selectedNode.conditions', selectedNode.conditions);
    selectedNode.conditions?.push({
      pos: selectedNode.conditions.length + 1,
      paramKey: '',
      paramLabel: '',
      key: '',
      label: '',
      type: 'NUMERIC',
      val: null,
    });
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
      <ConditionGroupItemConfig />
    </div>
  );
};
export default ConditionNode;
