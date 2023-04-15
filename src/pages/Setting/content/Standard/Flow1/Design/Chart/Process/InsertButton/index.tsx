import { Popover, Tooltip, Button } from 'antd';
import {
  PlusOutlined,
  ShareAltOutlined,
  SendOutlined,
  ClusterOutlined,
  HighlightOutlined,
  ApartmentOutlined,
  ForkOutlined,
} from '@ant-design/icons';
import React from 'react';
import cls from './index.module.less';
import { NodeType } from '../../../enum';

type Iprops = {
  onInsertNode: Function;
};

/**
 * 插入节点 对话框
 * @returns
 */
const InsertButton: React.FC<Iprops> = ({ onInsertNode }) => {
  const content = (
    <div className={cls[`node-select`]}>
      <div
        onClick={() => {
          onInsertNode(NodeType.APPROVAL);
        }}>
        <HighlightOutlined className={cls[`node-approval`]} />
        <span>审批</span>
      </div>
      <div
        onClick={() => {
          onInsertNode(NodeType.CC);
        }}>
        <SendOutlined className={cls[`node-cc`]} />
        <span>抄送</span>
      </div>
      <div
        onClick={() => {
          onInsertNode(NodeType.CONDITIONS);
        }}>
        <ShareAltOutlined className={cls[`node-condittions`]} />
        <span>条件审核</span>
      </div>
      <div
        onClick={() => {
          onInsertNode(NodeType.CONCURRENTS);
        }}>
        <ClusterOutlined className={cls[`node-concurrents`]} />
        <span>同时审核</span>
      </div>
      <div
        onClick={() => {
          onInsertNode(NodeType.ORGANIZATIONAL);
        }}>
        <ApartmentOutlined className={cls[`node-organizational`]} />
        <span>组织网关</span>
      </div>
      <div
        onClick={() => {
          onInsertNode(NodeType.CHILDWORK);
        }}>
        <ForkOutlined className={cls[`node-childwork`]} />
        <span>外部办事</span>
      </div>
    </div>
  );
  return (
    <Popover
      placement="bottomLeft"
      title={<span>添加流程节点</span>}
      content={content}
      trigger="click">
      <Tooltip title="添加节点" placement="right">
        <Button type="primary" shape="circle" icon={<PlusOutlined />} />
      </Tooltip>
    </Popover>
  );
};

export default InsertButton;
