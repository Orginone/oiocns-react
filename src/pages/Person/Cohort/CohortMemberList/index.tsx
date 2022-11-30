import React, { useEffect, useState } from 'react';
import { Avatar, List, Descriptions, Typography, Layout, Card, Input, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import cls from './index.module.less';
import Cohort from '@/ts/core/target/cohort';
import CohortController from '../../../../ts/controller/cohort/index';
import FriendController from '../../../../ts/controller/friend';

import { schema } from '../../../../ts/base';
import Provider from '@/ts/core/provider';
const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;
interface defaultObjType {
  cohortData: Cohort;
}
interface UserItem {
  email: string;
  gender: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  nat: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}
const { Title } = Typography;
const { Search } = Input;
const MemberList: React.FC<defaultObjType> = ({ cohortData }) => {
  const [data, setData] = useState<UserItem[]>([]);
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);
  const [friendList, setFriendList] = useState<schema.XTarget[]>([]);
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
  /**
   * 获取操作列表
   * @param value
   */
  const getAction = (value: schema.XTarget) => {
    const action = [];
    if (friendList.filter((obj) => (obj.id = value.id)) == null) {
      action.push(<a key="list-loadmore-more">添加好友</a>);
    } else {
      action.push(<a key="list-loadmore-edit">发起会话</a>);
    }
    if (value.belongId == Provider.spaceId) {
      action.push(<a key="list-loadmore-more">踢出群组</a>);
    }
  };
  /**
   * 获取标题内容
   * @param value
   */
  const getTitle = (value: schema.XTarget) => {
    const title = [];
    const indentity: string = '成员';
    if (friendList.filter((obj) => (obj.id = value.id)) == null) {
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
  };
  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
      });
  };

  useEffect(() => {
    appendData();
    getMemberData();
    getFriendList();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      appendData();
    }
  };
  const onSearch = (value: string) => console.log(value);

  const action = (value: UserItem) => {
    if (new String(value.name.first).length > 5) {
      console.log(new String(value.name).length);
      return [
        <a key="list-loadmore-more">添加好友</a>,
        <a key="list-loadmore-more">踢出群组</a>,
      ];
    }
    return [
      <a key="list-loadmore-edit">发起会话</a>,
      <a key="list-loadmore-more">踢出群组</a>,
    ];
  };
  const title = (value: UserItem) => {
    if (new String(value.name.first).length > 5) {
      console.log(new String(value.name).length);
      return (
        <div>
          <a href="https://ant.design">{value.name.last}</a>
          <span style={{ paddingLeft: '5px' }}>{939097257}</span>
          <span>
            <Tag color="green" style={{ marginLeft: '10px' }}>
              一级成员
            </Tag>
          </span>
        </div>
      );
    }
    return (
      <div>
        <a href="https://ant.design">{value.name.last}</a>
        <span style={{ paddingLeft: '5px' }}>{939097257}</span>
        <span>
          <Tag color="green" style={{ marginLeft: '10px' }}>
            一级成员
          </Tag>
        </span>
        <span>
          <UserOutlined size={20} style={{ paddingLeft: '5px' }} />
        </span>
      </div>
    );
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
                  data={data}
                  height={ContainerHeight}
                  itemHeight={47}
                  itemKey="email"
                  onScroll={onScroll}>
                  {(item: UserItem) => (
                    <List.Item key={item.email} actions={action(item)}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.picture.large} />}
                        title={title(item)}
                        description={item.email}
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
