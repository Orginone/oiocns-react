import React, { useEffect, useState } from 'react';
import ApprovalNode from './Components/ApprovalNode';
import WorkFlowNode from './Components/WorkFlowNode';
import CcNode from './Components/CcNode';
import RootNode from './Components/RootNode';
import ConcurrentNode from './Components/ConcurrentNode';
import ConditionNode from './Components/ConditionNode';
import GatewayNode from './Components/GatewayNode';
import { AddNodeType, NodeModel } from '../processType';
import { IWork } from '@/ts/core';
import { model } from '@/ts/base';
import { Card } from 'antd';
import { TextBox } from 'devextreme-react';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  define: IWork;
  node: NodeModel;
  refresh: () => void;
}

const Config: React.FC<IProps> = (props) => {
  const belong = props.define.directory.target.space;
  const [conditions, setConditions] = useState<model.FieldModel[]>([]);
  useEffect(() => {
    if (props.define && props.node.type == AddNodeType.CONDITION) {
      const fields: model.FieldModel[] = [];
      props.define.primaryForms.forEach((f) => {
        fields.push(...f.fields);
      });
      setConditions(fields);
    }
  }, [props.define]);

  const loadContent = () => {
    switch (props.node.type) {
      case AddNodeType.ROOT:
        return (
          <RootNode
            work={props.define}
            current={props.node}
            belong={belong}
            refresh={props.refresh}
          />
        );
      case AddNodeType.APPROVAL:
        return (
          <ApprovalNode
            work={props.define}
            current={props.node}
            belong={belong}
            refresh={props.refresh}
          />
        );
      case AddNodeType.GATEWAY:
        return (
          <GatewayNode
            current={props.node}
            belong={belong}
            refresh={props.refresh}
            define={props.define}
          />
        );
      case AddNodeType.CHILDWORK:
        return (
          <WorkFlowNode
            current={props.node}
            belong={belong}
            define={props.define}
            refresh={props.refresh}
          />
        );
      case AddNodeType.CC:
        return <CcNode current={props.node} belong={belong} refresh={props.refresh} />;
      case AddNodeType.CONDITION:
        return (
          <ConditionNode
            current={props.node}
            conditions={conditions}
            refresh={props.refresh}
          />
        );
      case AddNodeType.CONCURRENTS:
        return <ConcurrentNode current={props.node} />;
      default:
        return <div>暂无需要处理的数据</div>;
    }
  };
  return (
    <Card
      title={
        <TextBox
          labelMode="floating"
          placeholder="节点名称*"
          value={props.node.name}
          onValueChange={(e) => {
            props.node.name = e;
            props.refresh();
          }}
        />
      }>
      {loadContent()}
    </Card>
  );
};

export default Config;
