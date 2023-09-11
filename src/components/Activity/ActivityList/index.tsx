import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import { Col, Image, Row, Space, Tag, Typography } from 'antd';
import { Collection } from '@/ts/core';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { model } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';

const ActivityList: React.FC<{ coll: Collection<model.ActivityType> }> = ({ coll }) => {
  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  const ActivityItem: React.FC<{ item: model.ActivityType }> = ({ item }) => {
    return (
      <div className={cls.activityItem}>
        <div className={cls.activityItemHeader}>
          <EntityIcon entityId={item.createUser} showName />
          <span style={{ fontSize: 14 }}>{showChatTime(item.createTime)}</span>
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
          {item.resource.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <Image src={item.thumbnail} preview={false}></Image>
              </Col>
            );
          })}
        </Row>
        <div className={cls.activityItemFooter}>
          <Space size="middle">
            <IconText
              icon={StarOutlined}
              text={`${item.comment.length}`}
              key="list-vertical-star-o"
            />
            <IconText
              icon={LikeOutlined}
              text={`${item.likes.length}`}
              key="list-vertical-star-o"
            />
            <IconText
              icon={MessageOutlined}
              text={`${item.forward.length}`}
              key="list-vertical-star-o"
            />
          </Space>
        </div>
      </div>
    );
  };

  const [actionList, setActivityList] = useState<model.ActivityType[]>([]);

  useEffect(() => {
    coll
      .load({
        options: {
          sort: {
            createTime: -1,
          },
        },
      })
      .then(async (value) => {
        if (value && value.length > 0) {
          setActivityList(value);
        }
      });
  }, []);

  return (
    <div className={cls.activityList}>
      <BasicTitle title="动态" more="更多"></BasicTitle>
      <Row gutter={[16, 0]}>
        {actionList.map((item, index) => {
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
