import React, { useRef, useEffect } from 'react';
import cls from './index.module.less';
import LayoutPreview from '@/bizcomponents/Flow/Layout/LayoutPreview';
import FormProcessDesign from '@/bizcomponents/Flow/Layout/FormProcessDesign';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import useEventEmitter from '@/hooks/useEventEmitter';
// import { EventContext } from '../const';
type ProcessDesignProps = {
  [key: string]: any;
  conditionData: { name: string; Fields: string; labels: [{}] };
  editorValue: string | null | undefined;
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
  // const design = useAppwfConfig((state: any) => state.design);
  const setDesign = useAppwfConfig((state: any) => state.setDesign);

  useEffect(() => {
    startDesign();
  }, [designData]);

  const defaultDesign = {
    name: '新建流程',
    code: 'code',
    remark: '',
    Fields: '',
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
    /** 这里走编辑的逻辑 */
    if (editorValue && editorValue !== '{}') {
      tempDesign = designData || JSON.parse(editorValue);
      if (conditionData?.labels) {
        // 编辑了之后值没有变
        tempDesign.remark = JSON.stringify(conditionData?.labels);
        tempDesign.Fields = conditionData?.Fields;
        DefaultProps.setFormFields(conditionData?.labels);
      } else {
        DefaultProps.setFormFields(JSON.parse(tempDesign?.remark));
      }
    } else {
      if (!designData) {
        DefaultProps.setFormFields(conditionData?.labels);
        defaultDesign.remark = JSON.stringify(conditionData?.labels);
        defaultDesign.name = conditionData?.name;
        defaultDesign.Fields = conditionData?.Fields;
        tempDesign = JSON.parse(JSON.stringify(defaultDesign));
      } else {
        DefaultProps.setFormFields(conditionData?.labels);
        defaultDesign.remark = JSON.stringify(conditionData?.labels);
        defaultDesign.Fields = conditionData?.Fields;
        defaultDesign.name = conditionData?.name;
        tempDesign = designData;
      }
    }
    // setOldDesign(tempDesign);
    setDesign(tempDesign);
  };

  return (
    <>
      <div className={cls['container']}>
        {/* conditionData */}
        {/* <EventContext.Provider value={{ FlowSub, conditionData }}> */}
        <div className={cls['layout-body']}>
          {activeSelect === 'processDesign' && (
            <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
              <FormProcessDesign />
            </div>
          )}
        </div>
        <LayoutPreview ref={previewRef} />
        {/* </EventContext.Provider> */}
      </div>
    </>
  );
};

export default ProcessDesign;
