import React, { useEffect, useState } from 'react';
// import cls from './index.module.less';
import { Button, Divider, Image, Input, List, Space, Tag, Typography } from 'antd';
import { IActivity, IActivityMessage, MessageType } from '@/ts/core';
import { parseHtmlToText, showChatTime } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import { XEntity } from '@/ts/base/schema';
import ActivityResource from '../ActivityResource';
import ActivityComment from '../ActivityComment';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { AiOutlineDelete, AiOutlineLike, AiOutlineMessage } from 'react-icons/ai';

interface ActivityItemProps {
  hideResource?: boolean;
  item: IActivityMessage;
  activity: IActivity;
}
export const ActivityMessage: React.FC<ActivityItemProps> = ({
  item,
  activity,
  hideResource,
}) => {
  const [metadata, setMetadata] = useState(item.metadata);
  useEffect(() => {
    const id = item.subscribe(() => {
      setMetadata(item.metadata);
    });
    return () => {
      item.unsubscribe(id);
    };
  }, [item]);
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
  const RenderCtxMore: React.FC<ActivityItemProps> = ({ item, hideResource }) => {
    const [commenting, setCommenting] = useState(false);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState<XEntity | null>(null);
    const handleReply = async (userId: string = '') => {
      setReplyTo(null);
      if (userId) {
        const user = await orgCtrl.user.findEntityAsync(userId);
        user && setReplyTo(user);
      }
      setCommenting(true);
    };
    const renderOperate = () => {
      return (
        <Space split={<Divider type="vertical" />} wrap size={2}>
          <Button
            type="text"
            size="small"
            onClick={async () => {
              await item.like();
            }}>
            {metadata.likes.includes(orgCtrl.user.id) ? (
              <>
                {/* <LikeOutlined className={cls.likeColor} /> <span>取消</span> */}
                <AiOutlineLike style={{ color: '#cb4747' }} size={18} /> <span>取消</span>
              </>
            ) : (
              <>
                <AiOutlineLike size={18} /> <span>点赞</span>
              </>
            )}
          </Button>
          <Button type="text" size="small" onClick={() => handleReply()}>
            <AiOutlineMessage size={18} /> <span>评论</span>
          </Button>
          {item.canDelete && (
            <Button type="text" size="small" onClick={() => item.delete()}>
              <AiOutlineDelete size={18} /> <span>删除</span>
            </Button>
          )}
        </Space>
      );
    };
    if (hideResource === true) {
      const showLikes = metadata.likes?.length > 0 || metadata.comments?.length > 0;
      return (
        <>
          {/* <div className={cls.activityItemFooter}> */}
          <div className={'activityItem-footer'}>
            <div>
              <EntityIcon entityId={metadata.createUser} showName />
              {/* <span className={cls.activityTime}> */}
              <span className={'activityTime'}>
                发布于{showChatTime(item.metadata.createTime)}
              </span>
            </div>
          </div>
          {showLikes && (
            // <div className={cls.activityItemFooterLikes}>
            <div className={'activityItem-footer-likes'}>
              {metadata.likes.length > 0 && (
                <span style={{ fontSize: 18, color: '#888' }}>
                  <AiOutlineLike className="likeColor" size={18} />
                  <b style={{ marginLeft: 6 }}>{metadata.likes.length}</b>
                </span>
              )}
              {metadata.comments.length > 0 && (
                <span style={{ fontSize: 18, color: '#888' }}>
                  <AiOutlineMessage style={{ color: '#4747cb' }} size={18} />
                  <b style={{ marginLeft: 6 }}>{metadata.comments.length}</b>
                </span>
              )}
            </div>
          )}
        </>
      );
    }
    return (
      <>
        <div className={'activityItem-footer'}>
          <div>
            <EntityIcon entityId={metadata.createUser} showName />
            <span className={'activityTime'}>
              发布于{showChatTime(item.metadata.createTime)}
            </span>
          </div>
          {!hideResource && <div>{renderOperate()}</div>}
        </div>
        <div
          className={'activityItem-footer-likes'}
          style={{ display: metadata.likes.length ? 'flex' : 'none' }}>
          <AiOutlineLike className="likeColor" size={18} />
          {metadata.likes.map((userId) => {
            return (
              <div key={userId} style={{ alignItems: 'center', display: 'flex' }}>
                <EntityIcon entityId={userId} showName></EntityIcon>
              </div>
            );
          })}
        </div>
        {metadata.comments?.length > 0 && (
          <div className={'activityItem-commentList'}>
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
          className={'activityItem-commentInputBox'}>
          <Input.TextArea
            placeholder={replyTo ? `回复${replyTo.name} :` : ''}
            style={{ height: 12 }}
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}></Input.TextArea>
          <Button
            type="primary"
            size="small"
            onClick={async () => {
              await item.comment(comment, replyTo?.id);
              setCommenting(false);
              setComment('');
              setReplyTo(null);
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
          <div className={'activityItem'}>
            <div>
              {renderContent()}
              {hideResource !== true && (
                <div className={'activityItem-imageList'}>
                  <Image.PreviewGroup>
                    {ActivityResource(metadata.resource, 600)}
                  </Image.PreviewGroup>
                </div>
              )}
            </div>
            <RenderCtxMore item={item} hideResource={hideResource} activity={activity} />
          </div>
        }
      />
    </List.Item>
  );
};

export default ActivityMessage;
