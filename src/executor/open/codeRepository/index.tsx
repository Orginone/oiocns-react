import React, { useEffect, useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { ProConfigProvider } from '@ant-design/pro-components';
import './index.less';
import {
  Avatar,
  Button,
  Col,
  Input,
  Row,
  Tabs,
  Tag,
  message,
  Upload,
  Select,
} from 'antd';
import FileHome from './components/Content/FileHome';
import HistoryCommit from './components/Content/HistoryCommit';
import BranchPage from './components/Content/BranchPage';
import VersionPage from './components/Content/VersionPage';
import {
  BranchesOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  PartitionOutlined,
  SettingFilled,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { IRepository } from '@/ts/core/thing/standard/repository';

interface IProps {
  current: IRepository;
  finished: () => void;
}

const { TextArea } = Input;
const { Dragger } = Upload;

const props: UploadProps = {
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

const CodeRepository: React.FC<IProps> = ({ current, finished }) => {
  const [fileStates, setFileStates] = useState(<FileHome current={current} />);

  const handleTabClick = (key: any) => {
    if (key == 1) {
      setFileStates(<FileHome current={current} />);
    } else if (key == 2) {
      setTagsController(3);
      setCreateOrder(false);
    } else if (key == 3) {
      setMerge(0);
    }
  };

  const [tagsController, setTagsController] = useState(0);
  const [merge, setMerge] = useState(0);

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

  return (
    <ProConfigProvider dark={true}>
      <FullScreenModal
        centered
        open={true}
        width={'1200px'}
        destroyOnClose
        fullScreen
        title={current.name}
        onCancel={() => {
          finished();
        }}>
        <div className="gap"></div>
        <h2 className="file_name">
          {current.directory.target.code}/{current.name}
        </h2>
        <div className="gap"></div>
        <Tabs
          onTabClick={handleTabClick}
          defaultActiveKey="1"
          type={'card'}
          tabBarGutter={0}
          style={{ padding: '0 14%' }}>
          <Tabs.TabPane tab="文件" key="1">
            <h3>{current.remark}</h3>
            <div className="gap"></div>

            {/*提交史分支版本发布*/}
            <Row className="history_contianer">
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<HistoryCommit />)}>
                  <ClockCircleOutlined style={{ marginRight: '.4rem' }} />
                  26次提交史
                </p>
              </Col>
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<BranchPage />)}>
                  <BranchesOutlined style={{ marginRight: '.4rem' }} />
                  2个代码分支
                </p>
              </Col>
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<VersionPage />)}>
                  <TagOutlined style={{ marginRight: '.4rem' }} />
                  0版本发布
                </p>
              </Col>
            </Row>
            <div className="gap"></div>
            <div className="gap"></div>

            {fileStates}
          </Tabs.TabPane>
          <Tabs.TabPane tab="工单管理" key="2">
            <div className="word_order">
              <div>
                <span
                  className="word_order_controller_btn"
                  onClick={() => {
                    setTagsController(0);
                  }}>
                  标签管理
                </span>
                <span
                  className="word_order_controller_btn"
                  onClick={() => {
                    setTagsController(1);
                  }}>
                  里程碑
                </span>
              </div>
              {tagsController == 0 ? (
                <Button className="word_order_controller_btn_two">标签管理</Button>
              ) : tagsController == 1 ? (
                <Button className="word_order_controller_btn_two">新的里程碑</Button>
              ) : (
                <Button
                  className="word_order_controller_btn_two"
                  onClick={() => {
                    setCreateOrder(true);
                  }}>
                  创建工单
                </Button>
              )}
            </div>
            {tagsController == 0 ? (
              tagsList.length == 0 ? (
                <div className="word_order_content">
                  <Tag color="#1b1c1d">0个标签</Tag>
                  <div className="tags_popup">
                    <h3>加载预定义的标签模板</h3>
                    <p>
                      此仓库还未创建任何标签，您可以通过上方的“创建标签”创建一个新的标签或加载一组预定义的标签。
                    </p>
                    <div className="gap" />
                    <div className="gap" />
                    <Input placeholder="Default" />
                    <div className="gap" />
                    <div className="gap" />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button type="primary">加载标签模板</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tags_list_content">
                  <div>
                    <Tag color="#1b1c1d">{tagsList.length}个标签</Tag>
                  </div>
                  <div className="gap"></div>
                  {tagsList.map((item) => (
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
              )
            ) : tagsController == 1 ? (
              <div className="word_order_content">
                <div style={{ display: 'flex' }}>
                  <span className="word_order_controller_btn">0开启中</span>
                  <span className="word_order_controller_btn">标签管理</span>
                </div>
              </div>
            ) : createOrder ? (
              <>
                <div className="flex" style={{ justifyContent: 'flex-start' }}>
                  <Avatar shape="square" size={40} icon={<UserOutlined />} />
                  <div className="content_edit_style">
                    <Input placeholder="标题" />
                    <div className="gap"></div>
                    <Tabs defaultActiveKey="content_edit" type={'card'} tabBarGutter={0}>
                      <Tabs.TabPane tab="内容编辑" key="content_edit">
                        <TextArea rows={4} placeholder="请填写内容" />
                        <div className="gap"></div>
                        <div className="gap"></div>
                        <Dragger className="upload_style" {...props}>
                          <p>
                            <InboxOutlined />
                          </p>
                          <p>文件拖拽到此处或者单击上传</p>
                        </Dragger>
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
                        <TextArea rows={4} placeholder="这是在预览" />
                        <div className="gap"></div>
                        <div className="gap"></div>
                        <Dragger className="upload_style" {...props}>
                          <p>
                            <InboxOutlined />
                          </p>
                          <p>文件拖拽到此处或者单击上传</p>
                        </Dragger>
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
                <div className="flex" style={{ justifyContent: 'flex-start' }}>
                  <Avatar shape="square" size={40} icon={<UserOutlined />} />
                  <div className="content_edit_style" style={{ padding: 0 }}>
                    <p className="content_edit_title">小泥人 评论于 刚刚</p>
                    <p className="common_content">这人很懒,留下了个毛</p>
                  </div>
                </div>
                <div className="gap"></div>
              </>
            ) : (
              <div
                className="flex"
                style={{ flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => {
                  setCreateOrder(true);
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
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="合并请求" key="3">
            <h2>对比文件变化</h2>
            <p>对比两个分支间的文件变化并发起一个合并请求。</p>
            <div className="gap"></div>
            <div className="merge">
              <PartitionOutlined style={{ marginRight: '.4rem' }} />
              <Select
                defaultValue="master"
                style={{ width: 120 }}
                options={[
                  {
                    value: 'master',
                    label: 'master',
                  },
                  {
                    value: 'branch',
                    label: 'branch',
                  },
                  {
                    value: 'branch1',
                    label: 'branch1',
                  },
                ]}
              />
              <span style={{ margin: '0 .4rem' }}>...</span>
              <Select
                defaultValue="branch"
                style={{ width: 120 }}
                options={[
                  {
                    value: 'master',
                    label: 'master',
                  },
                  {
                    value: 'branch',
                    label: 'branch',
                  },
                  {
                    value: 'branch1',
                    label: 'branch1',
                  },
                ]}
              />
            </div>
            <div className="gap"></div>
            <div className="merge_file">
              <p>比对结果渲染框</p>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </FullScreenModal>
    </ProConfigProvider>
  );
};
export default CodeRepository;
