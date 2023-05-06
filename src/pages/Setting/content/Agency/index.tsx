import React, { useState, useRef, useEffect } from 'react';
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
import SearchCompany from '@/bizcomponents/SearchCompany';
import { schema } from '@/ts/base';
import { IsRelationAdmin, IsSuperAdmin } from '@/utils/authority';
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
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(current));
    }, 10);
  }, [current]);

  // 标题tabs页
  const TitleItems = () => {
    let items = [
      {
        tab: current.metadata.typeName + `成员`,
        key: 'members',
      },
    ];
    return items;
  };

  const getColumns = () => {
    if (current.metadata.typeName === TargetType.Group) {
      return CompanyColumn;
    }
    return PersonColumns;
  };

  const getFindMember = () => {
    switch (current.metadata.typeName) {
      case TargetType.Group:
        return (
          <SearchCompany
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
          return isSuperAdmin
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
        title={
          <Typography.Title level={5}>{current.metadata.typeName}信息</Typography.Title>
        }
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
              {isRelationAdmin && (
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
