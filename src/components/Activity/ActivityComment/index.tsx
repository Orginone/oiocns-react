import EntityIcon from '../../Common/GlobalComps/entityIcon';
import React from 'react';
import { CommentType } from '@/ts/base/model';
import UserInfo from '@/components/Activity/UserInfo';

const ActivityComment: React.FC<{
  comment: CommentType;
  onClick: (comment: CommentType) => void;
}> = ({ comment, onClick }) => {
  return (
    <div className="oio-activity-list-item-comment-list-item" onClick={() => onClick(comment)}>
      <div className="oio-activity-list-item-comment-list-item-avatar">
        <EntityIcon entityId={comment.userId} showName></EntityIcon>
      </div>
      <div className="oio-activity-list-item-comment-list-item-content">
        {comment.replyTo ? (
          <>
            回复 <UserInfo userId={comment.replyTo}></UserInfo> ：
          </>
        ) : (
          <></>
        )}
        {comment.label}
      </div>
    </div>
  );
};

export default ActivityComment;
