import cls from './index.module.less';
import React, { useEffect } from 'react';
import HeadBanner from '@/pages/Home/components/HeadBanner';
import { Avatar, Card, Col, List, Row } from 'antd';
import NavigationBar from '@/pages/Home/components/NavigationBar';

const Home: React.FC = () => {
  useEffect(() => {}, []);

  const data = Array.from({ length: 23 }).map((_, i) => ({
    href: '#',
    title: `名字名字${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      '动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容动态内容...',
  }));

  return (
    <div className={cls.homepage}>
      <NavigationBar></NavigationBar>
      <HeadBanner
        backgroundImageUrl={'src/assets/img/activity-bg.png'}
        title="群动态"></HeadBanner>
      <Row gutter={[24, 24]} className={cls.content}>
        <Col span={12}>
          <Card title="经常浏览">
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
        </Col>
      </Row>
    </div>
  );
};
export default Home;
