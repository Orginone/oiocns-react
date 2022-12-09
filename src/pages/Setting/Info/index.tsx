import React, { useState } from 'react';
import { Button, Card, Descriptions, Dropdown, message, Modal } from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IProduct } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { useHistory } from 'react-router-dom';
import { ApplicationColumns, PersonColumns } from './config';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import EditInfo from './components/EditInfo';

type ShowmodelType = 'addOne' | 'edit' | 'post' | 'transfer' | 'indentity' | '';
type TabType = 'members' | 'application';
/**
 * 单位信息
 * @returns
 */
const SettingInfo: React.FC = () => {
  const history = useHistory();
  const [key] = useCtrlUpdate(userCtrl);
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [activeTab, setActiveTab] = useState<TabType>('members'); // 模态框
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>([]); // 需要邀请的部门成员
  const info = userCtrl.company.target;
  const menu = [
    { key: 'auth', label: '认证' },
    {
      key: 'quit',
      label: <span style={{ color: 'red' }}>退出</span>,
      onClick: async () => {
        Modal.confirm({
          title: `是否退出${info.name}?`,
          icon: <ExclamationCircleOutlined />,
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            const success = await userCtrl.user.quitCompany(info.id);
            if (success) {
              message.success(`退出${info.name}单位成功!`);
              userCtrl.setCurSpace(userCtrl.user.target.id);
            } else {
              message.error('退出单位失败!');
            }
          },
          onCancel() {},
        });
      },
    },
  ];
  // 标题tabs页
  const TitleItems = [
    {
      tab: `单位成员`,
      key: 'members',
    },
    {
      tab: `单位应用`,
      key: 'application',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Button type="link" onClick={() => setActiveModal('indentity')}>
          身份设置
        </Button>
        <Button type="link" onClick={() => setActiveModal('addOne')}>
          邀请成员
        </Button>
        <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button>
      </>
    );
  };
  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '踢出',
        onClick: async () => {
          if (await userCtrl.space.removeMember(item)) {
            message.success('踢出成功');
            userCtrl.changCallback();
          }
        },
      },
    ];
  };

  return (
    <div id={key} className={cls.companyContainer}>
      <Card bordered={false} className={cls['company-info-content']}>
        <Descriptions
          title={'当前单位'}
          bordered
          size="middle"
          column={2}
          labelStyle={{ textAlign: 'center' }}
          contentStyle={{ textAlign: 'center' }}
          extra={[
            <Button type="link" key="edit" onClick={() => setActiveModal('edit')}>
              编辑
            </Button>,
            <Dropdown menu={{ items: menu }} placement="bottom" key="more">
              <EllipsisOutlined
                style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
                rotate={90}
              />
            </Dropdown>,
          ]}>
          <Descriptions.Item label="单位名称">
            <strong>{info.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="社会统一信用代码">{info.code}</Descriptions.Item>
          <Descriptions.Item label="单位法人">{info.belongId}</Descriptions.Item>
          <Descriptions.Item label="团队简称">{info.team?.name}</Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            {info.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard
          bordered={false}
          tabList={TitleItems}
          onTabChange={(key) => {
            setActiveTab(key as TabType);
          }}
          tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']}>
            {activeTab === 'members' ? (
              <CardOrTable<schema.XTarget>
                dataSource={[]}
                key="member"
                rowKey={'id'}
                request={(page) => {
                  return userCtrl.space.loadMembers({
                    limit: page.limit,
                    offset: page.offset,
                    filter: '',
                  });
                }}
                operation={renderOperation}
                columns={PersonColumns}
                showChangeBtn={false}
              />
            ) : (
              <CardOrTable<IProduct>
                key="product"
                dataSource={[]}
                total={0}
                rowKey={'id'}
                hideOperation={true}
                columns={ApplicationColumns}
                showChangeBtn={false}
              />
            )}
          </div>
        </PageCard>
        <IndentityManage
          open={activeModal === 'indentity'}
          current={userCtrl.space}
          onCancel={() => setActiveModal('')}
        />
        <EditInfo
          title="编辑"
          open={activeModal === 'edit'}
          editData={info}
          handleOk={() => setActiveModal('')}
          handleCancel={() => setActiveModal('')}
        />
        {/* 邀请成员*/}
        <Modal
          title="邀请成员"
          destroyOnClose
          open={activeModal === 'addOne'}
          width={1024}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectPerson && userCtrl.company) {
              const success = await userCtrl.company.pullMembers(
                selectPerson.map((n) => n.id),
                selectPerson[0].typeName,
              );
              if (success) {
                message.success('添加成功');
                userCtrl.changCallback();
              } else {
                message.error('添加失败');
              }
            }
          }}>
          <AssignPosts searchFn={setSelectPerson} current={userCtrl.company} />
        </Modal>
      </div>
    </div>
  );
};

export default SettingInfo;
