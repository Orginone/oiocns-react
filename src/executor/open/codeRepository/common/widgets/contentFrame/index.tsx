import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  NodeIndexOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { LabelBox } from './labelBox';
import { InputBox } from './inputBox';
import { model } from '@/ts/base';
import { getTimeAgo } from '../../../hook';
import orgCtrl from '@/ts/controller';
import { IRepository } from '@/ts/core/thing/standard/repository';

interface IProps {
  onCreate: (title: string, content: string) => void; //按钮方法
  PRlistData?: model.pullRequestList; //单条pr列表数据 PRlistData存在的时候需要传递onOpenPR，onClosePR
  current: IRepository;
  titleShow?: boolean; //默认值为显示
  onOpenPR?: () => void; //按钮开启pr方法
  onClosePR?: () => void; //按钮关闭pr方法
}
const ContentFrame: React.FC<IProps> = ({
  onCreate,
  PRlistData,
  current,
  titleShow = true,
  onOpenPR,
  onClosePR,
}) => {
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
                        {value.PosterUser?.name} 评论于 {getTimeAgo(value.UpdateUnix)}
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
              if (PRlistData.IsClosed == true) {
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
                        <p className="gev gev4">请重新开启合并请求来完成合并操作。</p>
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
                          <Input.TextArea rows={2} placeholder="请填写内容" />
                        </p>
                        {orgCtrl.user.metadata.belongId ==
                          current.target.metadata.belongId && (
                          <Button
                            type="primary"
                            style={{
                              background: '#21ba45',
                              border: '1px solid #21ba45',
                              margin: '0 0 10px 10px',
                            }}
                            onClick={async () => {
                              try {
                                const res = await current.MergePull({
                                  IssueId: PRlistData.IssueId,
                                  UserName: PRlistData.PosterUser.name,
                                  HeadRepo: PRlistData.HeadRepo,
                                  BaseRepo: PRlistData.BaseRepo,
                                  Status: PRlistData.Status,
                                  HeadBranch: PRlistData.HeadBranch,
                                  BaseBranch: PRlistData.BaseBranch,
                                  HasMerged: PRlistData.HasMerged,
                                  MergeCommitId: PRlistData.MergeCommitId,
                                  MergeBase: PRlistData.MergeBase,
                                });
                                console.log(res);
                                current.pullRequestList.forEach((value, i) => {
                                  if (value.IssueId == res.data.Pull.IssueId) {
                                    current.pullRequestList[i] = {
                                      ...current.pullRequestList[i],
                                      ...res.data.Pull,
                                    };
                                  }
                                });
                                await current.update(current.metadata);
                              } catch (error) {
                                message.warning('该请求已经合并');
                              }
                            }}>
                            合并请求
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              if (PRlistData.Status == 0) {
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
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </>
        )}
        <InputBox
          onCreate={onCreate}
          titleShow={titleShow}
          current={current}
          PRlistData={PRlistData}
          onOpenPR={onOpenPR}
          onClosePR={onClosePR}
        />
      </div>
      <LabelBox />
    </div>
  );
};
export { ContentFrame };
