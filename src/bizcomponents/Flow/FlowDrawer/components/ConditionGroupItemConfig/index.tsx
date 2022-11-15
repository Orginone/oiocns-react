import React, { useState, useMemo } from 'react';
import { SettingOutlined,DeleteOutlined } from '@ant-design/icons';
import { Row, Button, Select, InputNumber, Input } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import DefaultProps,{ useAppwfConfig } from '@/module/flow/flow';
import cls from './index.module.less';
import ReactDOM from 'react-dom';
/* 
    条件
*/

const ConditionGroupItemConfig = () => {
  const selectedNode = useAppwfConfig((state:any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state:any) => state.setSelectedNode);
  const [key, setKey] = useState(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOk = () => {
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
  };

  const onChange = (e:any) =>{

  }


  return (
    <div>
    {selectedNode.conditions.map((condition:any,index:number)=> 
      <div key={index + '_g'} className={cls["group"]}>
        <div className={cls["group-header"]}>
            <div onClick={(e)=>{selectedNode.conditions.splice(index, 1);setSelectedNode(selectedNode); setKey(key+1)}} ><DeleteOutlined/></div>
            <span className={cls["group-name"]}>参数{index}</span>
            <div className={cls["group-cp"]}>
            <Select
              style={{ width: 120 }}
              placeholder="请选择参数"
              allowClear
              options={DefaultProps.getFormFields()}
            />
            <Select
              style={{ width: 100 }}
              placeholder="判断条件"
              allowClear
              options={DefaultProps.getFormFields()}
            />
            {condition.type=='NUMERIC' && <InputNumber style={{ width: 120 }} onChange={onChange} />}
            {condition.type=='DICT' &&  <Select
              style={{ width: 150 }}
              placeholder="请选择"
              allowClear
              options={DefaultProps.getFormFields()}
            />}
            {condition.type!='DICT' && condition.type!='NUMERIC' &&  <Input 
              style={{ width: 150 }}
              placeholder="请输入值"
              allowClear
            />}
            </div>
            <div className={cls["group-operation"]}>
            </div>
        </div>
        <div className={cls["group-content"]}>
        </div>
      </div>
    )}
  </div>
  );
};
export default ConditionGroupItemConfig;
