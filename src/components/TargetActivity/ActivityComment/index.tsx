import EntityIcon from '../../Common/GlobalComps/entityIcon';
import React from 'react';
import { CommentType } from '@/ts/base/model';
import UserInfo from '../UserInfo';

const ActivityComment: React.FC<{
  comment: CommentType;
  onClick: (comment: CommentType) => void;
}> = ({ comment, onClick }) => {
  return (
    <div className="activityCommet" onClick={() => onClick(comment)}>
      <div className={'activityCommet-avatar'}>
        <EntityIcon entityId={comment.userId} showName></EntityIcon>
      </div>
      <div className={'activityCommet-content'}>
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
