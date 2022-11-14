import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Row, Button } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import { useAppwfConfig } from '@/module/flow/flow';
import cls from './index.module.less';

/* 
    条件
*/

const ConditionGroupItemConfig = () => {
  const selectedNode = useAppwfConfig((state:any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state:any) => state.setSelectedNode);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOk = () => {
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
  };


  return (
    <div>
    {selectedNode.conditions.map((condition:any,index:number)=> <div>参数{index}</div>)}
  </div>
  );
};
export default ConditionGroupItemConfig;
