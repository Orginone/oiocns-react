import { model } from '@/ts/base';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Tabs, message } from 'antd';
import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';

interface IProps {
  onCreate: (title: string, content: string) => void; //按钮方法
  titleShow: boolean;
  PRlistData?: model.pullRequestList; //单条pr列表数据 PRlistData存在的时候需要传递onOpenPR，onClosePR
  current: IRepository;
  onOpenPR?: () => void; //按钮开启pr方法
  onClosePR?: () => void; //按钮关闭pr方法
}
const InputBox: React.FC<IProps> = ({
  onCreate,
  titleShow,
  PRlistData,
  current,
  onOpenPR,
  onClosePR,
}) => {
  //标题
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  //内容
  const [content, setContent] = useState('');
  return (
    <div className="flex">
      <Avatar shape="square" size={40} icon={<UserOutlined />} />
      <div className="content_edit_style">
        {titleShow && (
          <>
            <Input
              placeholder="标题"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
                if (title !== '') {
                  setError('');
                }
              }}
            />
            {error && <div style={{ color: 'red', margin: '5px' }}>{error}</div>}
          </>
        )}

        <Tabs defaultActiveKey="content_edit" type={'card'} tabBarGutter={0}>
          <Tabs.TabPane tab="内容编辑" key="content_edit">
            <Input.TextArea
              rows={4}
              placeholder="请填写内容"
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value);
                console.log(e.currentTarget.value);
              }}
            />
            {/* <Upload.Dragger className="upload_style" {...uploadProps}>
              <p>
                <InboxOutlined />
              </p>
              <p>文件拖拽到此处或者单击上传</p>
            </Upload.Dragger> */}
            <div className="upload_style"></div>
            <div className="flex" style={{ justifyContent: 'flex-end' }}>
              {PRlistData ? (
                <>
                  {/* {PRlistData.IsClosed ? (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: 'white',
                        color: '#21ba45',
                        border: '1px solid #21ba45',
                        margin: '0 5px',
                      }}
                      onClick={onOpenPR}>
                      重新开启
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: 'white',
                        color: 'red',
                        border: '1px solid red',
                        margin: '0 5px',
                      }}
                      onClick={onClosePR}>
                      关闭
                    </Button>
                  )} */}
                  <Button
                    type="primary"
                    style={{
                      background: '#21ba45',
                      border: '1px solid #21ba45',
                      margin: '0 5px',
                    }}
                    // loading={true}
                    onClick={async () => {
                      console.log(PRlistData);
                      if (content) {
                        await onCreate(title, content);
                        setContent('');
                      } else {
                        message.warning('请先填写评论内容');
                      }
                    }}>
                    评论
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    style={{
                      background: '#21ba45',
                      border: '1px solid #21ba45',
                    }}
                    onClick={async () => {
                      if (title === '') {
                        setError('标题不能为空');
                      } else {
                        await onCreate(title, content);
                        setError('');
                      }
                    }}>
                    创建
                  </Button>
                </>
              )}
            </div>
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="效果预览" key="content_privet">
            <Input.TextArea rows={4} placeholder="这是在预览" />
            <div className="gap"></div>
            <div className="gap"></div>
            <Upload.Dragger className="upload_style" {...uploadProps}>
              <p>
                <InboxOutlined />
              </p>
              <p>文件拖拽到此处或者单击上传</p>
            </Upload.Dragger>
            <div className="gap"></div>
            <div className="flex" style={{ justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                style={{
                  background: '#21ba45',
                  border: '1px solid #21ba45',
                }}>
                创建
              </Button>
            </div>
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    </div>
  );
};
export { InputBox };
