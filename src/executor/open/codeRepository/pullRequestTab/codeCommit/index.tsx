import { SettingFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { SubmissionList } from '../../common/index';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { model } from '@/ts/base';
import CodeComparison from '../../fileTab/HistoryCommit/CodeComparison';

interface IProps {
  current: IRepository;
  PRlistData: model.pullRequestList;
}
const CodeCommit: React.FC<IProps> = ({ current, PRlistData }) => {
  const [PRCommits, setPRCommits] = useState();
  const [node, setnode] = useState();
  useEffect(() => {
    (async () => {
      const res = await current.PRCommits({
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
      setPRCommits(res.data);
    })();
  }, []);
  if (!PRCommits) {
    return <></>;
  }
  return (
    <>
      <SubmissionList
        onID={(_item: any) => {
          return () => {
            console.log(_item);
            setnode(_item);
          };
        }}
        historyCommitList={PRCommits.Commits}
        title={`${PRCommits.Commits.length}次代码提交`}
      />
      {node && <CodeComparison current={current} node={node} />}
    </>
  );
};
export { CodeCommit };
