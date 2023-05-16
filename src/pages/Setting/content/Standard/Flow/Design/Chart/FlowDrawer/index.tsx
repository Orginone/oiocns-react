import React, { useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './components/ApprovalNode';
import WorkFlowNode from './components/WorkFlowNode';
import CcNode from './components/CcNode';
import RootNode from './components/RootNode';
import ConcurrentNode from './components/ConcurrentNode';
import DeptWayNode from './components/DeptWayNode';
import ConditionNode from './components/ConditionNode';
import { AddNodeType, dataType, FieldCondition, NodeType } from './processType';
import orgCtrl from '@/ts/controller';
import { getUuid } from '@/utils/tools';
import { ISpeciesItem } from '@/ts/core';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
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
  species: ISpeciesItem;
  disableIds: string[];
  defaultEditable: boolean;
}

const FlowDrawer: React.FC<IProps> = ({
  isOpen,
  onClose,
  conditions,
  current,
  operateOrgId,
  designOrgId,
  species,
  disableIds,
}) => {
  const [key, setKey] = useState<string>();
  const Component = (current: any) => {
    if (current.task?.records?.length > 0) {
      return current.task?.records.map((record: any) => {
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
      // return (<div><div>审核人：{}</dev></div>)
    } else {
      switch (current?.type) {
        case AddNodeType.ROOT:
          return (
            <RootNode
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species}
            />
          );
        case AddNodeType.APPROVAL:
          return <ApprovalNode current={current} species={species as IWorkItem} />;
        case AddNodeType.CHILDWORK:
          return (
            <WorkFlowNode
              disableIds={disableIds}
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species}
            />
          );
        case AddNodeType.CC:
          return (
            <CcNode
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species as IWorkItem}
            />
          );
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
        case AddNodeType.CONCURRENTS:
          return (
            <ConcurrentNode
              current={current}
              orgId={operateOrgId || designOrgId}></ConcurrentNode>
          );
        case AddNodeType.ORGANIZATIONA:
          return (
            <DeptWayNode
              current={current}
              conditions={[{ label: '组织', value: 'belongId', type: dataType.BELONG }]}
              orgId={operateOrgId || designOrgId}></DeptWayNode>
          );
        default:
          return <div>暂无需要处理的数据</div>;
      }
    }
  };

  return current ? (
    <Drawer
      title={
        <div key={key}>
          {(!current.belongId || !operateOrgId || current.belongId == operateOrgId) && (
            <Typography.Title
              editable={{
                onChange: (e: any) => {
                  current.name = e;
                  setKey(getUuid());
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
        </div>
      }
      destroyOnClose
      placement="right"
      open={isOpen}
      onClose={() => onClose()}
      width={500}>
      {Component(current)}
    </Drawer>
  ) : (
    <></>
  );
};

export default FlowDrawer;
