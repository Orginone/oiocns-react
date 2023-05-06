import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { NodeType, dataType, FieldCondition } from '../../processType';
import orgCtrl from '@/ts/controller';
import DeptWayGroupItemConfig from '../DeptWayGroupItemConfig';
interface IProps {
  current: NodeType;
  orgId?: string;
  conditions?: FieldCondition[];
}
/**
 * @description: 并行节点
 * @return {*}
 */

const DeptWayNode: React.FC<IProps> = (props) => {
  // const [nodeOperateOrgId, setNodeOperateOrgId] = useState<string>(
  //   props.current.belongId || props.orgId || userCtrl.space.id,
  // );
  const [conditions, setConditions] = useState<FieldCondition[]>();
  // const onChange = (newValue: string) => {
  //   setNodeOperateOrgId(newValue);
  //   props.current.belongId = newValue;
  // };

  useEffect(() => {
    // if (!props.current.belongId) {
    //   setNodeOperateOrgId(props.orgId || userCtrl.space.id);
    //   props.current.belongId = props.orgId;
    // }
    setConditions(props.conditions);
    if (props.current?.conditions?.length == 0) {
      props.current?.conditions?.push({
        pos: props.current?.conditions.length + 1,
        paramKey: 'belongId',
        paramLabel: '组织',
        key: 'EQ',
        label: '=',
        type: dataType.BELONG,
        val: orgCtrl.user.metadata.id,
      });
    }
  }, []);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          <DeptWayGroupItemConfig
            orgId={props.orgId}
            currnet={props.current}
            conditions={conditions}
          />
        </div>
      </div>
    </div>
  );
};
export default DeptWayNode;
