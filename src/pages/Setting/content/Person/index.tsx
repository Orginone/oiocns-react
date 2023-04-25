import { Button, Card, Descriptions, message, Modal, Typography } from 'antd';
import Layout from 'antd/lib/layout/layout';
import React, { useRef, useState } from 'react';

import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { useHistory } from 'react-router-dom';
import { schema } from '@/ts/base';
import CardOrTable from '@/components/CardOrTableComp';
import { CompanyColumn, PersonColumns } from '../../config/columns';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { TargetType } from '@/ts/core';
import PageCard from '@/components/PageCard';
import { common } from 'typings/common';

/**
 * 个人信息
 * @returns
 */
const PersonSetting: React.FC = () => {
  const history = useHistory();
  const parentRef = useRef<any>(null);
  const [tabKey, setTabKey] = useState<string>('friends');
  const [modalType, setModalType] = useState('');
  const [searchCallback, setSearchCallback] = useState<schema.XTarget[]>();
  const handleOk = async () => {
    let success = false;
    if (searchCallback && searchCallback.length > 0) {
      if (searchCallback && searchCallback.length > 0) {
        searchCallback.forEach(async (item) => {
          success = await orgCtrl.user.applyFriend(item);
        });
      }
    }
    if (success) {
      message.success('操作成功!');
      setModalType('');
    }
  };
  // 标题tabs页
  const TitleItems = [
    {
      tab: `我的好友`,
      key: 'friends',
    },
  ];
  // 信息内容
  const content = (
    <div className={cls['person-info-info']}>
      <Card bordered={false}>
        <Descriptions
          bordered
          size="middle"
          title={'个人信息'}
          column={2}
          extra={[
            <Button type="link" key="updatePassword">
              修改密码
            </Button>,
          ]}>
          <Descriptions.Item label="昵称">
            <TeamIcon share={orgCtrl.user.shareInfo} size={40} preview={true} />
            {orgCtrl.user.name}
          </Descriptions.Item>
          <Descriptions.Item label="姓名">{orgCtrl.user.teamName}</Descriptions.Item>
          <Descriptions.Item label="账号">
            <Typography.Paragraph copyable>
              {orgCtrl.user.target.code}
            </Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">
            {orgCtrl.user.target.team?.code}
          </Descriptions.Item>
          <Descriptions.Item label="座右铭">
            {orgCtrl.user.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    return [
      {
        key: 'openchats',
        label: '打开会话',
        onClick: async () => {
          history.push('/chat');
        },
      },
      {
        key: 'remove',
        label: '移除',
        onClick: async () => {
          await orgCtrl.user.removeMember(item);
        },
      },
    ];
  };

  return (
    <div className={cls['person-info-container']}>
      <Layout className={cls.container}>{content}</Layout>
      <Layout className={cls.container}>
        <PageCard
          bordered={false}
          tabList={TitleItems}
          onTabChange={(key) => setTabKey(key)}
          tabBarExtraContent={
            <>
              <Button type="link" onClick={() => history.push('/todo/org')}>
                查看申请记录
              </Button>
              <Button type="link" onClick={() => setModalType('friend')}>
                添加好友
              </Button>
            </>
          }>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<schema.XTarget>
              dataSource={[]}
              showChangeBtn={false}
              parentRef={parentRef}
              params={tabKey}
              operation={renderOperation}
              request={async (page) => {
                return await orgCtrl.user.loadMembers(page);
              }}
              columns={tabKey === 'companys' ? CompanyColumn : PersonColumns}
              rowKey={'id'}
            />
          </div>
        </PageCard>
        <Modal
          title={'添加好友'}
          destroyOnClose={true}
          open={modalType === 'friend'}
          onOk={handleOk}
          onCancel={() => setModalType('')}
          width={670}>
          {' '}
          <div>
            <SearchCompany
              searchCallback={setSearchCallback}
              searchType={TargetType.Person}
            />
          </div>
        </Modal>
      </Layout>
    </div>
  );
};

export default PersonSetting;
