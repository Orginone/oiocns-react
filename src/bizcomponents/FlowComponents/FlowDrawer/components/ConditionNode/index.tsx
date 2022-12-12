import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import ProcessCtrl, { ConditionCallBackTypes } from '@/ts/controller/setting/processCtrl';
import { conditionDataType, dataType } from '@/ts/controller/setting/processType';
import ConditionGroupItemConfig from '../ConditionGroupItemConfig';

/**
 * @description: 条件
 * @return {*}
 */

const ConditionNode = () => {
  const [conditionData, setConditionData] = useState<conditionDataType>({
    name: '',
    fields: '',
    labels: [],
  });
  const refreshUI = () => {
    console.log('监听的条件', ProcessCtrl.conditionData);
    setConditionData(ProcessCtrl.conditionData);
  };

  useEffect(() => {
    const id = ProcessCtrl.subscribePart(
      ConditionCallBackTypes.ConditionsData,
      refreshUI,
    );
    return () => {
      ProcessCtrl.unsubscribe(id);
    };
  }, []);

  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const [key, setKey] = useState(0);
  /**点击添加的时候默认增加一行 */
  const addConditionGroup = () => {
    if (conditionData?.labels && conditionData?.labels.length > 0) {
      ProcessCtrl.currentNode?.conditions?.push({
        pos: ProcessCtrl.currentNode?.conditions.length + 1,
        paramKey: '',
        paramLabel: '',
        key: '',
        label: '',
        type: dataType.NUMERIC,
        val: null,
      });
    } else {
      message.warning('你还未设置条件，请到基本信息填写条件字段');
    }
    setSelectedNode(selectedNode);
    ProcessCtrl.setCurrentNode(ProcessCtrl.currentNode);
    setKey(key + 1);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>

      {conditionData.labels.length > 0 ? <ConditionGroupItemConfig /> : null}
    </div>
  );
};
export default ConditionNode;
