import React, { useRef, useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Dropdown,
  message,
  Modal,
  Space,
} from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IGroup, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { useHistory } from 'react-router-dom';
import { CompanyColumn, PersonColumns } from './config';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import CreateTeamModel from '@/bizcomponents/CreateTeam';
import SearchCompany from '@/bizcomponents/SearchCompany';

type ShowmodelType =
  | 'addOne'
  | 'edit'
  | 'post'
  | 'transfer'
  | 'indentity'
  | 'joinGroup'
  | '';
type TabType = 'members' | 'application';
/**
 * 单位信息
 * @returns
 */
const SettingInfo: React.FC = () => {
  const history = useHistory();
  const [key] = useCtrlUpdate(userCtrl);
  const parentRef = useRef<any>(null);
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [activeTab, setActiveTab] = useState<TabType>('members'); // 模态框
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>(); // 需要邀请的部门成员
  const [dataSource, setDataSource] = useState<IGroup[]>([]); // 加入的集团
  const info = userCtrl.company.target;

  useEffect(() => {
    userCtrl.company.getJoinedGroups(true).then((e) => {
      setDataSource(e);
    });
  }, [key]);

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
      tab: `单位的成员`,
      key: 'members',
    },
    {
      tab: `加入的集团`,
      key: 'groups',
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
        <Button type="link" onClick={() => setActiveModal('joinGroup')}>
          加入集团
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
    <div key={key} className={cls.companyContainer}>
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
            <Space>
              {userCtrl.company?.avatar && (
                <Avatar src={userCtrl.company?.avatar?.thumbnail} />
              )}
              <strong>{info.name}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="单位法人">{info.belongId}</Descriptions.Item>
          <Descriptions.Item label="社会统一信用代码">{info.code}</Descriptions.Item>
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
          <div className={cls['page-content-table']} ref={parentRef}>
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
                parentRef={parentRef}
                operation={renderOperation}
                columns={PersonColumns}
                showChangeBtn={false}
              />
            ) : (
              <CardOrTable<IGroup>
                key="groups"
                rowKey={'id'}
                pagination={false}
                defaultExpandAllRows={true}
                dataSource={dataSource}
                hideOperation={true}
                columns={CompanyColumn}
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
        <CreateTeamModel
          title="编辑"
          open={activeModal === 'edit'}
          current={userCtrl.company}
          handleOk={() => {
            setActiveModal('');
            userCtrl.changCallback();
          }}
          handleCancel={() => setActiveModal('')}
          typeNames={[userCtrl.company.target.typeName]}
        />
        {/* 邀请成员*/}
        <Modal
          title="邀请成员"
          destroyOnClose
          open={activeModal === 'addOne'}
          width={900}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectPerson && userCtrl.company) {
              const success = await userCtrl.company.pullMembers(
                selectPerson.map((n) => n.id),
                selectPerson[0].typeName,
              );
              if (success) {
                setActiveModal('');
                message.success('添加成功');
                userCtrl.changCallback();
              } else {
                message.error('添加失败');
              }
            }
          }}>
          {/* <AssignPosts searchFn={setSelectPerson} source={userCtrl.company} /> */}
          <SearchCompany
            searchCallback={setSelectPerson}
            searchType={TargetType.Person}
          />
        </Modal>
        {/* 申请加入集团*/}
        <Modal
          title="申请加入集团"
          destroyOnClose
          open={activeModal === 'joinGroup'}
          width={600}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectPerson && userCtrl.company) {
              selectPerson.forEach(async (group) => {
                const success = await userCtrl.company.applyJoinGroup(group.id);
                if (success) {
                  message.success('添加成功');
                  userCtrl.changCallback();
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
    </div>
  );
};

export default SettingInfo;
