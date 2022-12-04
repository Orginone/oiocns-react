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

  const addConditionGroup = () => {
    selectedNode.conditions.push({
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
      <div>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>
      <ConditionGroupItemConfig />
    </div>
  );
};
export default ConditionNode;
