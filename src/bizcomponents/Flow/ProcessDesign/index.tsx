import React, { useRef, useEffect, createContext } from 'react';
import cls from './index.module.less';
import LayoutPreview from '@/bizcomponents/Flow/Layout/LayoutPreview';
import LayoutHeader from '@/bizcomponents/Flow/Layout/LayoutHeader';
import FormProcessDesign from '@/bizcomponents/Flow/Layout/FormProcessDesign';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import { Button } from 'antd';
// {  DefaultProps }  报错临时处理
import useEventEmitter from '@/hooks/useEventEmitter';
type ProcessDesignProps = {
  [key: string]: any;
  conditionData: { name: string };
};
export const EventContext = createContext({} as { FlowSub: any; conditionData: {} });
/**
 * 空节点
 * @returns
 */
const ProcessDesign: React.FC<ProcessDesignProps> = ({ conditionData }) => {
  // const [activeSelect,setactiveSelect] = useState('processDesign')
  const FlowSub = useEventEmitter();
  const activeSelect = 'processDesign';
  const previewRef: any = useRef();
  const design = useAppwfConfig((state: any) => state.design);
  const setForm = useAppwfConfig((state: any) => state.setForm);
  const setDesign = useAppwfConfig((state: any) => state.setDesign);
  const setOldDesign = useAppwfConfig((state: any) => state.setOldDesign);

  const preview = () => {
    console.log('design', design);
    previewRef.current?.preview(design);
  };
  const exit = () => {
    // setIsShowDialog(false)
  };
  useEffect(() => {
    console.log('ProcessDesign第一次render...');
    startDesign(obj);
  }, []);

  const defaultDesign = {
    name: '新建流程',
    code: 'code',
    Remark: '',
    BelongId: '',
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
            conditions: [],
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
    DefaultProps.setFormFields(conditionData?.labels);
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
      {/* <Button
        onClick={() => {
          preview();
        }}>
        测一下预览
      </Button> */}
      {/* <LayoutHeader OnPreview={preview} OnExit={exit} titleName={conditionData?.name} /> */}
      <div className={cls['container']}>
        {/* conditionData */}
        <EventContext.Provider value={{ FlowSub, conditionData }}>
          <div className={cls['layout-body']}>
            {activeSelect === 'processDesign' && (
              <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
                <FormProcessDesign />
              </div>
            )}
          </div>
          <LayoutPreview ref={previewRef} />
        </EventContext.Provider>
      </div>
    </>
  );
};

export default ProcessDesign;
