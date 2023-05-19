import { Button, Modal } from 'antd';
import Layout from 'antd/lib/layout/layout';
import React, { useRef, useState } from 'react';

import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
import { useHistory } from 'react-router-dom';
import { schema } from '@/ts/base';
import CardOrTable from '@/components/CardOrTableComp';
import { CompanyColumn, PersonColumns } from '../../config/columns';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { TargetType } from '@/ts/core';
import PageCard from '@/components/PageCard';
import { common } from 'typings/common';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';

/**
 * 个人信息
 * @returns
 */
const PersonSetting: React.FC = () => {
  const history = useHistory();
  const parentRef = useRef<any>(null);
  const [key, refreshKey] = useCtrlUpdate(orgCtrl);
  const [tabKey, setTabKey] = useState<string>('friends');
  const [modalType, setModalType] = useState('');
  const [searchCallback, setSearchCallback] = useState<schema.XTarget[]>();
  const handleOk = async () => {
    if (await orgCtrl.user.applyJoin(searchCallback || [])) {
      refreshKey();
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
          await orgCtrl.user.removeMembers([item]);
          refreshKey();
        },
      },
    ];
  };

  return (
    <div className={cls['person-info-container']}>
      <Layout className={cls.container}>
        <PageCard
          key={key}
          bordered={false}
          tabList={TitleItems}
          onTabChange={(key) => setTabKey(key)}
          tabBarExtraContent={
            <>
              <Button type="link" onClick={() => setModalType('friend')}>
                添加好友
              </Button>
            </>
          }>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<schema.XTarget>
              dataSource={orgCtrl.user.members}
              showChangeBtn={false}
              parentRef={parentRef}
              params={tabKey}
              operation={renderOperation}
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
