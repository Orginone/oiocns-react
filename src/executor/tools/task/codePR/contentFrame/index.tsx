import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  NodeIndexOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { model } from '@/ts/base';
import { getTimeAgo } from '@/executor/open/codeRepository/hook';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { IWorkTask } from '@/ts/core/work/task';

interface IProps {
  PRlistData?: model.pullRequestList; //单条pr列表数据 PRlistData存在的时候需要传递onOpenPR，onClosePR
  current: IWorkTask;
  Repository: IRepository;
  finished: () => void;
}
const ContentFrame: React.FC<IProps> = ({
  PRlistData,
  Repository,
  current,
  finished,
}) => {
  const [textarea, setTextarea] = useState<string>('');
  return (
    <div
      className="merge_file"
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <div style={{ flex: '1' }}>
        {PRlistData && (
          <>
            {PRlistData.comment.map((value) => {
              return (
                <div
                  className="flex"
                  style={{
                    justifyContent: 'flex-start',
                    marginBottom: '1vh',
                  }}
                  key={value.Id}>
                  <Avatar
                    shape="square"
                    size={40}
                    icon={<UserOutlined />}
                    src={
                      value.PosterUser ? JSON.parse(value.PosterUser.icon).shareLink : ''
                    }
                  />
                  <div style={{ flex: '1' }}>
                    <div className="content_edit_style" style={{ padding: 0 }}>
                      <p className="content_edit_title">
                        {value.PosterUser?.name} 发布于 {getTimeAgo(value.UpdateUnix)}
                      </p>
                      <p className="common_content">{value.Content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {(() => {
              if (PRlistData.HasMerged == true) {
                return (
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
                      <div className="content_edit_style" style={{ padding: 0 }}>
                        <p className="gev gev3">该合并请求已经成功合并！</p>
                      </div>
                    </div>
                  </div>
                );
              }
              if (current.taskdata.status == 200) {
                return (
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
                      <div className="content_edit_style" style={{ padding: 0 }}>
                        <p className="gev gev4">
                          该合并已被关闭，请重新进行提交来完成合并操作。
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              if (PRlistData.Status == 2) {
                return (
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
                      <div className="content_edit_style" style={{ padding: 0 }}>
                        <p className="gev gev2">
                          <CheckOutlined style={{ margin: '5px' }} />
                          该合并请求可以进行自动合并操作。
                        </p>
                        <p className="gev">提交说明:</p>
                        <p className="gev">
                          <Input.TextArea
                            rows={2}
                            placeholder="请填写内容"
                            value={textarea}
                            onChange={(e) => {
                              setTextarea(e.target.value);
                            }}
                          />
                        </p>
                        {current?.instance?.status == 1 &&
                          current.taskdata.approveType == '审批' && (
                            <>
                              <Button
                                type="primary"
                                style={{
                                  background: '#21ba45',
                                  border: '1px solid #21ba45',
                                  margin: '0 0 10px 10px',
                                }}
                                onClick={async () => {
                                  try {
                                    await current.approvalCodeTask(
                                      100,
                                      textarea,
                                      Repository,
                                      PRlistData,
                                    );
                                    setTextarea('');
                                    finished();
                                  } catch (error) {
                                    message.warning('该请求已经合并');
                                  }
                                }}>
                                合并请求
                              </Button>
                              <Button
                                type="primary"
                                style={{
                                  background: '#ff4d4f',
                                  border: '1px solid #ff4d4f',
                                  margin: '0 0 10px 10px',
                                }}
                                onClick={async () => {
                                  await current.approvalCodeTask(
                                    200,
                                    textarea,
                                    Repository,
                                  );
                                  setTextarea('');
                                  finished();
                                }}>
                                驳回
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              }
              if (PRlistData.Status == 0 || PRlistData.Status == -1) {
                return (
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
                      <div className="content_edit_style" style={{ padding: 0 }}>
                        <p className="gev gev1">
                          <CloseOutlined style={{ margin: '5px' }} />
                          该合并请求存在冲突，无法进行自动合并操作。
                        </p>
                        <p className="gev">
                          <InfoCircleOutlined style={{ margin: '5px' }} />
                          请手动拉取代码变更以解决冲突。
                        </p>
                        <p className="gev">
                          <Input.TextArea
                            rows={2}
                            placeholder="请填写内容"
                            value={textarea}
                            onChange={(e) => {
                              setTextarea(e.target.value);
                            }}
                          />
                        </p>
                        {current?.instance?.status == 1 &&
                          current.taskdata.approveType == '审批' && (
                            <>
                              <Button
                                type="primary"
                                style={{
                                  background: '#ff4d4f',
                                  border: '1px solid #ff4d4f',
                                  margin: '0 0 10px 10px',
                                }}
                                onClick={async () => {
                                  await current.approvalCodeTask(
                                    200,
                                    textarea,
                                    Repository,
                                  );
                                  setTextarea('');
                                  finished();
                                }}>
                                驳回
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </>
        )}
      </div>
      <div style={{ width: '8vw', height: '200px' }}></div>
      {/* <LabelBox /> */}
    </div>
  );
};
export { ContentFrame };
