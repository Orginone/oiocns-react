import React from 'react';
import cls from './index.module.less';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import { Col, Image, Row, Space, Tag, Typography } from 'antd';
import { Activity } from '@/components/Activity/ActivityPublisher';
import { ITarget } from '@/ts/core';
import * as ai from '@/icons/ai';


const ActivityList: React.FC<{ space: ITarget }> = ({ space }) => {
  // @ts-ignore
  const activityList: Activity[] = [
    {
      comments: [],
      content:
        '云原生应用研究院是研究云原生技术，推进领先技术的落地实践，支撑政府、社会、经济等各领域各行业组织变革和业务创新需求而发起成立的开放型非营利公共组织。 负责搭建开放协同创新平台，加速云原生应用平台落地示范以及推广，更好的服务于数字化改革。',
      imageList: [
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=1',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=2',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=3',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=4',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=5',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=6',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=7',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=8',
          },
        },
        {
          filedata: {
            thumbnail: 'https://dummyimage.com/300x300&text=9',
          },
        },
      ],
      likes: 0,
      space,
      tags: ['工作', '新的期望'],
    },
    {
      comments: [],
      content:
        '2018年3月资产云全省培训。全省资产云应用培训圆满完成，政府资产管理再升级。\n',
      imageList: [],
      likes: 0,
      space,
      tags: ['工作', '新的期望'],
    },
  ];

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  const ActivityItem: React.FC<{ item: Activity }> = ({ item }) => {
    return (
      <div className={cls.activityItem}>
        <div className={cls.activityItemHeader}>
          {space.name}
          {item.tags.map((item, index) => {
            return (
              <Tag color="processing" key={index}>
                {item}
              </Tag>
            );
          })}
        </div>
        <Typography.Paragraph>{item.content}</Typography.Paragraph>
        <Row gutter={[6, 6]} className={cls.activityItemImageList}>
          {item.imageList.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <Image src={item.filedata.thumbnail} preview={false}></Image>
              </Col>
            );
          })}
        </Row>
        <div className={cls.activityItemFooter}>
          <Space size="middle">
            <IconText icon={ai.AiOutlineStar} text="2" key="list-vertical-star-o" />
            <IconText icon={ai.AiOutlineLike} text="36" key="list-vertical-star-o" />
            <IconText icon={ai.AiOutlineMessage} text="156" key="list-vertical-star-o" />
          </Space>
        </div>
      </div>
    );
  };

  return (
    <div className={cls.activityList}>
      <BasicTitle title="动态" more="更多"></BasicTitle>
      <Row gutter={[16, 0]}>
        {activityList.map((item, index) => {
          return (
            <Col key={index} span={24}>
              <ActivityItem item={item}></ActivityItem>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ActivityList;
