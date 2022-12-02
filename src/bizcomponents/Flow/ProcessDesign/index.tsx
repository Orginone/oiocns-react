import React, { useState, useRef, useEffect, createContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import Node from '@/bizcomponents/Flow/Process/Node';
import cls from './index.module.less';
import LayoutPreview from '@/bizcomponents/Flow/Layout/LayoutPreview';
import LayoutHeader from '@/bizcomponents/Flow/Layout/LayoutHeader';
import FormProcessDesign from '@/bizcomponents/Flow/Layout/FormProcessDesign';
import { useAppwfConfig } from '@/module/flow/flow';
import useEventEmitter from '@/hooks/useEventEmitter';
import settingStore from '@/store/setting';
import DefaultProps from '@/module/flow/flow';
import { Modal } from 'antd';
import { title } from 'process';
type ProcessDesignProps = {
  [key: string]: any;
  backTable: () => void;
};
export const EventContext = createContext({} as { FlowSub: any });
/**
 * 空节点
 * @returns
 */
const ProcessDesign: React.FC<ProcessDesignProps> = ({ backTable }) => {
  // const [activeSelect,setactiveSelect] = useState('processDesign')
  const FlowSub = useEventEmitter();
  const activeSelect = 'processDesign';
  const previewRef: any = useRef();
  const design = useAppwfConfig((state: any) => state.design);
  const setForm = useAppwfConfig((state: any) => state.setForm);
  const setDesign = useAppwfConfig((state: any) => state.setDesign);
  const setOldDesign = useAppwfConfig((state: any) => state.setOldDesign);
  const { contionMes } = settingStore((state) => ({
    ...state,
  }));
  const preview = () => {
    previewRef.current?.preview(design);
  };
  const exit = () => {
    // setIsShowDialog(false)
  };
  useEffect(() => {
    console.log('ProcessDesign第一次render...');
    startDesign(obj);
  }, []); //这里传递了空数组
  // const defaultDesign = {
  //   name: '新建流程',
  //   code: 'code',
  //   formId: null,
  //   formName: '',
  //   appId: '',
  //   appName: '',
  //   remainHours: 240,
  //   resource: {
  //     nodeId: 'ROOT',
  //     parentId: null,
  //     type: 'ROOT',
  //     name: '发起人',
  //     children: {},
  //   },
  //   remark: '备注说明',
  // };
  const defaultDesign = {
    name: '新建流程',
    code: 'code',
    formId: null,
    formName: '',
    appId: '',
    appName: '',
    remainHours: 240,
    resource: {
      nodeId: 'ROOT',
      parentId: null,
      type: 'ROOT',
      name: '发起人',
      children: {
        nodeId: 'node_590719745693',
        parentId: 'ROOT',
        props: {},
        type: 'CONDITIONS',
        name: '条件分支',
        children: {
          nodeId: 'node_590719747331',
          parentId: 'node_590719745693',
          type: 'EMPTY',
          children: {},
        },
        branches: [
          {
            nodeId: 'node_590719745789',
            parentId: 'node_590719745693',
            type: 'CONDITION',
            conditions: [
              {
                pos: 1,
                paramKey: 'price',
                paramLabel: '金额',
                key: 'LTE',
                label: '≤',
                type: 'NUMERIC',
                val: 50000,
                valLabel: '',
              },
            ],
            name: '条件1',
          },
          {
            nodeId: 'node_590719746648',
            parentId: 'node_590719745693',
            type: 'CONDITION',
            conditions: [],
            name: '条件2',
          },
        ],
      },
    },
    remark: '备注说明',
  };

  const obj = {
    formId: '46547769841',
    business: '商品上架审核',
    field: [
      {
        name: '金额',
        code: 'price',
        type: 'NUMERIC',
        customId: 1,
        key: '价格',
      },
      {
        name: '项目名称',
        code: 'name',
        type: 'STRING',
        customId: 2,
      },
      {
        name: '出让方式',
        code: 'chulang',
        type: 'DICT',
        customId: 3,
        dict: [
          {
            name: '协议定价',
            code: '01',
          },
          {
            name: '挂牌',
            code: '02',
          },
          {
            name: '拍卖',
            code: '03',
          },
        ],
      },
    ],
    customId: 1,
    appId: '368453782260027392',
    appName: '测试流程应用',
    sourceId: '368453782268416000',
  };

  const startDesign = async (obj: any) => {
    let tempDesign;
    setForm(obj);
    DefaultProps.setFormFields(contionMes?.labels);
    if (obj.flow) {
      tempDesign = JSON.parse(JSON.stringify(obj.flow));
    } else {
      tempDesign = JSON.parse(JSON.stringify(defaultDesign));
    }
    setOldDesign(tempDesign);
    setDesign(tempDesign);
  };

  return (
    <>
      <LayoutHeader
        OnPreview={preview}
        OnExit={exit}
        titleName={contionMes?.name}
        backTable={() => {
          backTable();
        }}></LayoutHeader>
      <div className={cls['container']}>
        <EventContext.Provider value={{ FlowSub }}>
          <div className={cls['layout-body']}>
            {activeSelect === 'processDesign' && (
              <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
                <FormProcessDesign />
              </div>
            )}
          </div>
          {/* <Modal open={isShowDialog} footer={null}  maskClosable={false} width="100vw"  closable={false} title={<LayoutHeader OnPreview={preview} OnExit={exit}></LayoutHeader>} style={{maxWidth: "100vw",top: 0,paddingBottom: 0}}  bodyStyle={{ height: "calc(100vh - 55px )", overflowY: "auto"}}  >
    <div className={cls["layout-body"]}>
        {activeSelect === 'processDesign' && <div><FormProcessDesign/></div>}
    </div>
		</Modal> */}
          <LayoutPreview ref={previewRef} />
        </EventContext.Provider>
      </div>
    </>
  );
};

export default ProcessDesign;
