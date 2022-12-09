import { Button, Space, Tabs, Card, Modal, message } from 'antd';
import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { cohortColumn } from './column';
import { updateColumn } from './column/index';
import cls from './index.module.less';
import UpdateCohort from '@/bizcomponents/Cohort/UpdateCohort/index';
import Persons from '../../../bizcomponents/SearchPerson/index';
import AddCohort from '../../../bizcomponents/SearchCohort/index';
import { useHistory } from 'react-router-dom';
import ChangeCohort from './SearchCohortPerson/index';
import CreateCohort from '../../../bizcomponents/Cohort/index';
import { schema } from '../../../ts/base';
import CohortCard from './CohortCard';
import chatCtrl from '@/ts/controller/chat';
import { IChat } from '@/ts/core/chat/ichat';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddPostModal from '../../../bizcomponents/AddPositionModal';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICohort } from '@/ts/core/target/itarget';
import { TargetType } from '@/ts/core/enum';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import Indentity from '@/bizcomponents/Indentity/index';
const CohortConfig: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<ICohort>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addIsModalOpen, setAddIsModalOpen] = useState(false);
  const [changeIsModelOpen, setChangeIsModelOpen] = useState(false);
  const history = useHistory();
  const [friend, setFriend] = useState<schema.XTarget>();
  const [cohort, setcohort] = useState<ICohort>();
  const [data, setData] = useState<ICohort[]>();
  const [joinData, setJoinData] = useState<ICohort[]>();
  const [isSetPost, setIsSetPost] = useState<boolean>(false);
  const [isOpenIndentity, setIsOpenIndentity] = useState<boolean>(false);
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);

  const [chatKey] = useCtrlUpdate(userCtrl);
  useEffect(() => {
    getData();
  }, [chatKey]);

  const getData = async () => {
    const cohorts = await userCtrl.space.getJoinedCohorts(false);
    setTotal(cohorts.length);
    setData(cohorts);
    setJoinData(cohorts);
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
          showModal();
          setItem(item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          setItem(item);
          setOpen(true);
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
          setMemberData(
            await (
              await item.getMember(false)!
            ).filter((obj) => obj.id != userCtrl.space.target.id),
          );
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
              getData();
              message.success('解散成功');
            },
          });
        },
      },
    ];
  };

  const joinrenderOperation = (item: ICohort): common.OperationType[] => {
    return [
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal();
          setItem(item);
        },
      },
      {
        key: 'exitCohort',
        label: '退出群聊',
        onClick: async () => {
          await userCtrl.space.quitCohorts(item.target.id);
          getData();
          message.info('退出成功');
        },
      },
    ];
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys);
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  //转移权限确认事件
  const changeHandleOk = async () => {
    setChangeIsModelOpen(false);
    await item?.update({
      name: item.target.name,
      code: item.target.code,
      typeName: TargetType.Cohort,
      teamRemark: item.target.team?.remark!,
      belongId: item.target.belongId,
      avatar: 'test', //头像
    });
    getData();
    message.success('权限转移成功');
  };
  //邀请成员确认事件
  const handleOk = async () => {
    setIsModalOpen(false);
    const res = await item?.pullMember([friend!]);
    if (res?.success) {
      message.success('邀请成功');
    } else {
      message.error(res?.msg);
    }
  };
  //申请加入群组确认事件
  const cohortHandleOk = async () => {
    const data = await userCtrl.space?.applyJoinCohort(cohort?.target.id!);
    if (!data?.success) {
      message.error(data?.msg);
    } else message.info('申请加入成功');
    setAddIsModalOpen(false);
  };

  const searchCallback = (person: schema.XTarget) => {
    setFriend(person);
  };
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
          onClick={() => console.log('按钮测试')}
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

              <Indentity
                open={isOpenIndentity}
                object={item!}
                MemberData={memberData ? memberData : []}
                onCancel={() => {
                  setIsOpenIndentity(false);
                }}
              />

              {item?.authorityTree && (
                <AddPostModal
                  title={'角色设置'}
                  open={isSetPost}
                  onOk={() => {
                    setIsSetPost(false);
                  }}
                  handleOk={() => {
                    setIsSetPost(false);
                  }}
                  datasource={item?.authorityTree}
                />
              )}

              <Modal
                title="加入群组"
                open={addIsModalOpen}
                onOk={cohortHandleOk}
                onCancel={() => setAddIsModalOpen(false)}
                width="1050px">
                <AddCohort setCohort={setcohort} />
              </Modal>

              {item && (
                <UpdateCohort
                  key={item?.target.id}
                  layoutType="ModalForm"
                  title="修改群组"
                  modalProps={{
                    destroyOnClose: true,
                    onCancel: () => setOpen(false),
                  }}
                  open={open}
                  columns={updateColumn as any}
                  setOpen={setOpen}
                  item={item}
                  callBack={getData}
                />
              )}

              <CreateCohort callBack={getData} />

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
              children: (
                <CardOrTable<ICohort>
                  id={chatKey}
                  childrenColumnName={'nochildren'}
                  dataSource={data!}
                  total={total}
                  page={page}
                  tableAlertRender={tableAlertRender}
                  rowSelection={{}}
                  defaultPageType={'card'}
                  showChangeBtn={false}
                  renderCardContent={(data) => renderCardFun(data, renderOperation)}
                  columns={cohortColumn as any}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ),
            },
            {
              label: `加入的`,
              key: '2',
              children: (
                <CardOrTable<ICohort>
                  childrenColumnName={'nochildren'}
                  dataSource={joinData!}
                  total={total}
                  page={page}
                  tableAlertRender={tableAlertRender}
                  rowSelection={{}}
                  defaultPageType={'card'}
                  showChangeBtn={false}
                  renderCardContent={(data) => renderCardFun(data, joinrenderOperation)}
                  columns={cohortColumn as any}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CohortConfig;
