import { Button, Space, Tabs, Card, Modal, message } from 'antd';
import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { cohortColumn } from './column';
import cls from './index.module.less';
import Persons from '../../../bizcomponents/SearchPerson/index';
import { useHistory } from 'react-router-dom';
import ChangeCohort from './SearchCohortPerson/index';
import { schema } from '../../../ts/base';
import CohortCard from './CohortCard';
import chatCtrl from '@/ts/controller/chat';
import { IChat } from '@/ts/core/chat/ichat';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddPostModal from '../../../bizcomponents/AddPositionModal';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { ICohort } from '@/ts/core';
import Indentity from '@/bizcomponents/Indentity';
import EditCustomModal from '@/bizcomponents/CreateTeam/index';
import AddCohort from './SearchCohort';
const CohortConfig: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [item, setItem] = useState<ICohort>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addIsModalOpen, setAddIsModalOpen] = useState(false);
  const [changeIsModelOpen, setChangeIsModelOpen] = useState(false);
  const history = useHistory();
  const [friend, setFriend] = useState<schema.XTarget>();
  const [data, setData] = useState<ICohort[]>();
  const [joinData, setJoinData] = useState<ICohort[]>();
  const [isSetPost, setIsSetPost] = useState<boolean>(false);
  const [isOpenIndentity, setIsOpenIndentity] = useState<boolean>(false);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isFlag, setIsFlag] = useState<string>('');
  const [chatKey] = useCtrlUpdate(userCtrl);
  useEffect(() => {
    getData();
  }, [chatKey]);

  const getData = async () => {
    const cohorts = await userCtrl.space.getCohorts();
    setTotal(cohorts.length);
    setData(cohorts.filter((obj) => obj.target.belongId == userCtrl.space.target.id));
    setJoinData(
      cohorts.filter((obj) => obj.target.belongId !== userCtrl.space.target.id),
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
  const renderOperation = (item: ICohort): common.OperationType[] => {
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
          setIsModalOpen(true);
          setItem(item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          setItem(item);
          setIsOpenCreate(true);
          setIsFlag('编辑');
        },
      },
      {
        key: 'roleManage',
        label: '角色管理',
        onClick: async () => {
          await item.selectAuthorityTree(false);
          setItem(item);
          setIsSetPost(true);
        },
      },
      {
        key: 'indentity',
        label: '身份管理',
        onClick: async () => {
          setItem(item);
          setIsOpenIndentity(true);
        },
      },
      {
        key: 'changePermission',
        label: '转移权限',
        onClick: () => {
          setItem(item);
          setChangeIsModelOpen(true);
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
  const joinrenderOperation = (item: ICohort): common.OperationType[] => {
    return [
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          setIsModalOpen(true);
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
  //标签页点击触发事件
  const onChange = (key: string) => {
    console.log(key);
  };
  //转移权限确认事件
  const changeHandleOk = async () => {
    setChangeIsModelOpen(false);
    await item?.update({
      name: item.target.name,
      code: item.target.code,
      teamName: item.target.name,
      teamCode: item.target.code,
      typeName: TargetType.Cohort,
      teamRemark: item.target.team?.remark!,
      // belongId:friend?.id, //待开放参数
      avatar: 'test', //头像
    });
    await getData();
    message.success('权限转移成功');
  };
  //邀请成员确认事件
  const handleOk = async () => {
    setIsModalOpen(false);
    const res = await item?.pullMember(friend!);
    if (res) {
      message.success('邀请成功');
    } else {
      message.error('邀请失败');
    }
  };

  //保存选中人员数据
  const searchCallback = (person: schema.XTarget) => {
    setFriend(person);
  };
  //卡片
  const renderCardFun = (
    dataArr: ICohort[],
    operaiton: (_item: ICohort) => common.OperationType[],
  ): React.ReactNode[] => {
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
  };

  return (
    <div>
      <Card>
        <div className={cls['person-info-content-header']}>
          <Title level={2}>
            <strong>群组</strong>
          </Title>
          <div>
            <Space split={<Divider type="vertical" />}>
              <Modal
                title="转移权限"
                open={changeIsModelOpen}
                onOk={changeHandleOk}
                destroyOnClose={true}
                onCancel={() => setChangeIsModelOpen(false)}
                width="1050px">
                <ChangeCohort cohort={item!} searchCallback={searchCallback} />
              </Modal>

              <Modal
                title="邀请成员"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width="700px">
                <Persons searchCallback={searchCallback} />
              </Modal>
              {/**身份管理 */}
              <Indentity
                open={isOpenIndentity}
                current={item!}
                onCancel={() => {
                  setIsOpenIndentity(false);
                }}
              />
              {item?.authorityTree && (
                <AddPostModal
                  title={'角色设置'}
                  open={isSetPost}
                  handleOk={() => {
                    setIsSetPost(false);
                  }}
                  current={item}
                />
              )}
              <Modal
                title="加入群组"
                open={addIsModalOpen}
                onOk={() => setAddIsModalOpen(false)}
                onCancel={() => setAddIsModalOpen(false)}
                width="1050px">
                <AddCohort />
              </Modal>
              <EditCustomModal
                title={isFlag}
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                handleOk={async (item) => {
                  if (item) {
                    await getData();
                    setIsOpenCreate(false);
                  }
                }}
                current={item || userCtrl.space}
                typeNames={[TargetType.Cohort]}
              />
              <Button
                type="link"
                onClick={() => {
                  setIsOpenCreate(true);
                  setIsFlag('新建');
                }}>
                创建群组
              </Button>
              <Button type="link" onClick={() => setAddIsModalOpen(true)}>
                加入群组
              </Button>
            </Space>
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `管理的`,
              key: '1',
              children: data ? (
                <CardOrTable<ICohort>
                  id={chatKey}
                  childrenColumnName={'nochildren'}
                  dataSource={data}
                  total={total}
                  page={page}
                  rowSelection={{}}
                  defaultPageType={'card'}
                  showChangeBtn={false}
                  renderCardContent={(data) => renderCardFun(data, renderOperation)}
                  columns={cohortColumn as any}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ) : (
                ''
              ),
            },
            {
              label: `加入的`,
              key: '2',
              children: joinData ? (
                <CardOrTable<ICohort>
                  childrenColumnName={'nochildren'}
                  dataSource={joinData!}
                  total={total}
                  page={page}
                  rowSelection={{}}
                  defaultPageType={'card'}
                  showChangeBtn={false}
                  renderCardContent={(data) => renderCardFun(data, joinrenderOperation)}
                  columns={cohortColumn as any}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ) : (
                ''
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CohortConfig;
