import React, { useState, useEffect } from 'react';
import './index.less';
import { Button } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { getTimeAgo } from '../../hook/index';
import { InsuranceOutlined } from '@ant-design/icons';
interface IProps {
  current: IRepository;
  branchesdata: any;
  setbranchesdata: Function;
}

const BranchPage: React.FC<IProps> = ({ current, branchesdata, setbranchesdata }) => {
  const [branchetype, setbranchetype] = useState<any>(0);
  if (!branchesdata) {
    return <></>;
  }
  return (
    <>
      <div className="flex_align_center btn_list">
        <span
          onClick={async () => {
            const res = await current.Codebranches();
            setbranchetype(0);
            setbranchesdata(res.data);
          }}
          className={branchetype == 0 ? 'active' : ''}>
          概况
        </span>
        <span
          onClick={async () => {
            const res = await current.Codebranches('/all');
            console.log(res);

            setbranchetype(1);
            setbranchesdata(res.data);
          }}
          className={branchetype == 1 ? 'active' : ''}>
          所有分支
        </span>
      </div>
      {(() => {
        switch (branchetype) {
          case 0:
            return (
              <>
                <div className="md_contianer">
                  <h3
                    style={{
                      padding: '.6rem .8rem',
                      background: '#f0f0f0',
                      borderBottom: '1px solid #ddd',
                    }}>
                    默认分支
                  </h3>
                  <div className="branch_box">
                    <div className="flex_public">
                      {branchesdata.DefaultBranch.IsProtected ? (
                        <InsuranceOutlined
                          style={{ fontSize: '20px', marginRight: '5px' }}
                        />
                      ) : (
                        <></>
                      )}
                      <span className="master_tag">
                        {branchesdata.DefaultBranch.Name}
                      </span>
                      <span className="commit_text">{`由${
                        branchesdata.DefaultBranch.Commit.Committer.Name
                      }更新于 ${getTimeAgo(
                        branchesdata.DefaultBranch.Commit.Committer.When,
                      )}`}</span>
                    </div>
                    <Button>更改默认分支</Button>
                  </div>
                </div>
                {branchesdata.ActiveBranches?.length ? (
                  <div className="md_contianer">
                    <h3
                      style={{
                        padding: '.6rem .8rem',
                        background: '#f0f0f0',
                        borderBottom: '1px solid #ddd',
                      }}>
                      活跃分支
                    </h3>
                    {(() => {
                      return branchesdata.ActiveBranches?.map(
                        (active: any, i: number) => {
                          return (
                            <div className="branch_box" key={i}>
                              <div className="flex_public">
                                {active.IsProtected ? (
                                  <InsuranceOutlined
                                    style={{ fontSize: '20px', marginRight: '5px' }}
                                  />
                                ) : (
                                  <></>
                                )}
                                <span className="master_tag">{active.Name}</span>
                                <span className="commit_text">{`由${
                                  active.Commit.Committer.Name
                                }更新于 ${getTimeAgo(
                                  active.Commit.Committer.When,
                                )}`}</span>
                              </div>
                              <Button icon={<ApiOutlined />}>创建合并请求</Button>
                            </div>
                          );
                        },
                      );
                    })()}
                  </div>
                ) : (
                  <></>
                )}

                {branchesdata.StaleBranches?.length ? (
                  <div className="md_contianer">
                    <h3
                      style={{
                        padding: '.6rem .8rem',
                        background: '#f0f0f0',
                        borderBottom: '1px solid #ddd',
                      }}>
                      陈旧分支
                    </h3>
                    {(() => {
                      return branchesdata.StaleBranches?.map((stale: any, i: number) => {
                        return (
                          <div className="branch_box" key={i}>
                            <div className="flex_public">
                              {stale.IsProtected ? (
                                <InsuranceOutlined
                                  style={{ fontSize: '20px', marginRight: '5px' }}
                                />
                              ) : (
                                <></>
                              )}
                              <span className="master_tag">{stale.Name}</span>
                              <span className="commit_text">{`由${
                                stale.Commit.Committer.Name
                              }更新于 ${getTimeAgo(stale.Commit.Committer.When)}`}</span>
                            </div>
                            <Button icon={<ApiOutlined />}>创建合并请求</Button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <></>
                )}
              </>
            );
          case 1:
            return (
              <>
                <div className="md_contianer">
                  <h3
                    style={{
                      padding: '.6rem .8rem',
                      background: '#f0f0f0',
                      borderBottom: '1px solid #ddd',
                    }}>
                    所有分支
                  </h3>
                  <div className="branch_box">
                    <div className="flex_public">
                      {branchesdata.DefaultBranch.IsProtected ? (
                        <InsuranceOutlined
                          style={{ fontSize: '20px', marginRight: '5px' }}
                        />
                      ) : (
                        <></>
                      )}
                      <span className="master_tag">
                        {branchesdata.DefaultBranch.Name}
                      </span>
                      <span className="commit_text">{`由${
                        branchesdata.DefaultBranch.Commit.Committer.Name
                      }更新于 ${getTimeAgo(
                        branchesdata.DefaultBranch.Commit.Committer.When,
                      )}`}</span>
                    </div>
                    <Button>更改默认分支</Button>
                  </div>
                </div>

                {branchesdata.OtherBranches?.length ? (
                  <div className="md_contianer">
                    <h3
                      style={{
                        padding: '.6rem .8rem',
                        background: '#f0f0f0',
                        borderBottom: '1px solid #ddd',
                      }}>
                      活跃分支
                    </h3>
                    {(() => {
                      return branchesdata.OtherBranches?.map((active: any, i: number) => {
                        return (
                          <div className="branch_box" key={i}>
                            <div className="flex_public">
                              {active.IsProtected ? (
                                <InsuranceOutlined
                                  style={{ fontSize: '20px', marginRight: '5px' }}
                                />
                              ) : (
                                <></>
                              )}
                              <span className="master_tag">{active.Name}</span>
                              <span className="commit_text">{`由${
                                active.Commit.Committer.Name
                              }更新于 ${getTimeAgo(active.Commit.Committer.When)}`}</span>
                            </div>
                            <Button icon={<ApiOutlined />}>创建合并请求</Button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <></>
                )}
              </>
            );

          default:
            return <></>;
        }
      })()}
    </>
  );
};

export default BranchPage;
