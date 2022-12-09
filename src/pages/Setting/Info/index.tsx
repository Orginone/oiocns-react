import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Dropdown, message, Modal } from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICompany, IProduct } from '@/ts/core';
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
  const [compinfo, setCompInfo] = useState<ICompany>();
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [activeTab, setActiveTab] = useState<TabType>('members'); // 模态框
  const [persons, setPersons] = useState<schema.XTarget[]>([]); //部门成员
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>([]); // 需要邀请的部门成员
  const [ownProducts, setOwnProducts] = useState<IProduct[]>([]); //部门成员
  const getMembers = async (reload: boolean) => {
    if (compinfo) {
      setPersons(await compinfo.getPersons(reload));
    }
  };
  const getAppliction = async (reload: boolean) => {
    if (compinfo) {
      setOwnProducts(await compinfo.getOwnProducts(reload));
    }
  };
  useEffect(() => {
    if (userCtrl.Company) {
      setCompInfo(userCtrl.Company);
      getMembers(true);
      getAppliction(true);
    }
  }, [key]);
  console.log(ownProducts);
  const menu = [
    { key: 'auth', label: '认证' },
    {
      key: 'quit',
      label: <span style={{ color: 'red' }}>退出</span>,
      onClick: async () => {
        if (compinfo) {
          Modal.confirm({
            title: `是否退出${compinfo.target.name}?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
              const res = await userCtrl.user.quitCompany(compinfo?.target.id);
              if (res.success) {
                message.success(`退出${compinfo.target.name}单位成功!`);
                userCtrl.setCurSpace(userCtrl.user.target.id);
              } else {
                message.error('退出单位失败!' + res.msg);
              }
            },
            onCancel() {},
          });
        }
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
          if (compinfo) {
            const { success } = await compinfo.removePerson([item.id]);
            if (success) {
              message.success('踢出成功');
              userCtrl.changCallback();
            }
          }
        },
      },
    ];
  };
  useEffect(() => {
    if (userCtrl.company) {
      setCompInfo(userCtrl.company);
    }
  }, [key]);

  return (
    <div className={cls.companyContainer}>
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
            <strong>{compinfo?.target.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="社会统一信用代码">
            {compinfo?.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="单位法人">
            {compinfo?.target.belongId}
          </Descriptions.Item>
          <Descriptions.Item label="团队简称">
            {compinfo?.target.team?.name}
          </Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            {compinfo?.target.team?.remark}
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
                dataSource={persons}
                total={persons?.length}
                rowKey={'id'}
                operation={renderOperation}
                columns={PersonColumns}
                showChangeBtn={false}
              />
            ) : (
              <CardOrTable<IProduct>
                dataSource={ownProducts || []}
                total={ownProducts.length}
                rowKey={(record) => record.prod.id}
                hideOperation={true}
                columns={ApplicationColumns}
                showChangeBtn={false}
              />
            )}
          </div>
        </PageCard>
        <IndentityManage
          open={activeModal === 'indentity'}
          object={compinfo!}
          MemberData={persons}
          onCancel={() => setActiveModal('')}
        />
        <EditInfo
          title="编辑"
          open={activeModal === 'edit'}
          editData={compinfo?.target}
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
            if (selectPerson && compinfo) {
              const { success, msg } = await compinfo.pullPerson(selectPerson);
              if (success) {
                message.success('添加成功');
                userCtrl.changCallback();
              } else {
                message.error(msg);
              }
            }
          }}>
          <AssignPosts searchFn={setSelectPerson} memberData={[]} />
        </Modal>
      </div>
    </div>
  );
};

export default SettingInfo;
