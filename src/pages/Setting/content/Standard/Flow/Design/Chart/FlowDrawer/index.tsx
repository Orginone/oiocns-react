import React, { useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './components/ApprovalNode';
import WorkFlowNode from './components/WorkFlowNode';
import CcNode from './components/CcNode';
import RootNode from './components/RootNode';
import ConcurrentNode from './components/ConcurrentNode';
import DeptWayNode from './components/DeptWayNode';
import ConditionNode from './components/ConditionNode';
import { AddNodeType, NodeType } from './processType';
import orgCtrl from '@/ts/controller';
import { getUuid } from '@/utils/tools';
import { IWorkDefine } from '@/ts/core/thing/base/work';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  isOpen: boolean;
  current: NodeType;
  onClose: () => void;
  define: IWorkDefine;
  defaultEditable: boolean;
}

const FlowDrawer: React.FC<IProps> = (props) => {
  const [key, setKey] = useState<string>();
  const Component = () => {
    if (props.current.task?.records?.length > 0) {
      return props.current.task?.records.map((record: any) => {
        let handleResult = '通过';
        if (record.status >= 200) {
          handleResult = '不通过';
        }
        return (
          <>
            <div>
              审核人：{orgCtrl.provider.user?.findShareById(record.createUser).name}
            </div>
            <div>审核结果：{handleResult}</div>
            <div>审核意见：{record.comment}</div>
            <div>审核时间：{record.createTime}</div>
          </>
        );
      });
    } else {
      switch (props.current.type) {
        case AddNodeType.ROOT:
          return <RootNode current={props.current} work={props.define.workItem} />;
        case AddNodeType.APPROVAL:
          return <ApprovalNode current={props.current} work={props.define.workItem} />;
        case AddNodeType.CHILDWORK:
          return <WorkFlowNode current={props.current} work={props.define.workItem} />;
        case AddNodeType.CC:
          return <CcNode current={props.current} work={props.define.workItem} />;
        case AddNodeType.CONDITION:
          return <ConditionNode current={props.current} />;
        case AddNodeType.CONCURRENTS:
          return <ConcurrentNode current={props.current} />;
        case AddNodeType.ORGANIZATIONA:
          return <DeptWayNode current={props.current} />;
        default:
          return <div>暂无需要处理的数据</div>;
      }
    }
  };

  return (
    <Drawer
      title={
        <div key={key}>
          <Typography.Title
            editable={{
              onChange: (e: any) => {
                props.current.name = e;
                setKey(getUuid());
              },
            }}
            level={5}
            style={{ margin: 0 }}>
            {props.current.name}
          </Typography.Title>
        </div>
      }
      destroyOnClose
      placement="right"
      open={props.isOpen}
      onClose={() => props.onClose()}
      width={500}>
      {Component()}
    </Drawer>
  );
};

export default FlowDrawer;
