import EntityIcon from '../../Common/GlobalComps/entityIcon';
import React from 'react';
import { CommentType } from '@/ts/base/model';
import cls from './index.module.less';

const ActivityComment: React.FC<{ comment: CommentType }> = ({ comment }) => {
  return (
    <div className={cls.comment}>
      <div className={cls.commentAvatar}>
        <EntityIcon entityId={comment.userId} showName></EntityIcon>:
      </div>
      <div className={cls.commentContent}>{comment.label}</div>
    </div>
  );
};

export default ActivityComment;
