import React, { useEffect, useState } from 'react';
import { Avatar, List, Descriptions, Typography, Layout, Card, Input, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import cls from './index.module.less';
const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

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
const App: React.FC = () => {
  const [data, setData] = useState<UserItem[]>([]);

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
      });
  };

  useEffect(() => {
    appendData();
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
              三级管理员
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
            三级管理员
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

export default App;
