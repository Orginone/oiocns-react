import React from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './components/ApprovalNode';
import CcNode from './components/CcNode';
import ConditionNode from './components/ConditionNode';
import { AddNodeType, FieldCondition, NodeType } from './processType';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  operateOrgId?: string;
  isOpen: boolean;
  current?: NodeType;
  conditions?: FieldCondition[];
  onClose: () => void;
}

const FlowDrawer: React.FC<IProps> = ({
  isOpen,
  onClose,
  conditions,
  current,
  operateOrgId,
}) => {
  const Component = (current: any) => {
    if (current.belongId && operateOrgId && current.belongId != operateOrgId) {
      return <div>此节点由{current.belongId}创建,无法编辑</div>;
    } else {
      switch (current?.type) {
        case AddNodeType.APPROVAL:
          return <ApprovalNode current={current} />;
        case AddNodeType.CC:
          return <CcNode current={current} />;
        case AddNodeType.CONDITION:
          if (conditions) {
            return <ConditionNode current={current} conditions={conditions} />;
          }
          return <div>请先在字段设计中，设置条件字段</div>;
        default:
          return <div>暂无需要处理的数据</div>;
      }
    }
  };

  return current ? (
    <Drawer
      title={
        <>
          {(!current.belongId || !operateOrgId || current.belongId == operateOrgId) && (
            <Typography.Title
              editable={{
                onChange: (e: any) => {
                  current.name = e;
                },
              }}
              level={5}
              style={{ margin: 0 }}>
              {current.name}
            </Typography.Title>
          )}
          {current.belongId && operateOrgId && current.belongId != operateOrgId && (
            <div>{current.name}</div>
          )}
        </>
      }
      destroyOnClose
      placement="right"
      open={isOpen}
      onClose={() => onClose()}
      width={600}>
      {Component(current)}
    </Drawer>
  ) : (
    <></>
  );
};

export default FlowDrawer;
