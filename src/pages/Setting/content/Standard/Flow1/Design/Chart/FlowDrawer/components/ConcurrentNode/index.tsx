import React from 'react';
import cls from './index.module.less';
/**
 * @description: 并行节点
 * @return {*}
 */

const ConcurrentNode: React.FC = () => {
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div>并行任务(同时进行)</div>
      </div>
    </div>
  );
};
export default ConcurrentNode;
