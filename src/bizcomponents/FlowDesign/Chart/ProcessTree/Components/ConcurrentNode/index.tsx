import React from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
type ConcurrentNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
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
  const delNode = () => {
    props.onDelNode();
  };
  const copy = () => {
    props.onCopy();
  };
  const select = () => {
    props.onSelected();
  };
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>{'并行任务' + props.level}</span>
      </span>
      {props.isEdit && (
        <span className={cls['option']}>
          <AiOutlineCopy
            style={{ fontSize: '15px', marginRight: '5px' }}
            onClick={copy}
          />
          <AiOutlineClose
            style={{ fontSize: '15px', marginRight: '10px' }}
            onClick={delNode}
          />
        </span>
      )}
    </div>
  );
  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      <span>并行任务（同时进行）</span>
    </div>
  );
  return (
    <div className={props.isEdit ? cls['node'] : cls['node-unEdit']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          {nodeHeader}
          {nodeContent}
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
