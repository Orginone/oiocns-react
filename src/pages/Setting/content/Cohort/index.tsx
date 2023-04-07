import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { ICohort } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { PersonColumns } from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import AssignModal from '@/bizcomponents/AssignModal';
import Description from '../Description';
import chatCtrl from '@/ts/controller/chat';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';
import { IsRelationAdmin, IsSuperAdmin } from '@/utils/authority';
import setting from '@/ts/controller/setting';
interface IProps {
  current: ICohort;
}
/**
 * 群组信息
 * @returns
 */
const CohortSetting: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate(current);
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<schema.XTarget[]>(); // 需要邀请的部门成员

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(userCtrl.company));
    }, 10);
  }, [current]);

  // 标题tabs页
  const TitleItems = [
    {
      tab: `群组成员`,
      key: 'members',
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
          <Button type="link" onClick={() => setActiveModal('addOne')}>
            邀请成员
          </Button>
        )}
        {/* <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button> */}
      </>
    );
  };

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    if (item.id != userCtrl.user.id) {
      operations.push(
        ...[
          {
            key: 'addFriend',
            label: '添加好友',
            onClick: async () => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '是否申请添加好友',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await userCtrl.user?.applyFriend(item);
                  message.success('发起申请成功');
                },
              });
            },
          },
          {
            key: 'enterChat',
            label: '打开会话',
            onClick: async () => {
              chatCtrl.setCurrent(
                chatCtrl.findTargetChat(
                  item,
                  setting.user.id,
                  setting.user.teamName,
                  item.typeName,
                ),
              );
            },
          },
        ],
      );
      if (isSuperAdmin) {
        operations.push({
          key: 'remove',
          label: '踢出',
          onClick: async () => {
            if (await current.removeMember(item)) {
              forceUpdate();
            }
          },
        });
      }
    }
    return operations;
  };

  return (
    <div key={key} className={cls.companyContainer}>
      <Description
        title={
          <Typography.Title level={5}>{current.target.typeName}信息</Typography.Title>
        }
        current={current}
        extra={[]}
      />
      <div className={cls['pages-wrap']}>
        <PageCard bordered={false} tabList={TitleItems} tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<schema.XTarget>
              dataSource={[]}
              key={key}
              rowKey={'id'}
              request={(page) => {
                return current.loadMembers(page);
              }}
              parentRef={parentRef}
              operation={renderOperation}
              columns={PersonColumns}
              showChangeBtn={false}
            />
          </div>
        </PageCard>
        <IndentityManage
          current={current}
          isAdmin={isSuperAdmin}
          open={activeModal === 'indentity'}
          onCancel={() => setActiveModal('')}
        />
        {/* 邀请成员*/}
        <Modal
          title="邀请成员"
          destroyOnClose
          open={activeModal === 'addOne'}
          width={900}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectMember) {
              const success = await current.pullMembers(
                selectMember.map((n) => n.id),
                selectMember[0].typeName,
              );
              if (success) {
                setActiveModal('');
                message.success('添加成功');
                forceUpdate();
              } else {
                message.error('添加失败');
              }
            }
          }}>
          <AssignModal<schema.XTarget>
            placeholder="请输入用户账号"
            request={async (page: any) => await userCtrl.space.loadMembers(page)}
            onFinish={(data) => {
              setSelectMember(data);
            }}
            columns={PersonColumns}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CohortSetting;
