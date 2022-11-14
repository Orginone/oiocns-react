import React, { useState } from 'react';
import { Typography } from 'antd';
import { useAppwfConfig } from '@/module/flow/flow';
import ReactDOM from 'react-dom';
/* 
    编辑名称
*/

interface Iprops {

}

const EditTitle = (props: Iprops) => {
  const selectedNode = useAppwfConfig((state:any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state:any) => state.setSelectedNode);
  const [key, setKey] = useState(0);
  
  console.log(selectedNode)
  const setEditTitle = (e:any)=>{
    
    selectedNode.name =e
    setSelectedNode(selectedNode)
    setKey(key+1)
  }
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
