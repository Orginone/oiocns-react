import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Tooltip } from 'antd';
import userCtrl from '@/ts/controller/setting';
type ConcurrentNodeProps = {
  //默认操作组织id
  operateOrgId?: string;
  //起始节点belongId
  startNodeBelongId?: string;
  //node的空间id(后端获取)
  spaceId?: string;
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
  const [editable, setEditable] = useState<boolean>(true);
  const delNode = () => {
    props.onDelNode();
  };
  const copy = () => {
    props.onCopy();
  };
  const select = () => {
    props.onSelected();
  };
  const isEditable = (): boolean => {
    let editable = true;
    if (
      props.startNodeBelongId &&
      props.startNodeBelongId != '' &&
      props.startNodeBelongId != userCtrl.space.id
    ) {
      editable = false;
    }
    if (props.spaceId && props.spaceId != '' && props.spaceId != userCtrl.space.id) {
      editable = false;
    }
    return editable;
  };
  useEffect(() => {
    setEditable(isEditable());
  }, [props.startNodeBelongId, props.spaceId, userCtrl.space]);

  const footer = (
    <>
      {editable && (
        <div className={cls['btn']}>
          <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
        </div>
      )}
    </>
  );
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>
          {props.config.name ? props.config.name : '并行任务' + props.level}
        </span>
      </span>
      {/* 判断node.belongId==operateOrgId   ==>  startNodeBelongId==userCtrl.space.id || spaceId==userCtrl.space.id */}
      {(!props.config.belongId || props.config.belongId == props.operateOrgId) && (
        <span className={cls['option']}>
          <CopyOutlined
            style={{ fontSize: '12px', paddingRight: '5px' }}
            onClick={copy}
          />
          <CloseOutlined style={{ fontSize: '12px' }} onClick={delNode} />
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
    <div
      className={
        !props.config.belongId || props.config.belongId == props.operateOrgId
          ? cls['node']
          : cls['node-unEdit']
      }>
      {/* 判断node.belongId==operateOrgId   ==>  startNodeBelongId==userCtrl.space.id || spaceId==userCtrl.space.id */}
      <Tooltip
        title={<span>创建组织: {userCtrl.getBelongName(props.config.belongId)}</span>}
        placement="right">
        <div className={cls['node-body']}>
          <div className={cls['node-body-main']}>
            {nodeHeader}
            {nodeContent}
          </div>
        </div>
        <div className={cls['node-footer']}>{footer}</div>
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
