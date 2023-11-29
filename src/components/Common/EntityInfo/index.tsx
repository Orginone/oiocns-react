import React, { useState } from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { IEntity } from '@/ts/core';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { formatZhDate } from '@/utils/tools';
interface IProps {
  entity: IEntity<schema.XEntity>;
  other?: any;
  extra?: any;
  column?: number;
}
/**
 * @description: 机构信息内容
 * @return {*}
 */
const EntityInfo: React.FC<IProps> = ({ entity, other, extra, column }: IProps) => {
  const [tkey] = useCtrlUpdate(entity);
  const [ellipsis] = useState(true);
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={`${entity.typeName}[${entity.name}]基本信息`}
        extra={extra}
        bordered
        colon
        column={column ?? 3}
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 120,
        }}
        key={tkey}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label="名称">
          <Typography.Paragraph
            copyable={{
              text: entity.id,
              tooltips: [entity.id, '复制成功'],
            }}>
            <EntityIcon entity={entity.metadata} showName />
          </Typography.Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="代码">
          <Typography.Paragraph
            copyable={{
              text: entity.code,
              tooltips: [entity.code, '复制成功'],
            }}>
            {entity.code}
          </Typography.Paragraph>
        </Descriptions.Item>
        {other}
        <Descriptions.Item label="类型">{entity.typeName}</Descriptions.Item>
        {'storeId' in entity.metadata && (
          <Descriptions.Item label="当前数据核">
            <EntityIcon entityId={entity.metadata.storeId as string} showName />
          </Descriptions.Item>
        )}
        {entity.metadata.belongId != entity.id && (
          <Descriptions.Item label="归属">
            <EntityIcon entityId={entity.metadata.belongId} showName />
          </Descriptions.Item>
        )}
        {entity.metadata.createUser != entity.id && (
          <Descriptions.Item label="创建人">
            <EntityIcon entityId={entity.metadata.createUser} showName />
          </Descriptions.Item>
        )}
        <Descriptions.Item label="创建时间">
          {formatZhDate(entity.metadata.createTime)}
        </Descriptions.Item>
        {entity.metadata.createUser != entity.metadata.updateUser && (
          <>
            <Descriptions.Item label="更新人">
              <EntityIcon entityId={entity.metadata.updateUser} showName />
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {formatZhDate(entity.metadata.updateTime)}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
      {entity.remark && entity.remark.length > 0 && (
        <Descriptions
          bordered
          colon
          column={column ?? 3}
          labelStyle={{
            textAlign: 'left',
            color: '#606266',
            width: 120,
          }}
          contentStyle={{ textAlign: 'left', color: '#606266' }}>
          <Descriptions.Item label="描述信息" span={column ?? 3}>
            <Typography.Paragraph
              ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: '更多' } : false}>
              {entity.remark}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};
export default EntityInfo;
