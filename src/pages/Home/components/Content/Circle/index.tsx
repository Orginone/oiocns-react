import React from 'react';
import { Avatar, Card, Col, List, Row } from 'antd';
import cls from './index.module.less';

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: '#',
  title: `名字名字${i}`,
  avatar: 'https://joeschmoe.io/api/v1/random',
  content:
    '动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容...',
}));
const Circle: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className={cls.content}>
      <Col span={12}>
        <Card title="特别关注">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data}
            footer={
              <div>
                <b>ant design</b> footer part
              </div>
            }
            renderItem={(item) => (
              <List.Item
                key={item.title}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                />
                {item.content}
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="最新动态">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.title}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                />
                {item.content}

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                  <Col span={8}>
                    <img
                      width="100%"
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Circle;
