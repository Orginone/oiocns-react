import React, { useRef, useEffect } from 'react';
import cls from './index.module.less';
import LayoutPreview from '@/bizcomponents/Flow/Layout/LayoutPreview';
import FormProcessDesign from '@/bizcomponents/Flow/Layout/FormProcessDesign';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import useEventEmitter from '@/hooks/useEventEmitter';
import { EventContext } from '../const';
type ProcessDesignProps = {
  [key: string]: any;
  conditionData: { name: string };
  editorValue: string;
  designData: any;
};
// export const EventContext = createContext({} as { FlowSub: any; conditionData: {} });
/**
 * 空节点
 * @returns
 */
const ProcessDesign: React.FC<ProcessDesignProps> = ({
  conditionData,
  editorValue,
  designData,
}) => {
  const FlowSub = useEventEmitter();
  const activeSelect = 'processDesign';
  const previewRef: any = useRef();
  const design = useAppwfConfig((state: any) => state.design);
  const setForm = useAppwfConfig((state: any) => state.setForm);
  const setDesign = useAppwfConfig((state: any) => state.setDesign);
  const setOldDesign = useAppwfConfig((state: any) => state.setOldDesign);

  const preview = () => {
    previewRef.current?.preview(design);
  };
  const exit = () => {
    // setIsShowDialog(false)
  };
  useEffect(() => {
    startDesign();
  }, [designData]);

  const defaultDesign = {
    name: '新建流程',
    code: 'code',
    remark: '',
    belongId: '',
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
        // children: {
        //   nodeId: 'node_590719747331',
        //   parentId: 'node_590719745693',
        //   type: 'EMPTY',
        //   children: {},
        // },
      },
    },
  };

  const startDesign = async () => {
    let tempDesign;
    if (editorValue && editorValue !== '{}') {
      tempDesign = JSON.parse(editorValue);
      if (conditionData?.labels) {
        DefaultProps.setFormFields(conditionData?.labels);
      } else {
        DefaultProps.setFormFields(JSON.parse(tempDesign?.remark));
      }
    } else {
      console.log('designData_____', designData);
      if (!designData) {
        DefaultProps.setFormFields(conditionData?.labels);
        defaultDesign.remark = JSON.stringify(conditionData?.labels);
        defaultDesign.name = conditionData?.name;
        tempDesign = JSON.parse(JSON.stringify(defaultDesign));
      } else {
        DefaultProps.setFormFields(conditionData?.labels);
        defaultDesign.remark = JSON.stringify(conditionData?.labels);
        defaultDesign.name = conditionData?.name;
        tempDesign = designData;
      }
    }
    // setOldDesign(tempDesign);
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
