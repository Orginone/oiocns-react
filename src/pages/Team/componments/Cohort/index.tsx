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
import { ICohort, IGroup, ITarget, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { useHistory } from 'react-router-dom';
import { PersonColumns } from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
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
interface CohortType {
  item: any;
}
/**
 * 群组信息
 * @returns
 */
const CohortSetting: React.FC<CohortType> = (props: CohortType) => {
  const history = useHistory();
  const [key] = useCtrlUpdate(userCtrl);
  const parentRef = useRef<any>(null);
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [activeTab, setActiveTab] = useState<TabType>('members'); // 模态框
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>(); // 需要邀请的部门成员
  const [memberlistKey, setMemberlistKey] = useState<string>('member');
  if (!userCtrl.isCompanySpace) {
    history.goBack();
  }
  const info: ICohort = props.item;
  useEffect(() => {
    setMemberlistKey(info.id);
  }, [info]);

  const menu = [
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
            const success = await userCtrl.user.quitCohorts(info.id);
            if (success) {
              message.success(`退出${info.name}群组成功!`);
            } else {
              message.error('退出群组失败!');
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
      tab: `群组的成员`,
      key: 'members',
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
          if (await info.removeMember(item)) {
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
          title="群组详情"
          bordered
          size="middle"
          column={2}
          labelStyle={{ textAlign: 'center' }}
          contentStyle={{ textAlign: 'center' }}
          extra={[
            <Dropdown menu={{ items: menu }} placement="bottom" key="more">
              <EllipsisOutlined
                style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
                rotate={90}
              />
            </Dropdown>,
          ]}>
          <Descriptions.Item label="群组名称">{info.name}</Descriptions.Item>
          <Descriptions.Item label="群组编号">{info.target.code}</Descriptions.Item>
          <Descriptions.Item label="群组简介">{info.typeName}</Descriptions.Item>
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
            <CardOrTable<schema.XTarget>
              dataSource={[]}
              key={memberlistKey}
              rowKey={'id'}
              request={(page) => {
                return info.loadMembers({
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
          </div>
        </PageCard>
        <IndentityManage
          open={activeModal === 'indentity'}
          current={info}
          onCancel={() => setActiveModal('')}
        />
        <CreateTeamModal
          title="编辑"
          open={activeModal === 'edit'}
          current={info}
          handleOk={() => {
            setActiveModal('');
            userCtrl.changCallback();
          }}
          handleCancel={() => setActiveModal('')}
          typeNames={[info.typeName]}
        />
        {/* 邀请成员*/}
        <Modal
          title="邀请成员"
          destroyOnClose
          open={activeModal === 'addOne'}
          width={900}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectPerson) {
              const success = await info.pullMembers(
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

export default CohortSetting;
