import React, { useState } from 'react';
import { Input, Card, Avatar, Comment } from 'antd';
import { SearchOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';
import cls from './index.module.less';

type StorageType = {};

const Storage: React.FC<StorageType> = () => {
  const [clickName, setClickName] = useState<number>(0);

  const commentList = [
    { title: '全部', commentNum: 1112 },
    { title: '评论', commentNum: 11 },
    { title: '应用创建', commentNum: 4 },
    { title: '表单创建', commentNum: 11 },
    { title: '新增页面', commentNum: 11 },
    { title: '列表勾选', commentNum: 15 },
  ];

  return (
    <div>
      <div className={cls.commentStyle}>
        <div>
          <Input
            size="middle"
            className={cls.inputStyle}
            placeholder="搜索关键词"
            prefix={<SearchOutlined />}
          />
          <span className={cls.muchSelect}>多选</span>
        </div>
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

        <Card hoverable={true} style={{ marginBottom: '10px', borderRadius: '10px' }}>
          <h4>应用A</h4>
          <Comment
            avatar={
              <Avatar
                size="large"
                shape="square"
                src="https://randomuser.me/api/portraits/men/70.jpg"
              />
            }
            content={
              <div>
                <div className={cls.allTypeMes}>
                  <span className={cls.typeStyle}>类型</span>
                  <span className={cls.typeStyle}>类型</span>
                  <span className={cls.typeStyle}>类型</span>
                </div>
                <div>
                  应用描述应用描述应用描述应用描述应用描述应用描
                  述应用描述应用描述应用描述应用描述应用描述...
                </div>
              </div>
            }
          />
          <Card.Meta
            description={
              <div className={cls.botMes}>
                <div>
                  <span style={{ marginRight: '10px' }}>2022-10-20</span>
                  <span>创建应用暂存</span>
                </div>
                <DeleteOutlined />
              </div>
            }
          />
        </Card>

        <Card hoverable={true} style={{ marginBottom: '10px', borderRadius: '10px' }}>
          <h4>页面名称/场景名称</h4>
          <Comment
            content={
              <div>
                <a style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  共103条勾选
                  <RightOutlined />
                </a>
                <div>
                  {/* 应用描述应用描述应用描述应用描述应用描述应用描述应用描述应用描述应用描述应用描述应用描述... */}
                </div>
              </div>
            }
          />
          <Card.Meta
            description={
              <div className={cls.botMes}>
                <div>
                  <span style={{ marginRight: '10px' }}>2022-10-20</span>
                  <span>创建应用暂存</span>
                </div>
                <DeleteOutlined />
              </div>
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default Storage;
