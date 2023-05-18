import React, { useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Space,
  Typography,
} from 'antd';
import orgCtrl from '@/ts/controller';
import { ICompany, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import { GroupColumn, PersonColumns } from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { orgAuth } from '@/ts/core/public/consts';

interface IProps {
  current: ICompany;
}
/**
 * 单位信息
 * @returns
 */
const CompanySetting: React.FC<IProps> = ({ current }) => {
  const [ellipsis] = useState(true);
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate(current);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [activeTab, setActiveTab] = useState<string>('members');
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>(); // 需要邀请的部门成员

  // 标题tabs页
  const TitleItems = [
    {
      tab: `单位的成员`,
      key: 'members',
    },
    {
      tab: `加入的组织群`,
      key: 'groups',
    },
  ];

  const content = () => {
    switch (activeTab) {
      case 'members':
        return (
          <CardOrTable<schema.XTarget>
            dataSource={current.members}
            key="member"
            rowKey={'id'}
            parentRef={parentRef}
            operation={(item) => {
              return [
                {
                  key: 'remove',
                  label: '踢出',
                  onClick: async () => {
                    if (await current.removeMembers([item])) {
                      message.success('踢出成功');
                      forceUpdate();
                    }
                  },
                },
              ];
            }}
            columns={PersonColumns}
            showChangeBtn={false}
          />
        );
      case 'groups':
        return (
          <CardOrTable<schema.XTarget>
            key="groups"
            rowKey={'id'}
            pagination={false}
            dataSource={current.groups.map((i) => i.metadata)}
            defaultExpandAllRows={true}
            hideOperation={true}
            columns={GroupColumn}
            showChangeBtn={false}
          />
        );
    }
  };

  return (
    <div className={cls.companyContainer}>
      <Card bordered={false} className={cls['company-info-content']}>
        <Descriptions
          title={'当前单位'}
          bordered
          size="middle"
          column={2}
          labelStyle={{ textAlign: 'center', width: '200px' }}>
          <Descriptions.Item label="单位名称" contentStyle={{ textAlign: 'center' }}>
            <Space>
              {current.share.avatar && <Avatar src={current.share.avatar.thumbnail} />}
              <strong>{current.metadata.name}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label="社会统一信用代码"
            contentStyle={{ textAlign: 'center' }}>
            {current.metadata.code}
          </Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            <Typography.Paragraph
              ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: '更多' } : false}>
              {current.metadata.remark}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard
          key={key}
          bordered={false}
          activeTabKey={activeTab}
          tabList={TitleItems}
          onTabChange={(tabKey) => {
            setActiveTab(tabKey);
          }}
          tabBarExtraContent={
            <>
              <Button type="link" onClick={() => setActiveModal('indentity')}>
                角色设置
              </Button>
              {current.hasAuthoritys([orgAuth.RelationAuthId]) && (
                <>
                  <Button type="link" onClick={() => setActiveModal('addOne')}>
                    邀请成员
                  </Button>
                  <Button type="link" onClick={() => setActiveModal('joinGroup')}>
                    加入组织群
                  </Button>
                </>
              )}
            </>
          }>
          <div className={cls['page-content-table']} ref={parentRef}>
            {content()}
          </div>
        </PageCard>
      </div>
      <IndentityManage
        open={activeModal === 'indentity'}
        current={current}
        onCancel={() => setActiveModal('')}
      />
      {/* 邀请成员*/}
      <Modal
        title="邀请成员"
        destroyOnClose
        open={activeModal === 'addOne'}
        width={600}
        onCancel={() => setActiveModal('')}
        onOk={async () => {
          if (selectPerson) {
            if (await current.pullMembers(selectPerson)) {
              setActiveModal('');
              message.success('添加成功');
              orgCtrl.changCallback();
            } else {
              message.error('添加失败');
            }
          }
        }}>
        <SearchCompany searchCallback={setSelectPerson} searchType={TargetType.Person} />
      </Modal>
      {/* 申请加入组织群*/}
      <Modal
        title="申请加入组织群"
        destroyOnClose
        open={activeModal === 'joinGroup'}
        width={600}
        onCancel={() => setActiveModal('')}
        onOk={async () => {
          if (selectPerson) {
            selectPerson.forEach(async (group) => {
              if (await current.applyJoin([group])) {
                message.success('添加成功');
                forceUpdate();
                setActiveModal('');
              } else {
                message.error('添加失败');
              }
            });
          }
        }}>
        <SearchCompany searchCallback={setSelectPerson} searchType={TargetType.Group} />
      </Modal>
    </div>
  );
};

export default CompanySetting;
