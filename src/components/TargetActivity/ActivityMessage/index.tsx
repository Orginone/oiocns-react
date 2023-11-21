import React, { useEffect, useState } from 'react';
// import cls from './index.module.less';
import { Button, Image, Input, List, Space, Tag, Typography } from 'antd';
import { IActivity, IActivityMessage, MessageType, FromOrigin } from '@/ts/core';
import { parseHtmlToText, showChatTime } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import { XEntity } from '@/ts/base/schema';
import ActivityResource from '../ActivityResource';
import ActivityComment from '../ActivityComment';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { AiOutlineDelete, AiOutlineLike, AiOutlineMessage } from '@/icons/ai';

interface ActivityItemProps {
  hideResource?: boolean;
  item: IActivityMessage;
  activity: IActivity;
  messageFrom?: FromOrigin;
}
export const ActivityMessage: React.FC<ActivityItemProps> = ({
  item,
  activity,
  hideResource,
  messageFrom,
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
          <Typography.Paragraph
            ellipsis={hideResource}
            className={hideResource ? 'fs12' : ''}>
            {metadata.content}
          </Typography.Paragraph>
        );
      case MessageType.Html:
        if (hideResource) {
          return (
            <Typography.Paragraph
              ellipsis={hideResource}
              className={hideResource ? 'fs12' : ''}>
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
  const RenderCtxMore: React.FC<ActivityItemProps> = ({ item, messageFrom }) => {
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
        <Space size={2}>
          <Button
            type="text"
            size="small"
            className="activityItem-operate flex"
            onClick={async () => {
              await item.like();
            }}>
            {metadata.likes.includes(orgCtrl.user.id) ? (
              <span className="flex flexCenter">
                <AiOutlineLike className="likeColor pdr4" size={18} />
                <span className="line20">取消</span>
              </span>
            ) : (
              <span className="flex flexCenter">
                <AiOutlineLike size={18} className="pdr4" /> <span>点赞</span>
              </span>
            )}
          </Button>
          <Button
            className="activityItem-operate flex"
            type="text"
            size="small"
            onClick={() => handleReply()}>
            <span className="flex flexCenter">
              <AiOutlineMessage size={18} className="pdr4" /> <span>评论</span>
            </span>
          </Button>
          {item.canDelete && (
            <Button
              className="activityItem-operate flex"
              type="text"
              size="small"
              onClick={() => item.delete()}>
              <span className="flex flexCenter">
                <AiOutlineDelete size={18} className="pdr4" /> <span>删除</span>
              </span>
            </Button>
          )}
        </Space>
      );
    };
    return (
      <>
        <div className={'activityItem-footer'}>
          <div className="flex flexCenter ">
            {messageFrom !== FromOrigin.Person && (
              <EntityIcon
                iconSize={22}
                size={12}
                entityId={metadata.createUser}
                showName
              />
            )}
            <span
              className={`activityTime ${
                messageFrom !== FromOrigin.Person ? 'mgl4' : ''
              }`}>
              发布于{showChatTime(item.metadata.createTime)}
            </span>
          </div>
          {renderOperate()}
        </div>
        <div
          className={'activityItem-footer-likes'}
          style={{ display: metadata.likes.length ? 'flex' : 'none' }}>
          <AiOutlineLike className="likeColor" size={18} />
          {metadata.likes.map((userId) => {
            return (
              <div key={userId}>
                <EntityIcon
                  iconSize={22}
                  size={12}
                  entityId={userId}
                  showName></EntityIcon>
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
          <div>
            <span className="activityItem-name">{activity.metadata.name}</span>
            {/* {metadata.tags.map((tag, index) => {
              return (
                <Tag color="processing" key={index}>
                  {tag}
                </Tag>
              );
            })} */}
          </div>
        }
        avatar={<EntityIcon entity={activity.metadata} size={50} />}
        description={
          <div className={'activityItem'}>
            <div className={'activityItem-content'}>
              {renderContent()}
              {hideResource !== true && (
                <div
                  className={`activityItem-imageList ${
                    metadata.resource?.length ? 'mgt8' : 0
                  }`}>
                  <Image.PreviewGroup>
                    {ActivityResource(metadata.resource, 600)}
                  </Image.PreviewGroup>
                </div>
              )}
            </div>
            {!hideResource && (
              <RenderCtxMore
                item={item}
                hideResource={hideResource}
                activity={activity}
                messageFrom={messageFrom}
              />
            )}
          </div>
        }
      />
    </List.Item>
  );
};

export default ActivityMessage;
