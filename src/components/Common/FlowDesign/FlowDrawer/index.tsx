import React, { useEffect, useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './Components/ApprovalNode';
import WorkFlowNode from './Components/WorkFlowNode';
import CcNode from './Components/CcNode';
import RootNode from './Components/RootNode';
import ConcurrentNode from './Components/ConcurrentNode';
import ConditionNode from './Components/ConditionNode';
import { AddNodeType, NodeModel } from '../processType';
import orgCtrl from '@/ts/controller';
import { IBelong, IWork } from '@/ts/core';
import { model } from '@/ts/base';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  define: IWork;
  isOpen: boolean;
  current: NodeModel;
  onClose: () => void;
}

const FlowDrawer: React.FC<IProps> = (props) => {
  const [conditions, setConditions] = useState<model.FieldModel[]>([]);

  useEffect(() => {
    if (props.define && props.current.type == AddNodeType.CONDITION) {
      const fields: model.FieldModel[] = [];
      props.define.primaryForms.forEach((f) => {
        fields.push(...f.fields);
      });
      setConditions(fields);
    }
  }, []);

  const Component = () => {
    const belong = orgCtrl.targets.find(
      (a) => a.id == props.define!.metadata.belongId,
    ) as IBelong;
    if (belong == undefined) return <></>;
    switch (props.current.type) {
      case AddNodeType.ROOT:
        return <RootNode current={props.current} belong={belong} />;
      case AddNodeType.APPROVAL:
        return <ApprovalNode current={props.current} belong={belong} />;
      case AddNodeType.CHILDWORK:
        return (
          <WorkFlowNode current={props.current} belong={belong} define={props.define} />
        );
      case AddNodeType.CC:
        return <CcNode current={props.current} belong={belong} />;
      case AddNodeType.CONDITION:
        return <ConditionNode current={props.current} conditions={conditions} />;
      case AddNodeType.CONCURRENTS:
        return <ConcurrentNode current={props.current} />;
      default:
        return <div>暂无需要处理的数据</div>;
    }
  };

  return (
    <Drawer
      title={
        <div>
          <Typography.Title
            editable={{
              onChange: (e: any) => {
                props.current.name = e;
              },
            }}
            level={5}
            style={{ margin: 0 }}>
            {props.current.name}
          </Typography.Title>
        </div>
      }
      open={props.isOpen}
      destroyOnClose
      placement="right"
      onClose={() => props.onClose()}
      width={500}>
      {Component()}
    </Drawer>
  );
};

export default FlowDrawer;
