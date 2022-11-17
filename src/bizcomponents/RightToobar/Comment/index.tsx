import React, { useState } from 'react';
import { Comment, Avatar } from 'antd';

import { RightOutlined } from '@ant-design/icons';

import cls from './index.module.less';

type CommentType = {
  children?: React.ReactNode;
};

const NoAvatarComment: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className={cls.editStyle}>
    <Comment
      content={
        <div>
          <div>杭电应用：谢谢大家喜欢，这是评论这是评论这还是</div>
          <div className={cls.textInner}>2016-11-22 10:22:3</div>
          <a className={cls.textInner}>
            共28条回复 <RightOutlined style={{ fontSize: '12px' }} />
          </a>
        </div>
      }>
      {children}
    </Comment>
  </div>
);

const AvatarComment: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Comment
    author={<a className={cls.titleStyle}>杭电应用</a>}
    avatar={
      <Avatar src="https://randomuser.me/api/portraits/women/1.jpg" alt="杭电应用" />
    }
    content={<span>这是评论这是评论哈哈哈真好啊，评论评论</span>}
    datetime={
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span> 2016-11-22 10:22:3</span>
        <span style={{ marginLeft: '80px' }}>111</span>
      </div>
    }>
    {children}
  </Comment>
);

const commentList = [
  { title: '全部评论', commentNum: 11 },
  { title: '公开评论', commentNum: 11 },
  { title: '未读评论', commentNum: 11 },
];

const CommentList: React.FC<CommentType> = () => {
  const [clickName, setClickName] = useState<number>(0);
  return (
    <div>
      <div className={cls.commentMes}>
        {commentList.map((item, index) => {
          return (
            <div
              key={index}
              className={`${cls.allComment} ${
                index === clickName ? cls.selectAllComment : ''
              }`}
              onClick={() => {
                setClickName(index);
              }}>{`${item.title}(${item.commentNum})`}</div>
          );
        })}
      </div>
      {[1, 2, 3].map((index) => {
        return (
          <AvatarComment key={index}>
            <div className={cls.contentStyle}>
              <NoAvatarComment></NoAvatarComment>
            </div>
          </AvatarComment>
        );
      })}
    </div>
  );
};

export default CommentList;
