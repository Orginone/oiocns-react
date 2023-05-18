import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute, XProperty } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IPropClass } from '@/ts/core';
import { Card, Descriptions, Space, Typography } from 'antd';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';

interface IProps {
  current: IPropClass;
  property: XProperty;
}
/**
 * @description: 分类特性标准
 * @return {*}
 */
const Attribute: React.FC<IProps> = ({ current, property }) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [attributes, setAttributes] = useState<XAttribute[]>([]);
  useEffect(() => {
    current.loadPropAttributes(property).then((attrs) => {
      setAttributes(attrs);
      tforceUpdate();
    });
  }, []);
  const belong = orgCtrl.provider.user!.findShareById(property.belongId);
  const create = orgCtrl.provider.user!.findShareById(property.createUser);

  return (
    <>
      <Card bordered={false}>
        <Descriptions
          size="middle"
          title={
            <Typography.Title level={5}>属性[{property.name}]基本信息</Typography.Title>
          }
          bordered
          column={3}
          labelStyle={{ textAlign: 'center', color: '#606266', width: '160px' }}
          contentStyle={{ textAlign: 'center', color: '#606266' }}>
          <Descriptions.Item label="归属用户">
            <Space>
              <TeamIcon share={belong} />
              <strong>{belong.name}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            <Space>
              <TeamIcon share={create} />
              <strong>{create.name}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="属性类型">{property.valueType}</Descriptions.Item>
          <Descriptions.Item label="关联字典">
            <Space>
              <strong>{property.dict?.name}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {current.metadata.createTime}
          </Descriptions.Item>
          <Descriptions.Item contentStyle={{ textAlign: 'left' }} label="分类定义">
            {current.metadata.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <CardOrTable<XAttribute>
        rowKey={'id'}
        params={tkey}
        columns={[
          {
            title: '序号',
            valueType: 'index',
            width: 50,
          },
          {
            title: '表单名称',
            dataIndex: 'formName',
            width: 250,
            render: (_, record) => {
              return record.form.name;
            },
          },
          {
            title: '特性编号',
            dataIndex: 'code',
            key: 'code',
            width: 150,
          },
          {
            title: '特性名称',
            dataIndex: 'name',
            key: 'name',
            width: 250,
          },
          {
            title: '特性定义',
            dataIndex: 'remark',
            ellipsis: true,
            key: 'remark',
          },
        ]}
        showChangeBtn={false}
        dataSource={attributes}
      />
    </>
  );
};
export default Attribute;
