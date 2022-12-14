import React from 'react';
import InsertButton from '../InsertButton';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import cls from './index.module.less';
type ConcurrentNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  [key: string]: any;
  // config?: any,
  //  _disabled?: boolean,
  // level?: number,
  // //条件数
  // size?:number
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
  const footer = (
    <div className={cls['btn']}>
      <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
    </div>
  );
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>
          {props.config.name ? props.config.name : '并行任务' + props.level}
        </span>
      </span>
      <span className={cls['option']}>
        <CopyOutlined style={{ fontSize: '12px', paddingRight: '5px' }} onClick={copy} />
        <CloseOutlined style={{ fontSize: '12px' }} onClick={delNode} />
      </span>
    </div>
  );
  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      <span>并行任务（同时进行）</span>
    </div>
  );
  return (
    <div className={cls['node']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          {nodeHeader}
          {nodeContent}
        </div>
      </div>

      <div className={cls['node-footer']}>{footer}</div>
    </div>
  );
};

ConcurrentNode.defaultProps = {
  config: {},
  level: 1,
  size: 0,
};

export default ConcurrentNode;
