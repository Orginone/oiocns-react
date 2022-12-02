import React, { useEffect, useState } from 'react';
import {
  Avatar,
  List,
  Descriptions,
  Typography,
  Layout,
  Card,
  Input,
  Tag,
  Modal,
  message,
} from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import cls from './index.module.less';
import Cohort from '@/ts/core/target/cohort';
import CohortController from '@/ts/controller/cohort/index';
import FriendController from '@/ts/controller/friend';
import { useHistory } from 'react-router-dom';
import { schema } from '@/ts/base';
import Provider from '@/ts/core/provider';
import { IChat } from '@/ts/core/chat/ichat';
import { chatCtrl } from '@/ts/controller/chat';
const ContainerHeight = 400;
interface defaultObjType {
  cohortData: Cohort;
}
const { Title } = Typography;
const { Search } = Input;
const MemberList: React.FC<defaultObjType> = ({ cohortData }) => {
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);
  const [friendList, setFriendList] = useState<schema.XTarget[]>([]);
  const history = useHistory();

  /**获取群组下成员列表 */
  const getMemberData = async () => {
    const res = await CohortController.getCohortPeronList(cohortData);
    setMemberData(res);
  };
  /**获取好友列表 */
  const getFriendList = async () => {
    const res = await FriendController.getMyFriend();
    setFriendList(res);
  };
  /**移除成员 */
  const removeMember = async (ids: string[]) => {
    CohortController.setCallBack(setMemberData);
    await CohortController.removeCohort(cohortData, ids);
  };
  /**
   * 获取操作列表
   * @param value
   */
  const getAction = (value: schema.XTarget) => {
    const size: number = friendList.filter((obj) => obj.id == value.id).length;
    const action = [];
    if (size == 0) {
      action.push(
        <a
          key="list-loadmore-more"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              icon: <ExclamationCircleOutlined />,
              content: '是否申请添加好友',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                FriendController.applyFriend(Provider.getPerson!, value),
                  message.success('发起申请成功');
              },
            });
          }}>
          添加好友
        </a>,
      );
    } else {
      action.push(
        <a key="list-loadmore-edit" onClick={() => enterChat(value.id)}>
          发起会话
        </a>,
      );
    }
    if (cohortData.target.belongId == Provider.userId) {
      action.push(<a key="list-loadmore-more">身份管理</a>);
      action.push(
        <a
          key="list-loadmore-more"
          onClick={() =>
            Modal.confirm({
              title: '提示',
              icon: <ExclamationCircleOutlined />,
              content: '是否踢出群组',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                FriendController.applyFriend(Provider.getPerson!, value),
                  removeMember([value.id]);
                message.success('操作成功');
              },
            })
          }>
          踢出群组
        </a>,
      );
    }
    return action;
  };
  /**
   * 根据id获取会话
   * @param id
   * @returns
   */
  const getChat = (id: string): IChat | undefined => {
    for (var i = 0; i < chatCtrl.groups.length; i++) {
      const group = chatCtrl.groups[i];
      console.log(group);
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
  /**进入会话 */
  const enterChat = (id: string) => {
    chatCtrl.setCurrent(getChat(id));
    history.push('/chat');
  };
  /**
   * 获取标题内容
   * @param value
   */
  const getTitle = (value: schema.XTarget) => {
    const title = [];
    const indentity: string = '成员';
    const size: number = friendList.filter((obj) => obj.id == value.id).length;
    if (size != 0) {
      title.push(
        <div>
          <a href="https://ant.design">{value.name}</a>
          <span style={{ paddingLeft: '5px' }}>{value.code}</span>
          <span>
            <Tag color="green" style={{ marginLeft: '10px' }}>
              {indentity}
            </Tag>
          </span>
          <span>
            <UserOutlined size={20} style={{ paddingLeft: '5px' }} />
          </span>
        </div>,
      );
    } else {
      title.push(
        <div>
          <a href="https://ant.design">{value.name}</a>
          <span style={{ paddingLeft: '5px' }}>{value.code}</span>
          <span>
            <Tag color="green" style={{ marginLeft: '10px' }}>
              {indentity}
            </Tag>
          </span>
        </div>,
      );
    }
    return title;
  };

  useEffect(() => {
    getMemberData();
    getFriendList();
  }, []);

  const onSearch = async (value: string) => {
    if (value!) {
      await getMemberData();
      setMemberData(memberData.filter((obj) => obj.code === value));
    } else {
      await getMemberData();
    }
  };

  return (
    <div>
      <Card>
        <Descriptions title="群组详情" layout="vertical" bordered>
          <Descriptions.Item label="群组名称">奥能集团项目交流群</Descriptions.Item>
          <Descriptions.Item label="群组编号">AoNengJiTuan</Descriptions.Item>
          <Descriptions.Item label="群组简介">react项目开发人员</Descriptions.Item>
        </Descriptions>
      </Card>
      <Layout style={{ paddingTop: '7px' }}>
        <Card bordered={false}>
          <Title level={5}>成员列表</Title>

          <div style={{ paddingBottom: '16px', textAlign: 'right' }}>
            <Search
              placeholder="请输入人员名称"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
          </div>
          <div className={cls['person-info-company']}>
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: 'auto',
                paddingTop: '10px',
              }}>
              <List>
                <VirtualList
                  data={memberData}
                  height={ContainerHeight}
                  itemHeight={47}
                  itemKey={'id'}>
                  {(item: schema.XTarget) => (
                    <List.Item key={item.id} actions={getAction(item)!}>
                      <List.Item.Meta
                        avatar={<Avatar src={'https://joeschmoe.io/api/v1/random'} />}
                        title={getTitle(item)!}
                        description={item.team?.remark}
                      />
                    </List.Item>
                  )}
                </VirtualList>
              </List>
            </div>
          </div>
        </Card>
      </Layout>
    </div>
  );
};

export default MemberList;
