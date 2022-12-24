import React, { useRef, useState } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { IChat, ICohort } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import { useHistory } from 'react-router-dom';
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
import AddPostModal from '@/bizcomponents/AddPositionModal';
interface IProps {
  current: ICohort;
}
/**
 * 群组信息
 * @returns
 */
const CohortSetting: React.FC<IProps> = ({ current }: IProps) => {
  const history = useHistory();
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate(current);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<schema.XTarget[]>(); // 需要邀请的部门成员

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

  const getChat = (id: string): IChat | undefined => {
    for (var i = 0; i < chatCtrl.groups.length; i++) {
      const group = chatCtrl.groups[i];
      for (var j = 0; j < group.chats.length; j++) {
        const chat = group.chats[j];
        if (id == chat.target.id) {
          return chat;
        }
      }
    }
    return undefined;
  };

  /**进入会话 */
  const enterChat = (id: string) => {
    chatCtrl.setCurrent(getChat(id));
    history.push('/chat');
  };

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    if (item.id != userCtrl.user.id) {
      operations = [
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
          label: '发起会话',
          onClick: async () => {
            enterChat(item.id);
          },
        },
        {
          key: 'remove',
          label: '踢出',
          onClick: async () => {
            if (await current.removeMember(item)) {
              forceUpdate();
            }
          },
        },
      ];
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
        extra={[
          <Button type="link" key="qx" onClick={() => setActiveModal('post')}>
            权限管理
          </Button>,
        ]}
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
          open={activeModal === 'indentity'}
          current={current}
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
        {/* 权限设置 */}
        <AddPostModal
          title={'权限设置'}
          open={activeModal === 'post'}
          handleOk={() => setActiveModal('')}
          current={current}
        />
      </div>
    </div>
  );
};

export default CohortSetting;
