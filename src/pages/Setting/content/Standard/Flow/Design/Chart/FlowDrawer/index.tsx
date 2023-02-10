import React, { useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './components/ApprovalNode';
import CcNode from './components/CcNode';
import ConditionNode from './components/ConditionNode';
import { AddNodeType, FieldCondition, NodeType } from './processType';
import userCtrl from '@/ts/controller/setting';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  operateOrgId?: string;
  designOrgId?: string;
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
  designOrgId,
}) => {
  const [title, setTitle] = useState<string>(current ? current.name : '');
  const Component = (current: any) => {
    if (current.belongId && operateOrgId && current.belongId != operateOrgId) {
      return (
        <div>
          此节点由{' '}
          <span style={{ color: 'blue' }}>
            {userCtrl.getBelongName(current.belongId)}
          </span>{' '}
          创建,无法编辑
        </div>
      );
    } else {
      switch (current?.type) {
        case AddNodeType.APPROVAL:
          return <ApprovalNode current={current} orgId={operateOrgId || designOrgId} />;
        case AddNodeType.CC:
          return <CcNode current={current} orgId={operateOrgId || designOrgId} />;
        case AddNodeType.CONDITION:
          if (conditions) {
            return (
              <ConditionNode
                current={current}
                conditions={conditions}
                orgId={operateOrgId || designOrgId}
              />
            );
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
        <div key={title}>
          {(!current.belongId || !operateOrgId || current.belongId == operateOrgId) && (
            <Typography.Title
              editable={{
                onChange: (e: any) => {
                  current.name = e;
                  setTitle(e);
                },
              }}
              level={5}
              style={{ margin: 0 }}>
              {title}
            </Typography.Title>
          )}
          {current.belongId && operateOrgId && current.belongId != operateOrgId && (
            <div>{title}</div>
          )}
        </div>
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
