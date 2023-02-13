import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { NodeType, dataType, FieldCondition } from '../../processType';
import SelectOrg from '@/pages/Setting/content/Standard/Flow/Comp';
import userCtrl from '@/ts/controller/setting';
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
        paramLabel: '部门',
        key: 'EQ',
        label: '=',
        type: dataType.BELONG,
        val: null,
      });
    }
  }, [props]);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          {/* <SelectOrg orgId={nodeOperateOrgId} onChange={onChange}></SelectOrg> */}
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
