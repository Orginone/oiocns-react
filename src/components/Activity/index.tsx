import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import {
  Button,
  Col,
  Divider,
  Empty,
  Image,
  Input,
  Popover,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { IActivity, IActivityMessage } from '@/ts/core';
import {
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { shareOpenLink, showChatTime } from '@/utils/tools';
import ActivityPublisher from '@/components/Activity/ActivityPublisher';
import orgCtrl from '@/ts/controller';
import { FileItemShare } from '@/ts/base/model';
import ActivityComment from '@/components/Activity/ActivityComment';
import { XEntity } from '@/ts/base/schema';
import { generateUuid } from '@/ts/base/common';

const Activity: React.FC<{ activity: IActivity; title?: string }> = ({
  activity,
  title,
}) => {
  const [actionList, setActivityList] = useState(activity.activityList);

  const ActivityResponsiveImage: React.FC<{
    item: FileItemShare;
    number: number;
  }> = ({ item, number }) => {
    const [computedHeight, setComputedHeight] = useState(100);
    const id = String(new Date().getTime() + Math.floor(Math.random() * 100));
    useEffect(() => {
      const ele = document.querySelector(`.file-${id}`);
      ele && setComputedHeight(ele.clientWidth);
    }, []);
    return (
      <div
        className={`file-${id}`}
        style={{
          width: computedWidth(number),
          height: computedHeight,
        }}>
        <Image
          width={'100%'}
          height={'100%'}
          src={shareOpenLink(item.shareLink)}
          preview={{
            src: shareOpenLink(item.shareLink),
          }}></Image>
      </div>
    );
  };
  const ActivityItem: React.FC<{ item: IActivityMessage }> = ({ item }) => {
    const [commenting, setCommenting] = useState(false);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState<XEntity | null>(null);
    const [metadata, setMetadata] = useState(item.metadata);

    useEffect(() => {
      const id = item.subscribe(() => {
        setMetadata(item.metadata);
      });
      return () => {
        item.unsubscribe(id);
      };
    }, []);

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
          <EntityIcon entityId={metadata.createUser} showName />
          <span style={{ fontSize: 14 }}>{showChatTime(metadata.createTime)}</span>
          {metadata.tags.map((tag, index) => {
            return (
              <Tag color="processing" key={index}>
                {tag}
              </Tag>
            );
          })}
        </div>
        <div onClick={() => setCommenting(false)}>
          <Typography.Paragraph>{metadata.content}</Typography.Paragraph>
          <div className={cls.activityItemImageList}>
            <Image.PreviewGroup>
              {metadata.resource.map((perItem, index) => {
                return (
                  <ActivityResponsiveImage
                    item={perItem}
                    number={metadata.resource.length}
                    key={index}></ActivityResponsiveImage>
                );
              })}
            </Image.PreviewGroup>
          </div>
        </div>

        <div className={cls.activityItemFooter}>
          <div
            className={cls.activityItemFooterLikes}
            style={{ display: metadata.likes.length ? 'flex' : 'none' }}>
            {metadata.likes.map((userId, index) => {
              return (
                <div key={index} style={{ alignItems: 'center', display: 'flex' }}>
                  <EntityIcon entityId={userId} showName></EntityIcon>
                </div>
              );
            })}
            等{metadata.likes.length}人认为很不错
          </div>
          <Popover
            placement="left"
            content={
              <Space split={<Divider type="vertical" />} size="small">
                <Button
                  type="text"
                  size="small"
                  onClick={async () => {
                    await item.like();
                  }}>
                  {metadata.likes.includes(orgCtrl.user.id) ? (
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

        {metadata.comments.length ? (
          <>
            <div className={cls.activityItemCommentList}>
              {metadata.comments.map((item, index) => {
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
            onClick={async () => {
              await item.comment(comment, replyTo?.id);
            }}>
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
    if (activity.activityList.length < 1 && !loading) {
      activity.load(10).then(() => {
        setActivityList([...activity.activityList]);
      });
      setLoading(false);
    }
    return () => {
      activity.unsubscribe(id);
    };
  }, []);
  const [activityPublisherOpen, setActivityPublisherOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const element = document.querySelector('#' + containerId);
    if (!element) return;
    const height = element.scrollHeight;
    height && setContainerHeight(height);
  }, [activity.activityList]);

  const containerId = 'activity-' + generateUuid();

  const computedWidth = (number: number) => {
    if (number === 1) {
      return '100%';
    }
    if (number % 2 === 0) {
      return '49%';
    }
    if (number % 3 === 0) {
      return '32%';
    }
    return '100%';
  };
  return (
    <div
      className={cls.activityList}
      id={containerId}
      onScroll={(e) => {
        const scrollTop = (e.target as HTMLElement).scrollTop;
        console.log((e.target as HTMLElement).scrollTop, containerHeight);
        console.log(page * 10);
        if (
          scrollTop >= containerHeight &&
          !loading &&
          page * 10 < activity.activityList.length
        ) {
          setLoading(true);
          activity.load(10);
          setPage(page + 1);
        }
      }}>
      <div>
        <BasicTitle
          title={title || '动态'}
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
          {actionList.length === 0 && (
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Empty description={false}></Empty>
            </div>
          )}
        </Row>
        {activity.allPublish && (
          <ActivityPublisher
            open={activityPublisherOpen}
            activity={activity}
            finish={() => {
              setActivityPublisherOpen(false);
            }}></ActivityPublisher>
        )}
        {loading && <Spin></Spin>}
      </div>
    </div>
  );
};

export default Activity;
