import React, { useEffect, useState } from 'react';
import {
  Avatar,
  List,
  Descriptions,
  Typography,
  Input,
  Tag,
  Modal,
  message,
  Row,
  Col,
} from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import cls from './index.module.less';
import { useHistory } from 'react-router-dom';
import { schema } from '@/ts/base';
import { IChat } from '@/ts/core/chat/ichat';
import chatCtrl from '@/ts/controller/chat';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICohort } from '@/ts/core/target/itarget';
import { XTarget } from '@/ts/base/schema';
import Person from '@/ts/core/target/person';
const ContainerHeight = 400;
interface defaultObjType {
  cohortData: ICohort;
}
const { Title } = Typography;
const { Search } = Input;
const MemberList: React.FC<defaultObjType> = ({ cohortData }) => {
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);
  const [friendList, setFriendList] = useState<schema.XTarget[]>([]);
  const [currentPage, setCurrnentPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const history = useHistory();
  useEffect(() => {
    getMemberData(1, 10);
    getFriendList();
  }, []);
  /**获取群组下成员列表 */
  const getMemberData = async (pageIndex: number, pageSize: number, filter = '') => {
    const res = await cohortData.loadMembers({
      offset: (pageIndex - 1) * pageSize,
      filter: filter,
      limit: pageSize,
    });
    setCurrnentPage(pageIndex);
    const saveData = res.result!.filter((obj) => obj.id != userCtrl.space?.target.id);
    setMemberData(pageIndex !== 1 ? [...memberData, ...saveData] : saveData);
  };
  /**获取好友列表 */
  const getFriendList = async () => {
    const res = await userCtrl.user?.loadMembers({ offset: 0, filter: '', limit: 65535 });
    setFriendList(res.result!);
  };
  /**移除成员 */
  const removeMember = async (target: XTarget) => {
    await cohortData.removeMember(target);
    getMemberData(1, 10);
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
              onOk: async () => {
                await userCtrl.user?.applyFriend(value);
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
    if (cohortData.target.belongId == userCtrl.user.target.id) {
      // action.push(<a key="list-loadmore-more">身份管理</a>);
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
              onOk: async () => {
                await removeMember(value);
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
          <a href="">{value.name}</a>
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
          <a href="">{value.name}</a>
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

  const onListScroll = async (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      await getMemberData(currentPage + 1, 10, searchValue);
    }
  };
  return (
    <div>
      <Descriptions title="群组详情" bordered size="small" column={2}>
        <Descriptions.Item label="群组名称">奥能集团项目交流群</Descriptions.Item>
        <Descriptions.Item label="群组编号">AoNengJiTuan</Descriptions.Item>
        <Descriptions.Item label="群组简介">react项目开发人员</Descriptions.Item>
      </Descriptions>

      <div className={cls['person-info-company']}>
        <div className={cls['person-list']}>
          <List
            header={
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5}>成员列表</Title>
                </Col>
                <Col>
                  <Search
                    placeholder="请输入用户编号"
                    onSearch={async (value) => {
                      setSearchValue(value);
                      await getMemberData(1, 10, value);
                    }}
                    style={{ width: 200 }}
                  />
                </Col>
              </Row>
            }>
            <VirtualList
              onScroll={onListScroll}
              data={memberData}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="id">
              {(item: schema.XTarget) => (
                <List.Item key={item.id} actions={getAction(item)!}>
                  <List.Item.Meta
                    avatar={<Avatar src={new Person(item).avatar?.thumbnail} />}
                    title={getTitle(item)!}
                    description={item.team?.remark}
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
