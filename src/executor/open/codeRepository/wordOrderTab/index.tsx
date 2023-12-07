import React, { useEffect, useState } from 'react';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { Avatar, Button, Input, Tabs, Tag, Upload } from 'antd';
import type { UploadProps } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  SettingFilled,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface IProps {
  current: IRepository;
  States: number;
  setStates: Function;
}

const WordOrderTab: React.FC<IProps> = ({ current, States, setStates }) => {
  //0标签管理，1里程碑,2工单列表，3创建功能按钮状态
  const [tagsController, setTagsController] = useState(0);
  //创建工单按钮状态
  const [createOrder, setCreateOrder] = useState(false);

  /**
   * 颜色自行加键值对
   */
  const tagsList = [
    {
      id: 1,
      tagsName: 'bug',
      tagCount: 0,
      btnColor: '#3D5A80',
    },
    {
      id: 2,
      tagsName: 'duplicate',
      tagCount: 0,
      btnColor: '#1F2D3D',
    },
    {
      id: 3,
      tagsName: 'enhancement',
      tagCount: 0,
      btnColor: '#385E7C',
    },
    {
      id: 4,
      tagsName: 'help wanted',
      tagCount: 0,
      btnColor: '#2D4561',
    },
    {
      id: 5,
      tagsName: 'invalid',
      tagCount: 0,
      btnColor: '#1F2D3D',
    },
    {
      id: 6,
      tagsName: 'question',
      tagCount: 0,
      btnColor: '#1D2D3D',
    },
    {
      id: 7,
      tagsName: 'ree',
      tagCount: 0,
      btnColor: '#2F5082',
    },
  ];
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <div>
      <div className="word_order">
        <div>
          <span
            className="word_order_controller_btn"
            onClick={() => {
              setStates(0);
            }}>
            标签管理
          </span>
          <span
            className="word_order_controller_btn"
            onClick={() => {
              setStates(1);
            }}>
            里程碑
          </span>
        </div>
        {(() => {
          switch (States) {
            case 0:
              return <Button className="word_order_controller_btn_two">标签管理</Button>;
            case 1:
              return (
                <Button className="word_order_controller_btn_two">新的里程碑</Button>
              );
            case 2:
            case 3:
              return (
                <Button
                  className="word_order_controller_btn_two"
                  onClick={() => {
                    setStates(3);
                  }}>
                  创建工单
                </Button>
              );
            default:
              return <></>;
          }
        })()}
      </div>
      {(() => {
        switch (States) {
          case 0:
            return (
              <div className="tags_list_content">
                <div className="tag">
                  <Tag color="#1b1c1d">{tagsList?.length}个标签</Tag>
                </div>
                {tagsList?.map((item) => (
                  <div className="flex tags_list_items" key={item.id}>
                    <Tag
                      className="tags_list_items_tag"
                      icon={<TagOutlined style={{ rotate: '270deg' }} />}
                      color={item.btnColor}>
                      {item.tagsName}
                    </Tag>
                    <div className="tags_list_btn_list">
                      <span className="tags_list_btn_list_item">
                        <InfoCircleOutlined
                          style={{ rotate: '180deg', marginRight: '.6rem' }}
                        />
                        {item.tagCount}个已开启的工单
                      </span>
                      <span className="tags_list_btn_list_item">
                        <EditOutlined style={{ marginRight: '.4rem' }} />
                        编辑
                      </span>
                      <span className="tags_list_btn_list_item">
                        <DeleteOutlined style={{ marginRight: '.4rem' }} />
                        删除
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          case 1:
            return (
              <div className="word_order_content">
                <div style={{ display: 'flex' }}>
                  <span className="word_order_controller_btn">0开启中</span>
                  <span className="word_order_controller_btn">标签管理</span>
                </div>
              </div>
            );
          case 2:
            return (
              <div
                className="flex"
                style={{ flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => {
                  setStates(3);
                }}>
                <div>
                  <Tag color="#1b1c1d">#2</Tag>
                  <span>124</span>
                  <div className="gap" style={{ height: '8px' }}></div>
                  <div
                    style={{ paddingBottom: '.6rem', borderBottom: '1px dashed #ddd' }}>
                    <p>
                      由<span style={{ color: '#2185d0' }}>小泥人</span>于38分钟前创建
                    </p>
                  </div>
                </div>
              </div>
            );
          case 3:
            return (
              <>
                <div className="flex" style={{ justifyContent: 'flex-start' }}>
                  <Avatar shape="square" size={40} icon={<UserOutlined />} />
                  <div className="content_edit_style">
                    <Input placeholder="标题" />
                    <div className="gap"></div>
                    <Tabs defaultActiveKey="content_edit" type={'card'} tabBarGutter={0}>
                      <Tabs.TabPane tab="内容编辑" key="content_edit">
                        <Input.TextArea rows={4} placeholder="请填写内容" />
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
                            创建工单
                          </Button>
                        </div>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="效果预览" key="content_privet">
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
                            创建工单
                          </Button>
                        </div>
                      </Tabs.TabPane>
                    </Tabs>
                  </div>
                  <div className="tags_content_right">
                    <p className="tags_content_right_title">
                      标签 <SettingFilled />
                    </p>
                    <p className="tags_content_right_desc">未选择标签</p>
                    <div className="gap"></div>
                    <p className="tags_content_right_title">
                      里程碑 <SettingFilled />
                    </p>
                    <p className="tags_content_right_desc">未选里程碑</p>
                    <div className="gap"></div>
                    <p className="tags_content_right_title">
                      指派成员 <SettingFilled />
                    </p>
                    <p className="tags_content_right_desc">未指派成员</p>
                  </div>
                </div>
                <div className="gap"></div>
                <div className="gap"></div>
                <div
                  className="flex"
                  style={{ justifyContent: 'flex-start', margin: '1vh 0' }}>
                  <Avatar shape="square" size={40} icon={<UserOutlined />} />
                  <div className="content_edit_style" style={{ padding: 0 }}>
                    <p className="content_edit_title">小泥人 评论于 刚刚</p>
                    <p className="common_content">这人很懒,留下了个毛</p>
                  </div>
                </div>
                <div className="gap"></div>
              </>
            );
          default:
            return <></>;
        }
      })()}
    </div>
  );
};
export default WordOrderTab;
