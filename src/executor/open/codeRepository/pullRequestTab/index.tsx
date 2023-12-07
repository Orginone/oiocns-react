import React, { useEffect, useState } from 'react';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { Avatar, Button, Input, Tabs, Tag, Upload, Select, message } from 'antd';
import type { UploadProps } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  SettingFilled,
  CloseOutlined,
  UserOutlined,
  PartitionOutlined,
  MessageOutlined,
  SubnodeOutlined,
  FileAddOutlined,
  NodeIndexOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import './index.less';
import CodeComparison from '../fileTab/HistoryCommit/CodeComparison';
import { getTimeAgo } from '../hook/index';
import orgCtrl from '@/ts/controller';
import { model } from '@/ts/base';

interface IProps {
  current: IRepository;
  States: number;
  setStates: Function;
  setActiveTabKey: Function;
  setWordOrder: Function;
}

const WordOrderTab: React.FC<IProps> = ({
  current,
  States,
  setStates,
  setActiveTabKey,
  setWordOrder,
}) => {
  const [PRdata, setPRdata] = useState(null);
  //代码提交历史
  const [historyCommitList, setHistoryCommitList] = useState(null);
  //分支列表选项
  const [trees, setTrees] = useState([]);
  //第一个Select框
  const [Select1, setSelect1] = useState('master');
  //
  const [Select2, setSelect2] = useState('master');
  //是否需要比对
  const [IsCompare, setIsCompare] = useState<boolean>();
  const [PRlistTabKey, setPRlistTabKey] = useState();
  //标题
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  //内容
  const [content, setContent] = useState('');
  //开启pr列表关闭状态
  const [PRlistType, setPRlistType] = useState(0);
  //选择的单条pr列表数据
  const [PRlistData, setPRlistData] = useState<model.pullRequestList>();
  useEffect(() => {
    (async () => {
      const data = await current.PullRequestcomparison(`/${Select1 + '...' + Select2}`);
      console.log(data);
      setPRdata(data);
      setIsCompare(data.data.IsCompare);
      setHistoryCommitList(data.data.Commit);
      setTrees(data.data.BaseBranches);
    })();
    return () => {
      setTitle('');
      setContent('');
    };
  }, [Select1, Select2]);

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
  // if (!historyCommitList) {
  //   return <></>;
  // }
  return (
    <div>
      <div className="word_order">
        <div>
          <span
            className="word_order_controller_btn"
            onClick={() => {
              setActiveTabKey('2');
              setWordOrder(0);
            }}>
            标签管理
          </span>
          <span
            className="word_order_controller_btn"
            onClick={() => {
              setActiveTabKey('2');
              setWordOrder(1);
            }}>
            里程碑
          </span>
        </div>
        <Button
          className="word_order_controller_btn_two"
          onClick={() => {
            setStates(1);
          }}>
          创建合并请求
        </Button>
      </div>
      {(() => {
        switch (States) {
          case 0:
            return (
              <>
                <div className="btn_content">
                  <span
                    className={
                      PRlistType == 0 ? 'controller_btn active' : 'controller_btn'
                    }
                    onClick={() => {
                      setPRlistType(0);
                      console.log(current);
                    }}>
                    {current.isPullList(0)?.length}个开启中
                  </span>
                  <span
                    className={
                      PRlistType == 1 ? 'controller_btn active2' : 'controller_btn'
                    }
                    onClick={() => {
                      setPRlistType(1);
                    }}>
                    {current.isPullList(1)?.length}个已关闭
                  </span>
                </div>
                <div>
                  {current.isPullList(PRlistType)?.map((pull) => {
                    return (
                      <div key={pull.IssueId}>
                        <div
                          className="flex"
                          style={{ flexDirection: 'column', cursor: 'pointer' }}
                          onClick={() => {
                            setStates(2);
                            setPRlistData(pull);
                          }}>
                          <div>
                            <Tag color="#1b1c1d">#{pull.IssueId}</Tag>
                            <span>{pull.Name}</span>
                            <div className="gap" style={{ height: '8px' }}></div>
                            <div
                              style={{
                                paddingBottom: '.6rem',
                                borderBottom: '1px dashed #ddd',
                              }}>
                              <p>
                                由
                                <span style={{ color: '#2185d0' }}>
                                  {pull.PosterUser.name}
                                </span>
                                于{getTimeAgo(pull.CreateUnix)}创建
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          case 1:
            return (
              <>
                <h2>对比文件变化</h2>
                <p>对比两个分支间的文件变化并发起一个合并请求。</p>
                <div className="merge">
                  <PartitionOutlined style={{ marginRight: '.4rem' }} />
                  <Select
                    defaultValue={Select1}
                    style={{ width: 120 }}
                    onChange={async (value) => {
                      setSelect1(value);
                    }}
                    options={trees.map((item) => ({ label: item, value: item }))}
                  />
                  <span style={{ margin: '0 .4rem' }}>...</span>
                  <Select
                    defaultValue={Select2}
                    style={{ width: 120 }}
                    onChange={async (value) => {
                      setSelect2(value);
                      console.log(current);
                    }}
                    options={trees.map((item) => ({ label: item, value: item }))}
                  />
                </div>
                <div className="gap"></div>
                {IsCompare ? (
                  current.pullRequestList.some((item) => {
                    const ishas =
                      item.IsClosed == false &&
                      item.HeadRepo ==
                        `${current.directory.target.code}/${current.name}` &&
                      item.BaseRepo ==
                        `${current.directory.target.code}/${current.name}` &&
                      item.HeadBranch == Select2 &&
                      item.BaseBranch == Select1;
                    return ishas;
                  }) ? (
                    <div className="merge_font">
                      已经存在目标分支的合并请求：
                      <span className="file_name_color">
                        {(() => {
                          const data = current.pullRequestList.find((item) => {
                            const ishas =
                              item.IsClosed === false &&
                              item.HeadRepo ===
                                `${current.directory.target.code}/${current.name}` &&
                              item.BaseRepo ===
                                `${current.directory.target.code}/${current.name}` &&
                              item.HeadBranch === Select2 &&
                              item.BaseBranch === Select1;
                            return ishas;
                          });
                          return data.HeadRepo + ` #${data.IssueId}`;
                        })()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="merge_file">
                        <div className="flex" style={{ justifyContent: 'flex-start' }}>
                          <Avatar shape="square" size={40} icon={<UserOutlined />} />
                          <div className="content_edit_style">
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
                            {error && (
                              <div style={{ color: 'red', margin: '5px' }}>{error}</div>
                            )}
                            <div className="gap"></div>
                            <Tabs
                              defaultActiveKey="content_edit"
                              type={'card'}
                              tabBarGutter={0}>
                              <Tabs.TabPane tab="内容编辑" key="content_edit">
                                <Input.TextArea
                                  rows={4}
                                  placeholder="请填写内容"
                                  value={content}
                                  onChange={(e) => {
                                    setContent(e.currentTarget.value);
                                  }}
                                />
                                <div className="gap"></div>
                                <div className="gap"></div>
                                {/* <Upload.Dragger className="upload_style" {...uploadProps}>
                                <p>
                                  <InboxOutlined />
                                </p>
                                <p>文件拖拽到此处或者单击上传</p>
                              </Upload.Dragger> */}
                                <div className="upload_style"></div>
                                <div
                                  className="flex"
                                  style={{ justifyContent: 'flex-end' }}>
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
                                        const res = await current.IsPullRequestcomparison(
                                          `/${Select1 + '...' + Select2}`,
                                        );
                                        const pulldata: model.pullRequestList = {
                                          IssueId: current.pullRequestList.length,
                                          RepoName: current.RepoName,
                                          PosterUser: orgCtrl.user.metadata,
                                          Name: title,
                                          Content: content,
                                          IsClosed: false,
                                          NumComment: 0,
                                          CreateUnix: Date.now(),
                                          UpdateUnix: Date.now(),
                                          Status: res.data.Status,
                                          HeadRepo: `${current.directory.target.code}/${current.name}`,
                                          BaseRepo: `${current.directory.target.code}/${current.name}`,
                                          HeadBranch: Select2,
                                          BaseBranch: Select1,
                                          HasMerged: false,
                                          MergeBase: res.data.MergeBase,
                                          MergeCommitId: '',
                                          MergerUser: '',
                                          MergedUnix: 0,
                                          comment: [
                                            {
                                              Id: Date.now(),
                                              RepoName: current.RepoName,
                                              IssueId: current.pullRequestList.length,
                                              Content:
                                                content || '这个人很懒，什么都没有留下',
                                              CreateUnix: Date.now(),
                                              UpdateUnix: Date.now(),
                                              PosterUser: orgCtrl.user.metadata,
                                            },
                                          ],
                                        };
                                        current.pullRequestList.push(pulldata);
                                        await current.update(current.metadata);
                                        setError('');
                                        setStates(0);
                                      }
                                      console.log(current);
                                      // console.log(orgCtrl.provider, orgCtrl.user.metadata);
                                      console.log(current.pullRequestList);
                                      // setStates(0);
                                    }}>
                                    创建
                                  </Button>
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
                              <div
                                className="flex"
                                style={{ justifyContent: 'flex-end' }}>
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
                      </div>
                      <div className="history_commit">
                        <div
                          className="search_header"
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'flex-start',
                          }}>
                          <p className="commit_history_text">次代码提交</p>
                          <span
                            className="margin_lefts git_verson3"
                            onDoubleClick={() => {}}>
                            {PRdata?.data.BeforeCommitID?.substring(0, 10)}
                          </span>
                          <span className="mar">...</span>
                          <span
                            className="margin_lefts git_verson3"
                            onDoubleClick={() => {}}>
                            {PRdata?.data.AfterCommitID?.substring(0, 10)}
                          </span>
                        </div>
                        {historyCommitList?.map((_item: any, index) => (
                          <div className="flex_align_center commit_info" key={index}>
                            <div className="flex_align_center">
                              <Avatar
                                style={{ backgroundColor: '#87d068' }}
                                icon={<UserOutlined />}
                              />
                              <span className="file_name_color margin_lefts">
                                {_item?.Committer.Name}
                              </span>
                              <span
                                className="margin_lefts git_verson"
                                onDoubleClick={() => {}}>
                                {_item.ID?.substring(0, 10)}
                              </span>
                              <span className="margin_lefts">{_item.Message}</span>
                            </div>
                            <span className="upload_file_color">
                              {getTimeAgo(_item?.Committer.When)}
                            </span>
                          </div>
                        ))}
                        <div className="file_list_table_tag"></div>
                      </div>
                      <CodeComparison
                        current={current}
                        node={PRdata?.data.AfterCommitID}
                        title={true}
                        PRdata={PRdata}
                      />
                    </>
                  )
                ) : (
                  <div className="merge_font">
                    基准和对比分支代码已经同步，无需进行对比。
                  </div>
                )}
              </>
            );
          case 2:
            if (!PRlistData) {
              return <></>;
            }
            return (
              <>
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>
                      <span style={{ color: '#ccc' }}>#{PRlistData.IssueId}</span>
                      <span style={{ margin: '0 5px' }}>{PRlistData.Name}</span>
                    </h2>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: 'white',
                        color: '#21ba45',
                        fontSize: '16px',
                        border: '1px solid #21ba45',
                        padding: '20px 25px',
                        lineHeight: '0px',
                      }}>
                      编辑
                    </Button>
                  </div>
                  <div>
                    {PRlistData.IsClosed ? (
                      <div
                        style={{
                          background: '#db2828',
                          border: '1px solid #db2828',
                          color: 'white',
                          width: '100px',
                          height: '35px',
                          borderRadius: '5px',
                          textAlign: 'center',
                          lineHeight: '35px',
                          display: 'inline-block',
                        }}>
                        <InfoCircleOutlined style={{ fontSize: '16px' }} />
                        已关闭
                      </div>
                    ) : (
                      <div
                        style={{
                          background: '#21ba45',
                          border: '1px solid #21ba45',
                          color: 'white',
                          width: '100px',
                          height: '35px',
                          borderRadius: '5px',
                          textAlign: 'center',
                          lineHeight: '35px',
                          display: 'inline-block',
                        }}>
                        <InfoCircleOutlined style={{ fontSize: '16px' }} />
                        开启中
                      </div>
                    )}

                    <div
                      style={{
                        display: 'inline-block',
                        margin: '0 10px',
                      }}>
                      <span className="file_name_color">
                        {PRlistData.PosterUser.name}
                      </span>
                      请求将 1 次代码提交从
                      <span className="file_name_color">{`${PRlistData.RepoName}/${PRlistData.HeadBranch}`}</span>
                      合并至
                      <span className="file_name_color">{`${PRlistData.RepoName}/${PRlistData.BaseBranch}`}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Tabs
                    onTabClick={(key: any) => {
                      console.log(key);
                      setPRlistTabKey(key);
                    }}
                    defaultActiveKey="1"
                    activeKey={PRlistTabKey}
                    type={'card'}
                    tabBarGutter={0}
                    className="file_name">
                    <Tabs.TabPane
                      tab={
                        <>
                          <span>
                            <MessageOutlined />
                            对话内容
                          </span>
                          <span className="messagehint">{PRlistData.comment.length}</span>
                        </>
                      }
                      key="1">
                      <>
                        <div className="merge_file">
                          <div
                            className="flex"
                            style={{
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                            }}>
                            <div style={{ flex: '1' }}>
                              {PRlistData.comment.map((value) => {
                                return (
                                  <div
                                  className="flex"
                                  style={{
                                    justifyContent: 'flex-start',
                                    marginBottom: '1vh',
                                  }}
                                  key={value.Id}
                                  >
                                  <Avatar
                                    shape="square"
                                    size={40}
                                    icon={<UserOutlined />}
                                  />
                                  <div style={{ flex: '1' }}>
                                    <div
                                      className="content_edit_style"
                                      style={{ padding: 0 }}>
                                      <p className="content_edit_title">
                                        小泥人 评论于 刚刚
                                      </p>
                                      <p className="common_content">这人很懒,留下了个毛</p>
                                    </div>
                                  </div>
                                </div>
                                )
                              })}

                              <div
                                className="flex"
                                style={{
                                  justifyContent: 'flex-start',
                                  marginBottom: '1vh',
                                }}>
                                <div className="gev1">
                                  <NodeIndexOutlined style={{ fontSize: '40px' }} />
                                </div>
                                <div style={{ flex: '1' }}>
                                  <div
                                    className="content_edit_style"
                                    style={{ padding: 0 }}>
                                    <p className="gev gev1">
                                      <CloseOutlined style={{ margin: '5px' }} />
                                      该合并请求存在冲突，无法进行自动合并操作。
                                    </p>
                                    <p className="gev">
                                      <InfoCircleOutlined style={{ margin: '5px' }} />
                                      请手动拉取代码变更以解决冲突。
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="flex"
                                style={{
                                  justifyContent: 'flex-start',
                                  marginBottom: '1vh',
                                }}>
                                <div className="gev2">
                                  <NodeIndexOutlined style={{ fontSize: '40px' }} />
                                </div>
                                <div style={{ flex: '1' }}>
                                  <div
                                    className="content_edit_style"
                                    style={{ padding: 0 }}>
                                    <p className="gev gev2">
                                      <CheckOutlined style={{ margin: '5px' }} />
                                      该合并请求可以进行自动合并操作。
                                    </p>
                                    <p className="gev">提交说明:</p>
                                    <p className="gev">
                                      <Input.TextArea rows={2} placeholder="请填写内容" />
                                    </p>
                                    <Button
                                      type="primary"
                                      style={{
                                        background: '#21ba45',
                                        border: '1px solid #21ba45',
                                        margin: '0 0 10px 10px',
                                      }}>
                                      合并请求
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="flex"
                                style={{
                                  justifyContent: 'flex-start',
                                  marginBottom: '1vh',
                                }}>
                                <div className="gev3">
                                  <NodeIndexOutlined style={{ fontSize: '40px' }} />
                                </div>
                                <div style={{ flex: '1' }}>
                                  <div
                                    className="content_edit_style"
                                    style={{ padding: 0 }}>
                                    <p className="gev gev3">该合并请求已经成功合并！</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="flex"
                                style={{
                                  justifyContent: 'flex-start',
                                  marginBottom: '1vh',
                                }}>
                                <div className="gev4">
                                  <NodeIndexOutlined style={{ fontSize: '40px' }} />
                                </div>
                                <div style={{ flex: '1' }}>
                                  <div
                                    className="content_edit_style"
                                    style={{ padding: 0 }}>
                                    <p className="gev gev4">
                                      请重新开启合并请求来完成合并操作。
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                <Avatar
                                  shape="square"
                                  size={40}
                                  icon={<UserOutlined />}
                                />
                                <div className="content_edit_style">
                                  <div>
                                    <Input placeholder="标题" />
                                    <Tabs
                                      defaultActiveKey="content_edit"
                                      type={'card'}
                                      tabBarGutter={0}>
                                      <Tabs.TabPane tab="内容编辑" key="content_edit">
                                        <Input.TextArea
                                          rows={4}
                                          placeholder="请填写内容"
                                        />
                                        <Upload.Dragger
                                          className="upload_style"
                                          {...uploadProps}>
                                          <p>
                                            <InboxOutlined />
                                          </p>
                                          <p>文件拖拽到此处或者单击上传</p>
                                        </Upload.Dragger>
                                        <div
                                          className="flex"
                                          style={{ justifyContent: 'flex-end' }}>
                                          <Button
                                            type="primary"
                                            style={{
                                              backgroundColor: 'white',
                                              color: 'red',
                                              border: '1px solid red',
                                              margin: '0 5px',
                                            }}>
                                            关闭
                                          </Button>
                                          <Button
                                            type="primary"
                                            style={{
                                              backgroundColor: 'white',
                                              color: '#21ba45',
                                              border: '1px solid #21ba45',
                                              margin: '0 5px',
                                            }}>
                                            重新开启
                                          </Button>
                                          <Button
                                            type="primary"
                                            style={{
                                              background: '#21ba45',
                                              border: '1px solid #21ba45',
                                              margin: '0 5px',
                                            }}>
                                            评论
                                          </Button>
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
                              <div
                                className="flex"
                                style={{ justifyContent: 'flex-end' }}>
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
                              </div>
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
                        </div>
                      </>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                      tab={
                        <>
                          <span>
                            <SubnodeOutlined />
                            代码提交
                          </span>
                          <span className="messagehint">1</span>
                        </>
                      }
                      key="2"></Tabs.TabPane>
                    <Tabs.TabPane
                      tab={
                        <>
                          <span>
                            <FileAddOutlined />
                            文件变动
                          </span>
                          <span className="messagehint">1</span>
                        </>
                      }
                      key="3"></Tabs.TabPane>
                  </Tabs>
                </div>
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
