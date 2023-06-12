import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { NodeModel, dataType, FieldCondition } from '../../../processType';
import orgCtrl from '@/ts/controller';
import DeptWayGroupItemConfig from '../DeptWayGroupItemConfig';
interface IProps {
  current: NodeModel;
  conditions?: FieldCondition[];
}
/**
 * @description: 组织节点
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
        val: orgCtrl.user.id,
        display:orgCtrl.user.id,
      });
    }
  }, []);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          <DeptWayGroupItemConfig currnet={props.current} conditions={conditions} />
        </div>
      </div>
    </div>
  );
};
export default DeptWayNode;
