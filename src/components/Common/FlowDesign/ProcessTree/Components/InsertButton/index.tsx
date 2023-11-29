import { Popover, Button } from 'antd';
import * as ai from 'react-icons/ai';
import React, { useState } from 'react';
import cls from './index.module.less';
import { AddNodeType } from '@/components/Common/FlowDesign/processType';

type InsertButtonProps = {
  onInsertNode: Function;
  allowBranche?: boolean;
};

/**
 * 插入节点 对话框
 * @returns
 */
const InsertButton: React.FC<InsertButtonProps> = (props: any) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      title={<span>添加流程节点</span>}
      content={
        <div className={cls[`node-select`]}>
          <div
            onClick={() => {
              props.onInsertNode(AddNodeType.APPROVAL);
              setOpen(false);
            }}>
            <ai.AiOutlineTeam color="#3296fa" />
            <span>审批</span>
          </div>
          <div
            onClick={() => {
              props.onInsertNode(AddNodeType.CC);
              setOpen(false);
            }}>
            <ai.AiOutlineSend color="#ff943e" />
            <span>抄送</span>
          </div>
          {props.allowBranche && (
            <>
              <div
                onClick={() => {
                  props.onInsertNode(AddNodeType.CONDITION);
                  setOpen(false);
                }}>
                <ai.AiOutlineShareAlt color="#15bc83" />
                <span>条件审核</span>
              </div>
              <div
                onClick={() => {
                  props.onInsertNode(AddNodeType.CONCURRENTS);
                  setOpen(false);
                }}>
                <ai.AiOutlineCluster color="#718dff" />
                <span>同时审核</span>
              </div>
            </>
          )}
          <div
            onClick={() => {
              props.onInsertNode(AddNodeType.ORGANIZATIONA);
              setOpen(false);
            }}>
            <ai.AiOutlineApartment color="#7f6dac" />
            <span>组织网关</span>
          </div>
          <div
            onClick={() => {
              props.onInsertNode(AddNodeType.CHILDWORK);
              setOpen(false);
            }}>
            <ai.AiOutlineFork color="#af343e" />
            <span>其他办事</span>
          </div>
          <div
            onClick={() => {
              props.onInsertNode(AddNodeType.GATEWAY);
              setOpen(false);
            }}>
            <ai.AiOutlineForm color="#af343e" />
            <span>分流网关</span>
          </div>
        </div>
      }
      trigger="click">
      <Button
        type="primary"
        shape="circle"
        icon={<ai.AiOutlinePlus />}
        onClick={() => setOpen(true)}
      />
    </Popover>
  );
};

export default InsertButton;
