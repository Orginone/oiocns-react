import { Button, Card, Descriptions, Space, Typography } from 'antd';
import React, { useState } from 'react';
import SpeciesForm from '@/bizcomponents/FormDesign';
import cls from '../index.module.less';
import PageCard from '@/components/PageCard';
import Attribute from './Attritube';
import orgCtrl from '@/ts/controller';
import { IForm } from '@/ts/core';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';

interface IProps {
  current: IForm;
}
const WorkForm: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('attr');
  const share = orgCtrl.provider.user!.findShareById(current.metadata.shareId);
  const belong = orgCtrl.provider.user!.findShareById(current.metadata.belongId);
  const create = orgCtrl.provider.user!.findShareById(current.metadata.createUser);

  const items = [
    {
      label: `表单特性`,
      tab: '表单特性',
      key: 'attr',
    },
    {
      label: `表单设计`,
      tab: '表单设计',
      key: 'form',
    },
  ];
  /** 操作按钮 */
  const renderButton = () => {
    switch (activeTab) {
      case 'attr':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增特性');
            }}>
            新增特性
          </Button>
        );
      default:
        return <></>;
    }
  };

  const content = () => {
    switch (activeTab) {
      case 'attr':
        return (
          <Attribute
            current={current!}
            modalType={modalType}
            recursionOrg={true}
            setModalType={setModalType}
          />
        );
      case 'form':
        return <SpeciesForm current={current!} />;
    }
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <div className={cls['pages-wrap']}>
        <Card bordered={false} className={cls['company-dept-content']}>
          <Descriptions
            size="middle"
            title={
              <Typography.Title level={5}>表单[{current.name}]基本信息</Typography.Title>
            }
            bordered
            column={3}
            labelStyle={{ textAlign: 'center', color: '#606266', width: '160px' }}
            contentStyle={{ textAlign: 'center', color: '#606266' }}>
            <Descriptions.Item label="共享用户">
              <Space>
                <TeamIcon share={share} />
                <strong>{share.name}</strong>
              </Space>
            </Descriptions.Item>
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
            <Descriptions.Item label="表单代码">
              {current.metadata.code}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {current.metadata.createTime}
            </Descriptions.Item>
            <Descriptions.Item contentStyle={{ textAlign: 'left' }} label="表单定义">
              {current.remark}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <PageCard
          bordered={false}
          activeTabKey={activeTab}
          tabList={items}
          onTabChange={(key) => {
            setActiveTab(key);
          }}
          tabBarExtraContent={renderButton()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
    </div>
  );
};

export default WorkForm;
