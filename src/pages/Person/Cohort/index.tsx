import { Button, Space, Tabs, Card, Modal, message } from 'antd';
import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { CohortConfigType } from 'typings/Cohort';
import { cohortColumn } from '@/components/CardOrTableComp/config';
import { updateCohortColumn } from '@/components/CardOrTableComp/config';

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

const CohortConfig: React.FC = () => {
  const Person = userCtrl.User!;
  console.log('实体信息', Person);
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
  const [isSetPost, setIsSetPost] = useState<boolean>(false); // 岗位设置
  useEffect(() => {
    getData();
    // getJoinData();
  }, []);
  const getData = async () => {
    console.log('111111111111111111', await userCtrl.User?.getJoinedCohorts());
    setData(
      (await userCtrl.User?.getJoinedCohorts())?.filter(
        (obj) => obj.target.belongId == userCtrl.User?.target.id,
      ),
    );
    setJoinData(
      (await userCtrl.User?.getJoinedCohorts())?.filter(
        (obj) => obj.target.belongId != userCtrl.User?.target.id,
      ),
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
          console.log(chat);
          return chat;
        }
      }
    }
    return undefined;
  };

  const renderOperation = (item: ICohort): CohortConfigType.OperationType[] => {
    return [
      {
        key: 'enterChat',
        label: '进入会话',
        onClick: () => {
          chatCtrl.setCurrent(getChat(item.target.id));
          history.push('/chat');
          console.log('按钮事件', 'enterChat', item);
        },
      },
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal();
          setItem(item);
          console.log('按钮事件', 'inviteMembers', item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          setItem(item);
          setOpen(true);
          console.log('按钮事件', 'updateCohort', item);
        },
      },
      {
        key: 'roleManage',
        label: '角色管理',
        onClick: () => {
          setIsSetPost(true);
          console.log('按钮事件', 'roleManage', item);
        },
      },
      {
        key: 'changePermission',
        label: '转移权限',
        onClick: () => {
          setItem(item);
          setChangeIsModelOpen(true);
          console.log('按钮事件', 'changePermission', item);
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
              await userCtrl.User?.deleteCohort(item.target.id);
              getData();
              message.success('解散成功');
            },
          });
        },
      },
    ];
  };
  const joinrenderOperation = (item: ICohort): CohortConfigType.OperationType[] => {
    return [
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal();
          setItem(item);
          console.log('按钮事件', 'inviteMembers', item);
        },
      },
      {
        key: 'exitCohort',
        label: '退出群聊',
        onClick: () => {
          // CohortController.quitCohort(Person, item.target.id);
          message.info('退出成功');
          console.log('按钮事件', 'exitCohort', item);
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
    message.success('权限转移成功');
  };
  //邀请成员确认事件
  const handleOk = async () => {
    setIsModalOpen(false);
    const res = await item?.pullMember([friend!]);
    if (res?.success) {
      console.log(res);
      message.success('邀请成功');
    } else {
      message.error(res?.msg);
    }
  };
  //申请加入群组确认事件
  const cohortHandleOk = async () => {
    const data = await userCtrl.User?.applyJoinCohort(cohort?.target.id!);
    if (!data?.success) {
      message.error(data?.msg);
    } else message.info('申请加入成功');
    setAddIsModalOpen(false);
  };

  const searchCallback = (person: schema.XTarget) => {
    setFriend(person);
  };
  const renderCardFun = (dataArr: ICohort[]): React.ReactNode[] => {
    return dataArr.map((item: ICohort) => {
      return (
        <CohortCard
          className="card"
          data={item}
          key={item.target.id}
          onClick={() => console.log('按钮测试')}
          operation={renderOperation}
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
              {/* 对象设置 */}
              <AddPostModal
                title={'身份设置'}
                open={isSetPost}
                onOk={() => {
                  setIsSetPost(false);
                }}
                handleOk={() => {
                  setIsSetPost(false);
                }}
              />
              <Modal
                title="加入群组"
                open={addIsModalOpen}
                onOk={cohortHandleOk}
                onCancel={() => setAddIsModalOpen(false)}
                width="1050px">
                <AddCohort person={Person} setCohort={setcohort} />
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
                  columns={updateCohortColumn as any}
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
                  childrenColumnName={'nochildren'}
                  dataSource={data!}
                  total={total}
                  page={page}
                  tableAlertRender={tableAlertRender}
                  rowSelection={{}}
                  defaultPageType={'card'}
                  showChangeBtn={false}
                  renderCardContent={renderCardFun}
                  operation={renderOperation}
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
                  renderCardContent={renderCardFun}
                  operation={joinrenderOperation}
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
