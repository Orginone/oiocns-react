import React, { useState } from 'react';
import { Typography } from 'antd';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';

/**
 * @description: 编辑名称
 * @return {*}
 */

const EditTitle: React.FC = () => {
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const [key, setKey] = useState(0);

  const setEditTitle = (e: any) => {
    selectedNode.name = e;
    setSelectedNode(selectedNode);
    setKey(key + 1);
  };
  return (
    <Typography.Title
      editable={{ onChange: setEditTitle }}
      level={5}
      style={{ margin: 0 }}>
      {selectedNode.name}
    </Typography.Title>
  );
};
export default EditTitle;
