import React, { useState } from 'react';
import { Form, Input, Button, List, Avatar, Switch } from 'antd';
import VisibleRangeModal from './VisibleRangeModal';

type ShareType = {};

type itemtype = {
  src: string;
  discript: string;
  title: string;
  defaultChecked?: boolean;
  isSwiVsi?: boolean;
  swiDes?: string;
};

const Share: React.FC<ShareType> = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="页面访问链接">
          <Input.Group compact>
            <Input
              width="100%"
              disabled
              style={{ width: 'calc(100% - 100px)' }}
              defaultValue="git@github.com:ant-design/ant-design.git"
            />
            <Button type="primary">复制</Button>
          </Input.Group>
        </Form.Item>
      </Form>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={[
          {
            src: 'https://randomuser.me/api/portraits/women/1.jpg',
            title: '分享到个人',
            discript: '发布并与个人分享链接',
            isSwiVsi: true,
            defaultChecked: true,
            swiDes: '修改可见范围',
          },
          {
            src: 'https://randomuser.me/api/portraits/women/1.jpg',
            title: '分享到群组',
            discript: '发布并与群组分享链接',
            isSwiVsi: true,
            defaultChecked: false,
          },
          {
            src: 'https://randomuser.me/api/portraits/women/1.jpg',
            title: '分享到部门',
            discript: '发布并与部门分享链接',
          },
        ]}
        renderItem={(item: itemtype, index) => [
          <List.Item
            key={item.title + index}
            actions={[
              item.isSwiVsi && (
                <Switch
                  defaultChecked={item.defaultChecked}
                  onChange={(e) => {
                    console.log(e);
                  }}></Switch>
              ),
              item.swiDes && (
                <a
                  key="list-loadmore-more"
                  onClick={() => {
                    setIsOpenModal(true);
                  }}>
                  {item.swiDes}
                </a>
              ),
            ]}>
            <List.Item.Meta
              avatar={<Avatar src={item.src} />}
              title={<a>{item.title}</a>}
              description={item.discript}
            />
          </List.Item>,
        ]}
      />
      <VisibleRangeModal
        isModalOpen={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleOk={() => {
          setIsOpenModal(false);
        }}
      />
    </div>
  );
};

export default Share;
