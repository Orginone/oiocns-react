import React, { useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './components/ApprovalNode';
import WorkFlowNode from './components/WorkFlowNode';
import CcNode from './components/CcNode';
import RootNode from './components/RootNode';
import ConcurrentNode from './components/ConcurrentNode';
import DeptWayNode from './components/DeptWayNode';
import ConditionNode from './components/ConditionNode';
import { dataType, FieldCondition, NodeData } from './processType';
import userCtrl from '@/ts/controller/setting';
import { getUuid } from '@/utils/tools';
import { ISpeciesItem } from '@/ts/core';
import { NodeType } from '../../enum';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  operateOrgId?: string;
  designOrgId?: string;
  isOpen: boolean;
  current?: NodeData;
  conditions?: FieldCondition[];
  onClose: () => void;
  species?: ISpeciesItem;
  disableIds: string[];
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
            <div>审核人：{userCtrl.getBelongName(record.createUser)}</div>
            <div>审核结果：{handleResult}</div>
            <div>审核意见：{record.comment}</div>
            <div>审核时间：{record.createTime}</div>
          </>
        );
      });
      // return (<div><div>审核人：{}</dev></div>)
    } else if (current?.belongId && current?.belongId != userCtrl.space.id) {
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
        case NodeType.START:
          return (
            <RootNode
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species}
            />
          );
        case NodeType.APPROVAL:
          return (
            <ApprovalNode
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species}
            />
          );
        case NodeType.CHILDWORK:
          return (
            <WorkFlowNode
              disableIds={disableIds}
              current={current}
              orgId={operateOrgId || designOrgId}
              species={species}
            />
          );
        case NodeType.CC:
          return <CcNode current={current} orgId={operateOrgId || designOrgId} />;
        case NodeType.CONDITIONS:
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
        case NodeType.CONCURRENTS:
          return <ConcurrentNode />;
        case NodeType.ORGANIZATIONAL:
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
