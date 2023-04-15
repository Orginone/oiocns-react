import React from 'react';
import InsertButton from '../InsertButton';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Tooltip } from 'antd';
import userCtrl from '@/ts/controller/setting';
type ConcurrentNodeProps = {
  //默认操作组织id
  operateOrgId?: string;
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 并行节点
 * @returns
 */
const ConcurrentNode: React.FC<ConcurrentNodeProps> = (props: ConcurrentNodeProps) => {
  return (
    <div className={cls['node']}>
      <Tooltip
        title={<span>创建组织: {userCtrl.getBelongName(props.config.belongId)}</span>}
        placement="right">
        <div className={cls['node-body']}>
          <div className={cls['node-body-main']}>
            <div className={cls['node-body-main-header']}>
              <span className={cls['title']}>
                <i className={cls['el-icon-s-operation']}></i>
                <span className={cls['name']}>
                  {props.config.name ? props.config.name : '并行任务' + props.level}
                </span>
              </span>
              <span className={cls['option']}>
                <CopyOutlined
                  style={{ fontSize: '12px', paddingRight: '5px' }}
                  onClick={props.onCopy()}
                />
                <CloseOutlined style={{ fontSize: '12px' }} onClick={props.onDelNode()} />
              </span>
            </div>
            <div className={cls['node-body-main-content']} onClick={props.onSelected()}>
              <span>并行任务（同时进行）</span>
            </div>
          </div>
        </div>
        <div className={cls['node-footer']}>
          <div className={cls['btn']}>
            <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

ConcurrentNode.defaultProps = {
  config: {},
  level: 1,
  size: 0,
};

export default ConcurrentNode;
