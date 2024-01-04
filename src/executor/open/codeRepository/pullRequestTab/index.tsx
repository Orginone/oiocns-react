import React, { useEffect, useState } from 'react';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { Button, Tabs, Tag, Select, message } from 'antd';
import {
  InfoCircleOutlined,
  PartitionOutlined,
  MessageOutlined,
  SubnodeOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import './index.less';
import CodeComparison from '../fileTab/HistoryCommit/CodeComparison';
import { getTimeAgo } from '../hook/index';
import orgCtrl from '@/ts/controller';
import { model } from '@/ts/base';
import { SubmissionList, ContentFrame } from '../common/index';
import { CodeCommit } from './codeCommit';
import { CodeFiles } from './codeFiles';
interface IProps {
  current: IRepository;
  States: number;
  setStates: Function;
  setActiveTabKey: Function;
  setWordOrder: Function;
}

const PullRequestTab: React.FC<IProps> = ({
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
  //开启pr列表关闭状态
  const [PRlistType, setPRlistType] = useState(0);
  //选择的单条pr列表数据
  const [PRlistData, setPRlistData] = useState<model.pullRequestList>();
  //选择的单条pr列表id
  const [PRId, setPRId] = useState<number>();
  // 代码提交文件变动的数量
  const [titleKeyData, setTitleKeyData] = useState();
  useEffect(() => {
    (async () => {
      const data = await current.PullRequestcomparison(`/${Select1 + '...' + Select2}`);
      console.log(data);
      console.log(current);
      setPRdata(data);
      setIsCompare(data.data.IsCompare);
      setHistoryCommitList(data.data.Commit);
      setTrees(data.data.BaseBranches);
    })();
  }, [Select1, Select2]);
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
                  {current.isPullList(PRlistType)?.map((pull, i) => {
                    return (
                      <div key={pull.IssueId}>
                        <div
                          className="flex"
                          style={{ flexDirection: 'column', cursor: 'pointer' }}
                          onClick={async () => {
                            const res = await current.PRCommits({
                              IssueId: pull.IssueId,
                              UserName: pull.PosterUser.name,
                              HeadRepo: pull.HeadRepo,
                              BaseRepo: pull.BaseRepo,
                              Status: pull.Status,
                              HeadBranch: pull.HeadBranch,
                              BaseBranch: pull.BaseBranch,
                              HasMerged: pull.HasMerged,
                              MergeCommitId: pull.MergeCommitId,
                              MergeBase: pull.MergeBase,
                            });
                            console.log(res);
                            
                            setTitleKeyData(res.data);
                            setStates(2);
                            setPRlistData(pull);
                            setPRId(pull.IssueId);

                            // console.log(current.findPRByIssueId(pull.IssueId));
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
                      <ContentFrame
                        onCreate={async (title, content) => {
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
                                Content: content || '这个人很懒，什么都没有留下',
                                CreateUnix: Date.now(),
                                UpdateUnix: Date.now(),
                                PosterUser: orgCtrl.user.metadata,
                              },
                            ],
                          };
                          current.pullRequestList.push(pulldata);
                          await current.update(current.metadata);
                          const apply = await current.works[0].createCodeApply();
                          if (!apply) {
                            throw new Error('创建办事申请失败！');
                          }
                          console.log(apply);
                          await apply.createCodeApply(apply.belong.id, {
                            pulldata: pulldata,
                          });
                          setStates(0);
                        }}
                        current={current}
                      />
                      <SubmissionList
                        onID={(_item: any) => {
                          return () => {
                            console.log(_item);
                          };
                        }}
                        historyCommitList={historyCommitList}
                        title={`${historyCommitList?.length}次代码提交`}
                        BeforeCommitID={PRdata?.data.BeforeCommitID}
                        AfterCommitID={PRdata?.data.AfterCommitID}
                      />
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
                    {PRlistData.HasMerged ? (
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
                    ) : PRlistData.IsClosed ? (
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
                        <ContentFrame
                          onCreate={async (_title, content) => {
                            current.pullRequestList[PRlistData.IssueId].comment.push({
                              Id: Date.now(),
                              RepoName: current.RepoName,
                              IssueId: PRlistData.IssueId,
                              Content: content,
                              CreateUnix: Date.now(),
                              UpdateUnix: Date.now(),
                              PosterUser: orgCtrl.user.metadata,
                            });
                            await current.update(current.metadata);
                            setPRlistData(current.pullRequestList[PRlistData.IssueId]);
                          }}
                          current={current}
                          PRlistData={PRlistData}
                          titleShow={false}
                          onOpenPR={async () => {
                            const isexist = current.pullRequestList.find((value) => {
                              return (
                                value.IsClosed == false &&
                                value.BaseBranch == PRlistData.BaseBranch &&
                                value.HeadBranch == PRlistData.HeadBranch
                              );
                            });
                            if (isexist) {
                              message.warning(
                                `由于已经存在来自相同仓库和合并信息的未合并请求（#${isexist.IssueId}），您无法执行重新开启操作。`,
                              );
                              return;
                            }
                            current.pullRequestList[PRlistData.IssueId].IsClosed = false;
                            await current.update(current.metadata);
                            setStates(0);
                            setPRlistType(0);
                          }}
                          onClosePR={async () => {
                            current.pullRequestList[PRlistData.IssueId].IsClosed = true;
                            console.log(current);
                            await current.update(current.metadata);
                            setStates(0);
                            setPRlistType(1);
                          }}
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
                          <span className="messagehint">
                            {titleKeyData?.NumInfo?.NumCommits}
                          </span>
                        </>
                      }
                      key="2">
                      <CodeCommit current={current} PRlistData={PRlistData} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                      tab={
                        <>
                          <span>
                            <FileAddOutlined />
                            文件变动
                          </span>
                          <span className="messagehint">
                            {titleKeyData?.NumInfo?.NumFiles}
                          </span>
                        </>
                      }
                      key="3">
                      <CodeFiles current={current} PRlistData={PRlistData} />
                    </Tabs.TabPane>
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
export default PullRequestTab;
