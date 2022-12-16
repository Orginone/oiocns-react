import React, { useState } from 'react';
import { Typography } from 'antd';
import processCtrl from '@/ts/controller/setting/processCtrl';

/**
 * @description: 编辑名称
 * @return {*}
 */

const EditTitle: React.FC = () => {
  const [key, setKey] = useState(0);
  const setEditTitle = (e: any) => {
    processCtrl.currentNode.name = e;
    processCtrl.setCurrentNode(processCtrl.currentNode);
    setKey(key + 1);
  };
  return (
    <Typography.Title
      editable={{ onChange: setEditTitle }}
      level={5}
      style={{ margin: 0 }}>
      {processCtrl?.currentNode?.name}
    </Typography.Title>
  );
};
export default EditTitle;
