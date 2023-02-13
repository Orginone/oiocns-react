import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import userCtrl from '@/ts/controller/setting';
interface IProps {
  current: NodeType;
  orgId?: string;
}
/**
 * @description: 并行节点
 * @return {*}
 */

const ConcurrentNode: React.FC<IProps> = (props) => {
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        {/* <div style={{ marginBottom: '10px' }}>
          <SelectOrg
            orgId={nodeOperateOrgId}
            onChange={onChange}
            readonly={true}></SelectOrg>
        </div> */}
        <div>并行任务(同时进行)</div>
      </div>
    </div>
  );
};
export default ConcurrentNode;
