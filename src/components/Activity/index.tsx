import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import {
  Button,
  Card,
  Divider,
  Empty,
  Image,
  Input,
  List,
  Popover,
  Space,
  Tag,
  Typography,
} from 'antd';
import { IActivity, IActivityMessage, MessageType } from '@/ts/core';
import {
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { parseHtmlToText, shareOpenLink, showChatTime } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import { FileItemShare } from '@/ts/base/model';
import ActivityComment from '@/components/Activity/ActivityComment';
import { XEntity } from '@/ts/base/schema';
import { ScrollView } from 'devextreme-react';
import dxScrollView from 'devextreme/ui/scroll_view';
import { ImBin } from '@/icons/im';
import { command } from '@/ts/base';

interface ActivityProps {
  height: number | string;
  activity: IActivity;
  title?: string;
}

interface ActivityItemProps {
  hideResource?: boolean;
  item: IActivityMessage;
  activity: IActivity;
}
export const ActivityItem: React.FC<ActivityItemProps> = ({
  item,
  activity,
  hideResource,
}) => {
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
  }, [item]);
  const handleReply = async (userId: string = '') => {
    setReplyTo(null);
    if (userId) {
      const user = await orgCtrl.user.findEntityAsync(userId);
      user && setReplyTo(user);
    }
    setCommenting(true);
  };
  const ActivityResponsiveImage: React.FC<{
    item: FileItemShare;
    number: number;
  }> = ({ item, number }) => {
    const computedWidth = (number: number) => {
      if (number > 2) return 'calc(33.3% - 8px)';
      if (number > 1) return 'calc(50% - 8px)';
      return '100%';
    };
    const computedHeight = (number: number) => {
      if (number > 2) return 200;
      if (number > 1) return 300;
      return 500;
    };
    return (
      <div
        style={{
          width: computedWidth(number),
          height: computedHeight(number),
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
  const renderContent = () => {
    switch (metadata.typeName) {
      case MessageType.Text:
        return (
          <Typography.Paragraph ellipsis={hideResource}>
            {metadata.content}
          </Typography.Paragraph>
        );
      case MessageType.Html:
        if (hideResource) {
          return (
            <Typography.Paragraph ellipsis={hideResource}>
              {parseHtmlToText(metadata.content)}
            </Typography.Paragraph>
          );
        } else {
          return (
            <div
              dangerouslySetInnerHTML={{
                __html: metadata.content,
              }}></div>
          );
        }
    }
  };
  const renderCtxMore = () => {
    if (hideResource === true) {
      const userId =
        metadata.likes.length > 0 ? metadata.likes[metadata.likes.length - 1] : '';
      return (
        <>
          <div
            className={cls.activityItemFooterLikes}
            style={{ display: metadata.likes.length ? 'flex' : 'none' }}>
            {metadata.likes.length > 0 && (
              <span style={{ fontSize: 18, color: '#888' }}>
                <HeartFilled style={{ color: '#cb4747', fontSize: 18 }} />
                <b style={{ marginLeft: 6 }}>{metadata.likes.length}</b>
              </span>
            )}
            {userId.length > 0 && (
              <div key={userId} style={{ alignItems: 'center', display: 'flex' }}>
                <EntityIcon entityId={userId} showName></EntityIcon>
              </div>
            )}
            {metadata.comments.length > 0 && (
              <span style={{ fontSize: 18, color: '#888' }}>
                <MessageOutlined style={{ color: '#4747cb', fontSize: 18 }} />
                <b style={{ marginLeft: 6 }}>{metadata.comments.length}</b>
              </span>
            )}
          </div>
        </>
      );
    }
    return (
      <>
        <div
          className={cls.activityItemFooterLikes}
          style={{ display: metadata.likes.length ? 'flex' : 'none' }}>
          <HeartFilled style={{ color: '#cb4747', fontSize: 18 }} />
          {metadata.likes.map((userId) => {
            return (
              <div key={userId} style={{ alignItems: 'center', display: 'flex' }}>
                <EntityIcon entityId={userId} showName></EntityIcon>
              </div>
            );
          })}
        </div>
        {metadata.comments?.length > 0 && (
          <div className={cls.activityItemCommentList}>
            {metadata.comments.map((item) => {
              return (
                <ActivityComment
                  comment={item}
                  key={item.time}
                  onClick={(comment) => handleReply(comment.userId)}></ActivityComment>
              );
            })}
          </div>
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
      </>
    );
  };

  return (
    <List.Item>
      <List.Item.Meta
        title={
          <div style={{ width: '100%' }}>
            <span style={{ fontWeight: 'bold', marginRight: 10 }}>
              {activity.metadata.name}
            </span>
            {metadata.tags.map((tag, index) => {
              return (
                <Tag color="processing" key={index}>
                  {tag}
                </Tag>
              );
            })}
          </div>
        }
        avatar={<EntityIcon entity={activity.metadata} size={50} />}
        description={
          <div className={cls.activityItem}>
            <div onClick={() => setCommenting(false)}>
              {renderContent()}
              {hideResource !== true && (
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
              )}
            </div>
            <div className={cls.activityItemFooter}>
              <div>
                <EntityIcon entityId={metadata.createUser} showName />
                <span className={cls.activityTime}>
                  发布于{showChatTime(item.metadata.createTime)}
                </span>
              </div>
              <div>
                <ImBin
                  color="#888"
                  key="clean"
                  size={16}
                  title="删除动态"
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    await item.delete();
                  }}
                />
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
                            <HeartFilled style={{ color: '#cb4747' }} /> 取消
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
                  <Button type="text" size="middle">
                    <EllipsisOutlined style={{ fontSize: 22 }} />
                  </Button>
                </Popover>
              </div>
            </div>
            {renderCtxMore()}
          </div>
        }
      />
    </List.Item>
  );
};
const Activity: React.FC<ActivityProps> = ({ height, activity, title }) => {
  const ActivityBody: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const [actionList, setActivityList] = useState(activity.activityList);
    useEffect(() => {
      const id = activity.subscribe(() => {
        setActivityList([...activity.activityList]);
      });
      return () => {
        activity.unsubscribe(id);
      };
    }, [activity]);
    if (actionList.length > 0) {
      return actionList.map((actionItem) => (
        <ActivityItem
          key={actionItem.key}
          item={actionItem}
          activity={actionItem.activity}></ActivityItem>
      ));
    }
    return (
      <div className={cls.emptyList}>
        <Empty description={false}></Empty>
      </div>
    );
  };

  const loadMoreActivity = async (component: dxScrollView | undefined) => {
    const news = await activity.load(10);
    if (news.length > 0) {
      activity.changCallback();
    }
    if (component) {
      await component.release(news.length < 10);
    }
  };

  return (
    <Card
      bordered={false}
      title={title || '动态'}
      extra={
        activity.allPublish ? (
          <Button
            type="link"
            onClick={() => {
              command.emitter('config', 'pubActivity', activity);
            }}>
            发布动态
          </Button>
        ) : (
          <></>
        )
      }>
      <ScrollView
        key={activity.key}
        bounceEnabled
        width={'100%'}
        height={height}
        reachBottomText="加载更多..."
        onReachBottom={(e) => loadMoreActivity(e.component)}
        onInitialized={(e) => loadMoreActivity(e.component)}>
        <div className={cls.actionList}>
          <ActivityBody activity={activity} />
        </div>
      </ScrollView>
    </Card>
  );
};

export default Activity;
