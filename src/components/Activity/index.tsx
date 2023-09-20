import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import {
  Button,
  Col,
  Divider,
  Image,
  Input,
  Popover,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { IActivity } from '@/ts/core';
import {
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { model } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import ActivityPublisher from '@/components/Activity/ActivityPublisher';
import orgCtrl from '@/ts/controller';
import { ActivityType } from '@/ts/base/model';
import ActivityComment from '@/components/Activity/ActivityComment';
import { XEntity } from '@/ts/base/schema';

const Activity: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const [actionList, setActivityList] = useState(activity.activityList);

  const ActivityItem: React.FC<{ item: model.ActivityType }> = ({ item }) => {
    const [commenting, setCommenting] = useState(false);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState<XEntity | null>(null);
    const handleComment = async (currentActivity: ActivityType, content: string) => {
      if (!content) return;
      let reply;
      if (replyTo) {
        reply = replyTo.id;
      }
      await activity.comment(currentActivity, content, reply);
    };

    const handleReply = async (userId: string = '') => {
      setReplyTo(null);
      if (userId) {
        const user = await orgCtrl.user.findEntityAsync(userId);
        user && setReplyTo(user);
      }
      setCommenting(true);
    };
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
        <div onClick={() => setCommenting(false)}>
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
        </div>

        <div className={cls.activityItemFooter}>
          <div
            className={cls.activityItemFooterLikes}
            style={{ display: item.likes.length ? 'flex' : 'none' }}>
            {item.likes.map((userId, index) => {
              return (
                <div key={index} style={{ alignItems: 'center', display: 'flex' }}>
                  <EntityIcon entityId={userId} showName></EntityIcon>
                </div>
              );
            })}
            等{item.likes.length}人认为很不错
          </div>
          <Popover
            placement="left"
            content={
              <Space split={<Divider type="vertical" />} size="small">
                <Button type="text" size="small" onClick={() => activity.like(item)}>
                  {item.likes.includes(orgCtrl.user.id) ? (
                    <>
                      <HeartFilled style={{ color: 'red' }} /> 取消
                    </>
                  ) : (
                    <>
                      <HeartOutlined /> 赞
                    </>
                  )}
                </Button>
                <Button type="text" size="small" onClick={() => handleReply()}>
                  <MessageOutlined /> 评论
                </Button>
              </Space>
            }
            trigger="click">
            <Button type="text" size="small">
              <EllipsisOutlined />
            </Button>
          </Popover>
        </div>

        {item.comments.length ? (
          <>
            <div className={cls.activityItemCommentList}>
              {item.comments.map((item, index) => {
                return (
                  <ActivityComment
                    comment={item}
                    key={index}
                    onClick={(comment) => handleReply(comment.userId)}></ActivityComment>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}

        <div
          style={{ display: commenting ? 'flex' : 'none' }}
          className={cls.activityItemCommentInputBox}>
          <Input.TextArea
            placeholder={replyTo ? `回复${replyTo.name} :` : ''}
            style={{ height: 12 }}
            onChange={(e) => setComment(e.currentTarget.value)}></Input.TextArea>
          <Button
            type="primary"
            size="small"
            onClick={() => handleComment(item, comment)}>
            发送
          </Button>
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
