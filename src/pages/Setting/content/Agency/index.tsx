import React, { useState, useRef } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import { XTarget } from '@/ts/base/schema';
import { ITarget, TargetType } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import Description from '../../components/Description';
import cls from './index.module.less';
import AssignModal from '@/bizcomponents/AssignModal';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { CompanyColumn, PersonColumns } from '../../config/columns';
import SearchTarget from '@/bizcomponents/SearchCompany';
import { schema } from '@/ts/base';
interface IProps {
  current: ITarget;
}

/**
 * 内设机构
 * @returns
 */
const AgencySetting: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [key, forceUpdate] = useObjectUpdate(current);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人

  // 标题tabs页
  const TitleItems = () => {
    let items = [
      {
        tab: current.typeName + `成员`,
        key: 'members',
      },
    ];
    return items;
  };

  const getColumns = () => {
    if (current.typeName === TargetType.Group) {
      return CompanyColumn;
    }
    return PersonColumns;
  };

  const getFindMember = () => {
    switch (current.typeName) {
      case TargetType.Group:
        return (
          <SearchTarget
            searchCallback={setSelectMember}
            searchType={TargetType.Company}
          />
        );
      default:
        return (
          <AssignModal<schema.XTarget>
            placeholder="请输入用户账号"
            onFinish={setSelectMember}
            columns={PersonColumns}
            datasource={current.space.members}
          />
        );
    }
  };

  const content = () => {
    return (
      <CardOrTable<schema.XTarget>
        dataSource={current.members}
        key="member"
        rowKey={'id'}
        parentRef={parentRef}
        operation={(item) => {
          return current.hasRelationAuth()
            ? [
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
              ]
            : [];
        }}
        columns={getColumns()}
        showChangeBtn={false}
      />
    );
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <Description
        title={<Typography.Title level={5}>{current.typeName}信息</Typography.Title>}
        current={current}
        extra={[]}
      />
      <div className={cls['pages-wrap']}>
        <PageCard
          key={key}
          tabBarExtraContent={
            <>
              <Button type="link" onClick={() => setActiveModal('indentity')}>
                角色设置
              </Button>
              {current.hasRelationAuth() && (
                <>
                  <Button type="link" onClick={() => setActiveModal('addOne')}>
                    添加成员
                  </Button>
                </>
              )}
            </>
          }
          bordered={false}
          tabList={TitleItems()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']} ref={parentRef}>
            {content()}
          </div>
        </PageCard>
      </div>
      {/* 编辑机构角色 */}
      <IndentityManage
        open={activeModal === 'indentity'}
        current={current}
        onCancel={() => setActiveModal('')}
      />
      {/* 添加成员*/}
      <Modal
        title="添加成员"
        width={900}
        destroyOnClose
        open={activeModal === 'addOne'}
        onCancel={() => {
          setActiveModal('');
          setSelectMember([]);
        }}
        onOk={async () => {
          if (await current.pullMembers(selectMember)) {
            forceUpdate();
            setActiveModal('');
          }
          setSelectMember([]);
        }}>
        {getFindMember()}
      </Modal>
    </div>
  );
};
export default AgencySetting;
