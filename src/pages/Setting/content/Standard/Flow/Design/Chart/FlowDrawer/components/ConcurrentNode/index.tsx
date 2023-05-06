import React from 'react';
import cls from './index.module.less';
import { NodeType } from '../../processType';
interface IProps {
  current: NodeType;
  orgId?: string;
}
/**
 * @description: 并行节点
 * @return {*}
 */

const ConcurrentNode: React.FC<IProps> = (_props) => {
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div>并行任务(同时进行)</div>
      </div>
    </div>
  );
};
export default ConcurrentNode;
