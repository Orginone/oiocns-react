import React, { useState } from 'react';
import { Button } from 'antd';
import { dataType, FieldCondition, NodeModel } from '../../../../processType';
import ConditionItem from './ConditionItem';

interface Iprops {
  current: NodeModel;
  conditions?: FieldCondition[];
}

/**
 * @description: 条件
 * @return {*}
 */

const ConditionNode: React.FC<Iprops> = (props) => {
  const [key, setKey] = useState(0);

  /**点击添加的时候默认增加一行 */
  const addConditionGroup = () => {
    props.current?.conditions?.push({
      pos: props.current?.conditions.length + 1,
      paramKey: '',
      paramLabel: '',
      key: '',
      label: '',
      type: dataType.NUMERIC,
      val: undefined,
      display: '',
    });
    setKey(key + 1);
  };

  return props.conditions ? (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>
      <ConditionItem currnet={props.current} conditions={props.conditions} />
    </div>
  ) : (
    <></>
  );
};
export default ConditionNode;
