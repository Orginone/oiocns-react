import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import { common } from 'typings/common';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { IGroup, ITarget, TargetType } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import TransferAgency from './TransferAgency';
import Description from '../Description';
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
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(userCtrl.company));
    }, 10);
  }, [current]);

  // 操作内容渲染函数
  const renderOperation = (item: XTarget): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    if (isRelationAdmin) {
      operations.push({
        key: 'moveOne',
        label: '移出' + item.typeName,
        onClick: async () => {
          if (selectMember && current) {
            if (await current.removeMember(item)) {
              tforceUpdate();
            }
          }
        },
      });
    }
    return operations;
  };

  // 标题tabs页
  const TitleItems = [
    {
      tab: (current?.typeName ?? '机构') + `成员`,
      key: 'deptPerpeos',
    },
    {
      tab: (current?.typeName ?? '机构') + `应用`,
      key: 'deptApps',
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
              添加成员
            </Button>
            {current.typeName == TargetType.Group && (
              <Button type="link" onClick={() => setActiveModal('joinGroup')}>
                加入集团
              </Button>
            )}
            {/* <Button type="link" onClick={() => history.push('/todo/org')}>
              查看申请
            </Button> */}
          </>
        )}
      </>
    );
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
            request={async (page: any) => await userCtrl.company.loadMembers(page)}
          />
        );
    }
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <Description
        title={
          <Typography.Title level={5}>{current.target.typeName}信息</Typography.Title>
        }
        current={current}
        extra={[]}
      />
      <div className={cls['pages-wrap']}>
        <PageCard
          bordered={false}
          tabList={TitleItems}
          tabBarExtraContent={renderBtns()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<XTarget>
              rowKey={'id'}
              params={tkey}
              request={async (page) => {
                return await current.loadMembers(page);
              }}
              operation={renderOperation}
              columns={getColumns()}
              parentRef={parentRef}
              showChangeBtn={false}
              dataSource={[]}
            />
          </div>
        </PageCard>
      </div>
      {/* 编辑机构角色 */}
      <IndentityManage
        isAdmin={isSuperAdmin}
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
          if (selectMember && selectMember.length > 0) {
            const ids = selectMember.map((e) => {
              return e.id;
            });
            if (await current.pullMembers(ids, selectMember[0].typeName)) {
              tforceUpdate();
              setActiveModal('');
            }
          }
          setSelectMember([]);
        }}>
        {getFindMember()}
      </Modal>
      {/* 申请加入集团*/}
      <Modal
        title="申请加入集团"
        destroyOnClose
        open={activeModal === 'joinGroup'}
        width={600}
        onCancel={() => {
          setActiveModal('');
          setSelectMember([]);
        }}
        onOk={async () => {
          selectMember.forEach(async (group) => {
            if (await (current as IGroup).applyJoinGroup(group.id)) {
              message.success('添加成功');
              userCtrl.changCallback();
              setSelectMember([]);
              setActiveModal('');
            }
          });
        }}>
        <SearchCompany searchCallback={setSelectMember} searchType={TargetType.Group} />
      </Modal>
      {/* 变更机构 */}
      <TransferAgency
        title={'转移机构'}
        open={activeModal === 'transfer'}
        handleOk={() => {
          tforceUpdate();
          setActiveModal('');
        }}
        onCancel={() => setActiveModal('')}
        current={current}
        needTransferUser={selectMember[0]}
      />
    </div>
  );
};

export default AgencySetting;
