import React, { useState, useEffect } from 'react';
import { Button, Space, Tabs, Card, Modal, message, Typography, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { cohortColumn } from './column';
import { TargetType } from '@/ts/core/enum';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { ICohort } from '@/ts/core';
import AddCohort from './SearchCohort';
import { common } from 'typings/common';
import { XTarget } from '@/ts/base/schema';
import { IChat } from '@/ts/core/chat/ichat';
import chatCtrl from '@/ts/controller/chat';
import userCtrl from '@/ts/controller/setting/userCtrl';
import CohortCard from './CohortCard';
import ChangeCohort from './SearchCohortPerson/index';
import CardOrTable from '@/components/CardOrTableComp';
import Persons from '@/bizcomponents/SearchPerson/index';
import Indentity from '@/bizcomponents/Indentity';
import EditCustomModal from '@/bizcomponents/GlobalComps/createTeam';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import cls from './index.module.less';

type modalType = 'transfer' | 'invite' | 'indentity' | 'role' | 'joined' | 'edit' | '';
const CohortConfig: React.FC = () => {
  const history = useHistory();
  const [page, setPage] = useState<number>(1);
  const [item, setItem] = useState<ICohort>();
  const [activeModal, setActiveModal] = useState<modalType>('');
  const [friend, setFriend] = useState<XTarget>();
  const [data, setData] = useState<ICohort[]>([]);
  const [joinData, setJoinData] = useState<ICohort[]>([]);
  const [isFlag, setIsFlag] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string>('1');
  const [chatKey] = useCtrlUpdate(userCtrl);
  useEffect(() => {
    getData();
  }, [chatKey]);

  const getData = async () => {
    const cohorts = await userCtrl.space.getCohorts();
    const manageData = cohorts.filter(
      (obj) => obj.target.belongId == userCtrl.space.target.id,
    );
    setData(manageData ?? []);
    setJoinData(
      cohorts.filter((obj) => obj.target.belongId !== userCtrl.space.target.id) ?? [],
    );
  };

  /**
   * 根据id获取会话
   * @param id
   * @returns
   */
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
  //我管理的群组操作列表
  const renderOperation = (item: ICohort) => {
    return [
      {
        key: 'enterChat',
        label: '进入会话',
        onClick: () => {
          chatCtrl.setCurrent(getChat(item.target.id));
          history.push('/chat');
        },
      },
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          setActiveModal('invite');
          setItem(item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          setItem(item);
          setActiveModal('joined');
          setIsFlag('编辑');
        },
      },
      {
        key: 'roleManage',
        label: '角色管理',
        onClick: async () => {
          await item.selectAuthorityTree(false);
          setItem(item);
          setActiveModal('role');
        },
      },
      {
        key: 'indentity',
        label: '身份管理',
        onClick: async () => {
          setItem(item);
          setActiveModal('indentity');
        },
      },
      {
        key: 'changePermission',
        label: '转移权限',
        onClick: () => {
          setItem(item);
          setActiveModal('transfer');
        },
      },
      {
        key: 'breakCohort',
        label: '解散群组',
        onClick: () => {
          Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定解散该群组',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              await userCtrl.space.deleteCohort(item.target.id);
              await getData();
              message.success('解散成功');
            },
          });
        },
      },
    ];
  };
  //我加入的群组操作列表
  const joinrenderOperation = (item: ICohort) => {
    return [
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          setActiveModal('invite');
          setItem(item);
        },
      },
      {
        key: 'exitCohort',
        label: '退出群聊',
        onClick: async () => {
          await userCtrl.user.quitCohorts(item.target.id);
          await getData();
          message.info('退出成功');
        },
      },
    ];
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  //转移权限确认事件
  const changeHandleOk = async () => {
    await item?.update({
      name: item.target.name,
      code: item.target.code,
      teamName: item.target.name,
      teamCode: item.target.code,
      typeName: TargetType.Cohort,
      teamRemark: item.target.team?.remark!,
      avatar: item.target.avatar!, //头像
    });
    await getData();
    message.success('权限转移成功');
    setActiveModal('');
  };
  //邀请成员确认事件
  const handleOk = async () => {
    const res = await item?.pullMember(friend!);
    if (res) {
      message.success('邀请成功');
      setActiveModal('');
    } else {
      message.error('邀请失败');
    }
  };

  //卡片
  const renderCardFun = (
    dataArr: ICohort[],
    operaiton: (_item: ICohort) => common.OperationType[],
  ) => {
    if (dataArr) {
      return dataArr.map((item: ICohort) => {
        return (
          <CohortCard
            className="card"
            data={item}
            key={item.target.id}
            operation={operaiton}
          />
        );
      });
    }
  };

  return (
    <Card bordered={false}>
      <div className={cls['person-info-content-header']}>
        <Typography.Title level={5}>群组</Typography.Title>
        <div>
          <Space split={<Divider type="vertical" />}>
            <Button
              type="link"
              onClick={() => {
                setActiveModal('edit');
                setIsFlag('新建');
              }}>
              创建群组
            </Button>
            <Button type="link" onClick={() => setActiveModal('joined')}>
              加入群组
            </Button>
          </Space>
        </div>
      </div>
      <Tabs
        defaultActiveKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={[
          { label: `管理的`, key: '1' },
          { label: `加入的`, key: '2' },
        ]}
      />
      <div key={chatKey}>
        {activeKey == '1' ? (
          <CardOrTable<ICohort>
            key="manage"
            childrenColumnName={'nochildren'}
            dataSource={data}
            hideOperation={true}
            total={data.length}
            page={page}
            rowSelection={{}}
            defaultPageType={'card'}
            showChangeBtn={false}
            renderCardContent={(data) => renderCardFun(data, renderOperation)}
            columns={cohortColumn}
            onChange={handlePageChange}
            rowKey={'id'}
          />
        ) : (
          <CardOrTable<ICohort>
            key="joined"
            // childrenColumnName={'nochildren'}
            dataSource={joinData!}
            total={joinData.length}
            page={page}
            hideOperation={true}
            rowSelection={{}}
            defaultPageType={'card'}
            showChangeBtn={false}
            renderCardContent={(data) => renderCardFun(data, joinrenderOperation)}
            columns={cohortColumn as any}
            onChange={handlePageChange}
            rowKey={'id'}
          />
        )}
      </div>
      <Modal
        title="转移权限"
        open={activeModal === 'transfer'}
        onOk={changeHandleOk}
        destroyOnClose={true}
        onCancel={() => setActiveModal('')}
        width={700}>
        <ChangeCohort
          cohort={item!}
          searchCallback={(person: XTarget) => setFriend(person)}
        />
      </Modal>
      <Modal
        title="邀请成员"
        open={activeModal === 'invite'}
        onOk={handleOk}
        onCancel={() => setActiveModal('')}
        width={700}>
        <Persons searchCallback={(person: XTarget) => setFriend(person)} />
      </Modal>
      {/**身份管理 */}
      <Indentity
        open={activeModal === 'indentity'}
        current={item!}
        onCancel={() => setActiveModal('')}
      />
      {item?.authorityTree && (
        <AddPostModal
          title={'角色设置'}
          open={activeModal === 'role'}
          handleOk={() => {
            setActiveModal('');
          }}
          current={item}
        />
      )}
      <Modal
        title="加入群组"
        open={activeModal === 'joined'}
        onOk={() => setActiveModal('')}
        onCancel={() => setActiveModal('')}
        width={700}>
        <AddCohort />
      </Modal>
      <EditCustomModal
        title={isFlag}
        open={activeModal === 'edit'}
        handleCancel={() => setActiveModal('')}
        handleOk={async (item) => {
          if (item) {
            await getData();
            setActiveModal('');
          }
        }}
        current={item || userCtrl.space}
        typeNames={[TargetType.Cohort]}
      />
    </Card>
  );
};

export default CohortConfig;
