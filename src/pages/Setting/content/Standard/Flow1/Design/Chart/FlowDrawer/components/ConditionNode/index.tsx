import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { dataType, FieldCondition, NodeData } from '../../processType';
import ConditionGroupItemConfig from '../ConditionGroupItemConfig';

interface Iprops {
  current: NodeData;
  conditions?: FieldCondition[];
  orgId?: string;
}

/**
 * @description: 条件
 * @return {*}
 */

const ConditionNode: React.FC<Iprops> = (props) => {
  const [conditions, setConditions] = useState<FieldCondition[]>();

  useEffect(() => {
    setConditions(props.conditions);
  }, []);

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
    });
    setKey(key + 1);
  };

  return conditions ? (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>
      <ConditionGroupItemConfig currnet={props.current} conditions={conditions} />
    </div>
  ) : (
    <></>
  );
};
export default ConditionNode;
