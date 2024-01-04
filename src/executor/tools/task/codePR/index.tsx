import React, { useState, useEffect } from 'react';
import { Card, Tabs, Timeline } from 'antd';
import { IWorkTask } from '@/ts/core/work/task';
import {
  FileAddOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  SubnodeOutlined,
} from '@ant-design/icons';
// import { ContentFrame } from '@/executor/open/codeRepository/common';
import { ContentFrame } from './contentFrame';
import { CodeCommit } from '@/executor/open/codeRepository/pullRequestTab/codeCommit';
import { CodeFiles } from '@/executor/open/codeRepository/pullRequestTab/codeFiles';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { IWork } from '@/ts/core';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */
interface IProps {
  current: IWorkTask;
  finished: () => void;
}

const CodePR: React.FC<IProps> = ({ current, finished }) => {
  //流程实例内的单条pr instanceData
  const [PRlistData, setPRlistData] = useState<any>();
  const [PRlistTabKey, setPRlistTabKey] = useState<string>('1');
  const [titleKeyData, setTitleKeyData] = useState<any>(null);
  const [Repository, setRepository] = useState<IRepository>();
  const [Work, setWork] = useState<IWork>();
  const a = async () => {
    // setPRlistData(current?.instanceData?.data?.[0]?.pulldata);
    const result = await current.findCodeWorkById(current.taskdata.defineId);
    if (result) {
      const [repository, work] = result;
      const prdata = repository.findPRByIssueId(
        current?.instanceData?.data?.[0]?.pulldata.IssueId,
      );
      setPRlistData(prdata);
      setRepository(repository);
      setWork(work);
      if (prdata) {
        const res = await repository.PRCommits({
          IssueId: prdata?.IssueId,
          UserName: prdata?.PosterUser.name,
          HeadRepo: prdata?.HeadRepo,
          BaseRepo: prdata?.BaseRepo,
          Status: prdata?.Status,
          HeadBranch: prdata?.HeadBranch,
          BaseBranch: prdata?.BaseBranch,
          HasMerged: prdata?.HasMerged,
          MergeCommitId: prdata?.MergeCommitId,
          MergeBase: prdata?.MergeBase,
        });
        setTitleKeyData(res.data);
      }
    }
  };
  useEffect(() => {
    a();
  }, []);
  /** 加载时间条 */
  const loadTimeline = () => {
    if (current.instance) {
      return (
        <Timeline>
          <Timeline.Item color={'green'}>
            <Card>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '24px' }}>起始</div>
                <div style={{ paddingRight: '24px' }}>
                  {current.instance.createTime.substring(
                    0,
                    current.instance.createTime.length - 4,
                  )}
                </div>
                <div style={{ paddingRight: '24px' }}>
                  发起人：
                  <EntityIcon entityId={current.instance.createUser} showName />
                </div>
                <div style={{ paddingRight: '24px' }}>{current.instance.content}</div>
              </div>
            </Card>
          </Timeline.Item>
          {current.instance.tasks
            ?.filter((a) => a.status >= 100)
            ?.sort((a, b) => (a.createTime < b.createTime ? -1 : 1))
            .map((item, index) => {
              return (
                <div key={`${item.id}_100_${index}`}>
                  {item.records?.map((record) => {
                    return (
                      <Timeline.Item key={`${record.id}_${index}`} color={'green'}>
                        <Card>
                          <div style={{ display: 'flex' }}>
                            <div style={{ paddingRight: '24px' }}>
                              {item.node?.nodeType}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              {item.createTime.substring(0, item.createTime.length - 4)}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              审批人：
                              <EntityIcon entityId={record.createUser} showName />
                            </div>
                            <div>审批结果：{record.status < 200 ? '通过' : '拒绝'}</div>
                            <div>
                              {record.comment && <div>审批意见：{record.comment}</div>}
                            </div>
                          </div>
                        </Card>
                      </Timeline.Item>
                    );
                  })}
                </div>
              );
            })}
          {current.instance.tasks
            ?.filter((a) => a.status < 100)
            ?.sort((a, b) => (a.createTime < b.createTime ? -1 : 1))
            .map((item, index) => {
              return (
                <div key={`${item.id}_1_${index}`}>
                  <Timeline.Item color={'red'}>
                    <Card>
                      <div style={{ display: 'flex' }}>
                        <div style={{ paddingRight: '24px' }}>{item.node?.nodeType}</div>
                        <div style={{ paddingRight: '24px' }}>
                          {item.createTime.substring(0, item.createTime.length - 4)}
                        </div>
                        <div style={{ color: 'red' }}>待审批</div>
                      </div>
                    </Card>
                  </Timeline.Item>
                </div>
              );
            })}
        </Timeline>
      );
    }
    return <></>;
  };
  if (!PRlistData || !Repository || !Work) {
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
        </div>
        <div>
          {(() => {
            if (PRlistData.HasMerged) {
              return (
                <div
                  style={{
                    background: '#a333c8',
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
                  已合并
                </div>
              );
            } else if (current.taskdata.status == 200) {
              return (
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
              );
            } else {
              return (
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
              );
            }
          })()}

          <div
            style={{
              display: 'inline-block',
              margin: '0 10px',
            }}>
            <span className="file_name_color">{PRlistData.PosterUser.name}</span>
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
              <ContentFrame
                current={current}
                Repository={Repository}
                PRlistData={PRlistData}
                finished={finished}
              />
            </>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <span>
                  <SubnodeOutlined />
                  代码提交
                </span>
                <span className="messagehint">{titleKeyData?.NumInfo?.NumCommits}</span>
              </>
            }
            key="2">
            <CodeCommit current={Repository} PRlistData={PRlistData} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <span>
                  <FileAddOutlined />
                  文件变动
                </span>
                <span className="messagehint">{titleKeyData?.NumInfo?.NumFiles}</span>
              </>
            }
            key="3">
            <CodeFiles current={Repository} PRlistData={PRlistData} />
          </Tabs.TabPane>
        </Tabs>
        {loadTimeline()}
      </div>
    </>
    // <>123</>
  );
};

export default CodePR;
