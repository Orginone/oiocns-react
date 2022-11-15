
import React, { useState, useRef, useEffect, createContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import Node from '@/bizcomponents/Flow/Process/Node';
import  cls from './index.module.less';
import LayoutPreview from '@/bizcomponents/Flow/Layout/LayoutPreview'
import LayoutHeader from '@/bizcomponents/Flow/Layout/LayoutHeader'
import FormProcessDesign from '@/bizcomponents/Flow/Layout/FormProcessDesign'
import { useAppwfConfig } from "@/module/flow/flow"
import useEventEmitter from '@/hooks/useEventEmitter';
import { Modal  } from 'antd';
type ProcessDesignProps = {
  [key: string]: any;
};
export const EventContext = createContext({} as { FlowSub: any });
/**
 * 空节点
 * @returns 
 */
const ProcessDesign: React.FC<ProcessDesignProps> = () => {
  // const [activeSelect,setactiveSelect] = useState('processDesign')
  const FlowSub = useEventEmitter();
  const activeSelect = 'processDesign'
  const previewRef: any = useRef()
  const design = useAppwfConfig((state: any) => state.design);
  const setDesign = useAppwfConfig((state: any) => state.setDesign);
  const setOldDesign = useAppwfConfig((state: any) => state.setOldDesign);
  const preview = ()=>{
    previewRef.current?.preview(design);
  }
  const exit = ()=>{
    // setIsShowDialog(false)
  }
  useEffect(() => {
    console.log("ProcessDesign第一次render...");
  }, []); //这里传递了空数组
  const defaultDesign = {
    name: "新建流程",
    code: 'code',
    formId: null,
    formName: "",
    appId: "",
    appName: "",
    remainHours: 240,
    resource: {
      nodeId: "ROOT",
      parentId: null,
      type: "ROOT",
      name: "发起人",
      children: {}
    },
    remark: "备注说明"
  }
  const obj = {
      "formId": "46547769841",
      "business": "商品上架审核",
      "field": [
          {
              "name": "金额",
              "code": "price",
              "type": "NUMERIC",
              "customId": 1,
              "key": "价格"
          },
          {
              "name": "项目名称",
              "code": "name",
              "type": "STRING",
              "customId": 2
          },
          {
              "name": "出让方式",
              "code": "chulang",
              "type": "DICT",
              "customId": 3,
              "dict": [
                  {
                      "name": "协议定价",
                      "code": "01"
                  },
                  {
                      "name": "挂牌",
                      "code": "02"
                  },
                  {
                      "name": "拍卖",
                      "code": "03"
                  }
              ]
          }
      ],
      "customId": 1,
      "appId": "368453782260027392",
      "appName": "测试流程应用",
      "sourceId": "368453782268416000"
  };
  // const setOldDesign = useAppwfConfig((state:any) => state.setOldDesign);
  // const setDesign = useAppwfConfig((state:any) => state.setDesign);
  // const setForm = useAppwfConfig((state:any) => state.setForm);
  // setOldDesign(JSON.parse(JSON.stringify(defaultDesign)));
	// setDesign(JSON.parse(JSON.stringify(defaultDesign)));
  // setForm(obj);
  // const [isShowDialog,setIsShowDialog] = useState(true)
  const isShowDialog = true
  const openDialog = (id: String) => {
    setOldDesign(JSON.parse(JSON.stringify(defaultDesign)));
    setDesign(JSON.parse(JSON.stringify(defaultDesign)));
  };
  return (
    
    <div className={cls["container"]} >
    <EventContext.Provider value={{ FlowSub }}>
      <div >
        <LayoutHeader OnPreview={preview} OnExit={exit}></LayoutHeader>
        <div className={cls["layout-body"]}>
          {activeSelect === 'processDesign' && <div style={{height: "calc(100vh - 250px )",overflowY: "auto"}}><FormProcessDesign/></div>}
        </div>
      </div>
		{/* <Modal open={isShowDialog} footer={null}  maskClosable={false} width="100vw"  closable={false} title={<LayoutHeader OnPreview={preview} OnExit={exit}></LayoutHeader>} style={{maxWidth: "100vw",top: 0,paddingBottom: 0}}  bodyStyle={{ height: "calc(100vh - 55px )", overflowY: "auto"}}  >
    <div className={cls["layout-body"]}>
        {activeSelect === 'processDesign' && <div><FormProcessDesign/></div>}
    </div>
		</Modal> */}
    <LayoutPreview ref={previewRef}/>
    </EventContext.Provider>
	</div>
  );
};

export default ProcessDesign;
