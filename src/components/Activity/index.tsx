import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import { Button, Col, Image, Row, Space, Tag, Typography } from 'antd';
import { IActivity } from '@/ts/core';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { model } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import ActivityPublisher from '@/components/Activity/ActivityPublisher';

const Activity: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const [actionList, setActivityList] = useState(activity.activityList);
  const IconText = ({
    icon,
    text,
    onClick,
  }: {
    icon: React.FC;
    text: string;
    onClick?: () => void;
  }) => (
    <Space onClick={onClick}>
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
          {item.tags.map((tag, index) => {
            return (
              <Tag color="processing" key={index}>
                {tag}
              </Tag>
            );
          })}
        </div>
        <Typography.Paragraph>{item.content}</Typography.Paragraph>
        <Row gutter={[6, 6]} className={cls.activityItemImageList}>
          {item.resource.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <Image
                  src={item.thumbnail}
                  preview={{
                    src: `/orginone/kernel/load/${item.shareLink}`,
                  }}></Image>
              </Col>
            );
          })}
        </Row>
        <div className={cls.activityItemFooter}>
          <Space size="middle">
            <IconText
              icon={StarOutlined}
              text={`${item.comments?.length ?? 0}`}
              key="list-vertical-star-o"
            />
            <IconText
              icon={LikeOutlined}
              text={`${item.likes.length}`}
              key="list-vertical-star-o"
              onClick={() => activity.links(item)}
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

  useEffect(() => {
    const id = activity.subscribe(() => {
      setActivityList([...activity.activityList]);
    });
    if (activity.activityList.length < 1) {
      activity.load(10).then(() => {
        setActivityList([...activity.activityList]);
      });
    }
    return () => {
      activity.unsubscribe(id);
    };
  }, []);
  const [activityPublisherOpen, setActivityPublisherOpen] = useState(false);

  return (
    <div className={cls.activityList}>
      <BasicTitle
        title="动态"
        onClick={() => activity.load(10)}
        left={
          <Button
            type="link"
            onClick={() => {
              activity.allPublish && setActivityPublisherOpen(true);
            }}>
            发布动态
          </Button>
        }></BasicTitle>
      <Row gutter={[16, 0]}>
        {actionList.map((item, index) => {
          return (
            <Col key={index} span={24}>
              <ActivityItem item={item}></ActivityItem>
            </Col>
          );
        })}
      </Row>
      {activity.allPublish && (
        <ActivityPublisher
          open={activityPublisherOpen}
          activity={activity}
          finish={() => {
            setActivityPublisherOpen(false);
          }}></ActivityPublisher>
      )}
    </div>
  );
};

export default Activity;
