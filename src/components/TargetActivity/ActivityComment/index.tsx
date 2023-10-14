import EntityIcon from '../../Common/GlobalComps/entityIcon';
import React from 'react';
import { CommentType } from '@/ts/base/model';
import cls from './index.module.less';
import UserInfo from '../UserInfo';

const ActivityComment: React.FC<{
  comment: CommentType;
  onClick: (comment: CommentType) => void;
}> = ({ comment, onClick }) => {
  return (
    <div className={cls.comment} onClick={() => onClick(comment)}>
      <div className={cls.commentAvatar}>
        <EntityIcon entityId={comment.userId} showName></EntityIcon>
      </div>
      <div className={cls.commentContent}>
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
