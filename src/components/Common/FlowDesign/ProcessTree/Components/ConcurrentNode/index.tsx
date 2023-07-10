import React from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
type ConcurrentNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  level: any;
  isEdit: boolean;
};

/**
 * 并行节点
 * @returns
 */
const ConcurrentNode: React.FC<ConcurrentNodeProps> = (props: ConcurrentNodeProps) => {
  return (
    <div className={cls['node']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          <div className={cls['node-body-main-header']}>
            <span className={cls['title']}>
              <i className={cls['el-icon-s-operation']}></i>
              <span className={cls['name']}>{'并行任务' + props.level}</span>
            </span>
            {props.isEdit && (
              <span className={cls['option']}>
                <AiOutlineClose
                  style={{ fontSize: '15px', marginRight: '10px' }}
                  onClick={() => props.onDelNode()}
                />
              </span>
            )}
          </div>
          <div
            className={cls['node-body-main-content']}
            onClick={() => props.onSelected()}>
            <span>并行任务（同时进行）</span>
          </div>
        </div>
      </div>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          {props.isEdit && <InsertButton onInsertNode={props.onInsertNode} />}
        </div>
      </div>
    </div>
  );
};

ConcurrentNode.defaultProps = {
  config: {},
  level: 1,
};

export default ConcurrentNode;
