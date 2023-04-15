import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Dropdown,
  message,
  Modal,
  Space,
  Typography,
} from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import { ICompany, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import { GroupColumn, PersonColumns } from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IsRelationAdmin, IsSuperAdmin } from '@/utils/authority';

type ShowmodelType =
  | 'addOne'
  | 'edit'
  | 'post'
  | 'transfer'
  | 'indentity'
  | 'joinGroup'
  | '';
type TabType = 'members' | 'application';
interface IProps {
  current: ICompany;
}
/**
 * 单位信息
 * @returns
 */
const CompanySetting: React.FC<IProps> = ({ current }: IProps) => {
  const [key] = useObjectUpdate(current);
  const parentRef = useRef<any>(null);
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [activeTab, setActiveTab] = useState<TabType>('members'); // 模态框
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>(); // 需要邀请的部门成员
  const [ellipsis] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(userCtrl.company));
    }, 10);
  }, [current]);

  const menu = [
    { key: 'auth', label: '认证' },
    {
      key: 'quit',
      label: <span style={{ color: 'red' }}>退出</span>,
      onClick: async () => {
        Modal.confirm({
          title: `是否退出${current.name}?`,
          icon: <ExclamationCircleOutlined />,
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            const success = await userCtrl.user.quitCompany(current.id);
            if (success) {
              message.success(`退出${current.name}单位成功!`);
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
          角色设置
        </Button>
        {isRelationAdmin && (
          <>
            <Button type="link" onClick={() => setActiveModal('addOne')}>
              邀请成员
            </Button>
            <Button type="link" onClick={() => setActiveModal('joinGroup')}>
              加入集团
            </Button>
            {/* <Button type="link" onClick={() => history.push('/todo/org')}>
              查看申请
            </Button> */}
          </>
        )}
      </>
    );
  };
  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget) => {
    return [
      isSuperAdmin ? (
        {
          key: 'remove',
          label: '踢出',
          onClick: async () => {
            if (await userCtrl.space.removeMember(item)) {
              message.success('踢出成功');
              userCtrl.changCallback();
            }
          },
        }
      ) : (
        <></>
      ),
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
          labelStyle={{ textAlign: 'center', width: '200px' }}
          extra={[
            <Dropdown menu={{ items: menu }} placement="bottom" key="more">
              <EllipsisOutlined
                style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
                rotate={90}
              />
            </Dropdown>,
          ]}>
          <Descriptions.Item label="单位名称" contentStyle={{ textAlign: 'center' }}>
            <Space>
              {current.shareInfo.avatar && (
                <Avatar src={current.shareInfo.avatar.thumbnail} />
              )}
              <strong>{current.teamName}</strong>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label="社会统一信用代码"
            contentStyle={{ textAlign: 'center' }}>
            {current.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="团队简称" contentStyle={{ textAlign: 'center' }}>
            {current.name}
          </Descriptions.Item>
          <Descriptions.Item label="团队代号" contentStyle={{ textAlign: 'center' }}>
            {current.teamName}
          </Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            <Typography.Paragraph
              ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: '更多' } : false}>
              {current.target.team?.remark}
            </Typography.Paragraph>
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
              <CardOrTable<schema.XTarget>
                key="groups"
                rowKey={'id'}
                pagination={false}
                dataSource={[]}
                defaultExpandAllRows={true}
                request={async (page) => {
                  const targets = await current.getJoinedGroups();
                  return {
                    result: targets?.map((i) => i.target),
                    limit: page.limit,
                    offset: page.offset,
                    total: targets?.length ?? 0,
                  };
                }}
                hideOperation={true}
                columns={GroupColumn}
                showChangeBtn={false}
              />
            )}
          </div>
        </PageCard>
        <IndentityManage
          isAdmin={isSuperAdmin}
          open={activeModal === 'indentity'}
          current={userCtrl.space}
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

export default CompanySetting;
