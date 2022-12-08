import { Button, Card, Descriptions, Dropdown, message, Modal, Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import CardOrTable from '@/components/CardOrTableComp';
import { ICompany } from '@/ts/core';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PageCard from '@/components/PageCard';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { PersonColumns } from './config';
// import { UserOutlined } from '@ant-design/icons';

/**
 * 单位信息
 * @returns
 */
const SettingInfo: React.FC = () => {
  const [key] = useCtrlUpdate(userCtrl);
  const [compinfo, setCompInfo] = useState<ICompany>();
  const [persons, setPersons] = useState<schema.XTarget[]>([]); //部门成员
  async () => {
    if (compinfo) {
      setPersons(await compinfo.getPersons(false));
    }
  };
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
              const res = await userCtrl.User.quitCompany(compinfo?.target.id);
              if (res.success) {
                message.success(`退出${compinfo.target.name}单位成功!`);
                userCtrl.setCurSpace(userCtrl.User.target.id);
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
      key: 'deptPerpeos',
    },
    {
      tab: `单位应用`,
      key: 'deptApps',
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
          添加成员
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
    if (userCtrl.Company) {
      setCompInfo(userCtrl.Company);
    }
  }, [key]);

  // 信息标题
  const title = (
    <div className={cls['company-info-title']}>
      <div>
        <Title level={4}>当前单位</Title>
        {/* <Avatar size={48} icon={<UserOutlined />} /> */}
      </div>
      <div>
        <Button type="link">编辑</Button>
        <Dropdown menu={{ items: menu }} placement="bottom">
          <EllipsisOutlined
            style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
            rotate={90}
          />
        </Dropdown>
      </div>
    </div>
  );
  return (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}>
          <Descriptions.Item label="社会统一信用代码">
            {compinfo?.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="单位名称">{compinfo?.target.name}</Descriptions.Item>
          <Descriptions.Item label="单位法人">
            {compinfo?.target.belongId}
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">-</Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            {compinfo?.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard
          bordered={false}
          tabList={TitleItems}
          onTabChange={(key) => {}}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>
            <Tabs tabBarExtraContent={renderBtns()} />
            {compinfo && (
              <CardOrTable<schema.XTarget>
                dataSource={persons}
                rowKey={'id'}
                operation={renderOperation}
                columns={PersonColumns}
                showChangeBtn={false}
              />
            )}
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default SettingInfo;
