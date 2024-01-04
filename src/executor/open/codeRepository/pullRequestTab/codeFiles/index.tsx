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
const CodeFiles: React.FC<IProps> = ({ current, PRlistData }) => {
  const [PRCommits, setPRCommits] = useState();
  useEffect(() => {
    (async () => {
      const res = await current.PRFiles({
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
      setPRCommits(res);
    })();
  }, []);
  if (!PRCommits) {
    return <></>;
  }
  return (
    <>
      <CodeComparison current={current} node={123} title={true} PRdata={PRCommits} />
    </>
  );
};
export { CodeFiles };
