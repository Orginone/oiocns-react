import { Popover, Button } from 'antd';
import {
  AiOutlinePlus,
  AiOutlineShareAlt,
  AiOutlineSend,
  AiOutlineCluster,
  AiOutlineHighlight,
  AiOutlineApartment,
  AiOutlineFork,
} from 'react-icons/ai';
import React from 'react';
import cls from './index.module.less';
import { AddNodeType } from '@/bizcomponents/FlowDesign/processType';

type InsertButtonProps = {
  onInsertNode: Function;
  [key: string]: any;
};

/**
 * 插入节点 对话框
 * @returns
 */
const InsertButton: React.FC<InsertButtonProps> = (props: any) => {
  /**
   * 添加审批节点
   * */
  const addApprovalNode = () => {
    props.onInsertNode(AddNodeType.APPROVAL);
  };
  /**
   * 添加抄送节点
   * */
  const addCcNode = () => {
    props.onInsertNode(AddNodeType.CC);
  };
  /**
   * 添加条件审核
   * */
  const addConditionsNode = () => {
    props.onInsertNode(AddNodeType.CONDITION);
  };
  /**
   * 同时审核
   * */
  const addConcurrentsNode = () => {
    props.onInsertNode(AddNodeType.CONCURRENTS);
  };
  /**
   * 组织网关
   */
  const addDeptGateWayNode = () => {
    props.onInsertNode(AddNodeType.ORGANIZATIONA);
  };
  /**
   * 子流程
   */
  const addWorkFlowNode = () => {
    props.onInsertNode(AddNodeType.CHILDWORK);
  };

  const content = (
    <div className={cls[`node-select`]}>
      <div onClick={addApprovalNode}>
        <AiOutlineHighlight
          style={{
            color: 'rgb(50, 150, 250)',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>审批</span>
      </div>
      <div onClick={addCcNode}>
        <AiOutlineSend
          style={{
            color: 'rgb(255, 148, 62)',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>抄送</span>
      </div>
      <div onClick={addConditionsNode}>
        <AiOutlineShareAlt
          style={{
            color: 'rgb(21, 188, 131)',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>条件审核</span>
      </div>
      <div onClick={addConcurrentsNode}>
        <AiOutlineCluster
          style={{
            color: '#718dff',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>同时审核</span>
      </div>
      <div onClick={addDeptGateWayNode}>
        <AiOutlineApartment
          style={{
            color: '#7f6dac',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>组织网关</span>
      </div>
      <div onClick={addWorkFlowNode}>
        <AiOutlineFork
          style={{
            color: 'rgb(21, 188, 131)',
            fontSize: '20px',
            position: 'absolute',
            top: '18px',
            left: '25px',
          }}
        />
        <span>其他办事</span>
      </div>
    </div>
  );
  return (
    <Popover
      placement="bottomLeft"
      title={<span>添加流程节点</span>}
      content={content}
      trigger="click">
      <Button type="primary" shape="circle" icon={<AiOutlinePlus />} />
    </Popover>
  );
};

export default InsertButton;
