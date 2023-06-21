import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import { formatZhDate } from '@/utils/tools';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';

export const EntityColumns = (entity: schema.XEntity) => {
  const columns: ProFormColumnsType<any>[] = [];
  if (entity.belongId !== entity.id) {
    columns.push({
      title: '归属',
      dataIndex: 'belongId',
      readonly: true,
      render: () => <EntityIcon entityId={entity.belongId} showName />,
    });
  }
  if (entity.createUser !== entity.id) {
    columns.push({
      title: '创建人',
      dataIndex: 'createUser',
      readonly: true,
      render: () => <EntityIcon entityId={entity.createUser} showName />,
    });
  }
  columns.push({
    title: '创建时间',
    dataIndex: 'createTime',
    readonly: true,
    render: () => formatZhDate(entity.createTime),
  });
  if (entity.updateUser != entity.createUser) {
    columns.push({
      title: '更新人',
      dataIndex: 'updateUser',
      readonly: true,
      render: () => <EntityIcon entityId={entity.updateUser} showName />,
    });
  }
  if (entity.createTime != entity.updateTime) {
    columns.push({
      title: '更新时间',
      dataIndex: 'updateTime',
      readonly: true,
      render: () => formatZhDate(entity.updateTime),
    });
  }
  return columns;
};
