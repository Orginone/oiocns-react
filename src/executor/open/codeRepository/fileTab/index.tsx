import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { BranchesOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';
import { IRepository } from '@/ts/core/thing/standard/repository';
import HistoryCommit from './HistoryCommit';
import BranchPage from './BranchPage';
import VersionPage from './VersionPage';
import FileHome from './FileHome';
import CodeComparison from './HistoryCommit/CodeComparison';

interface IProps {
  current: IRepository;
  States: number;
  setStates: Function;
  historyCommitList: any; //提交历史
  setHistoryCommitList: Function; //变更提交历史
  clickTrees: string; //当前分支
  setClickTrees: Function; //变更当前分支
}

const FileTab: React.FC<IProps> = ({
  current,
  States,
  setStates,
  historyCommitList,
  setHistoryCommitList,
  clickTrees,
  setClickTrees,
}) => {
  const [node, setnode] = useState(null);
  //初始化概况分支列表
  const [branchesdata, setbranchesdata] = useState<any>(null);
  //初始化所有分支列表
  const [allbranchesdata, setallbranchesdata] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const res = await current.Codebranches();
      const res1 = await current.Codebranches('/all');
      setallbranchesdata(res1.data);
      setbranchesdata(res.data);
    })();
  }, []);
  return (
    <div className="FileTab">
      <h3>{current.remark}</h3>

      {/*提交史,分支,版本发布*/}
      <Row className="history_contianer">
        <Col span={8}>
          <p
            className="public_text_center"
            onClick={() => {
              setStates(1);
            }}>
            <ClockCircleOutlined className="topicon" />
            {`${historyCommitList?.length ? historyCommitList?.length : 0} 次提交史`}
          </p>
        </Col>
        <Col span={8}>
          <p
            className="public_text_center"
            onClick={() => {
              setStates(2);
            }}>
            <BranchesOutlined className="topicon" />
            {allbranchesdata?.OtherBranches?.length + 1 || 0}个代码分支
          </p>
        </Col>
        <Col span={8}>
          <p className="public_text_center" onClick={() => setStates(3)}>
            <TagOutlined className="topicon" />
            0版本发布
          </p>
        </Col>
      </Row>
      {(() => {
        switch (States) {
          case 0:
            return (
              <FileHome
                current={current}
                clickTrees={clickTrees}
                setClickTrees={(value: string = 'master') => {
                  setClickTrees(value);
                }}
              />
            );
          case 1:
            return (
              <HistoryCommit
                current={current}
                setpage={(value: number) => {
                  setStates(value);
                }}
                clickTrees={clickTrees}
                setClickTrees={setClickTrees}
                historyCommitList={historyCommitList}
                setHistoryCommitList={setHistoryCommitList}
                setnode={setnode}
              />
            );
          case 2:
            return (
              <BranchPage
                current={current}
                branchesdata={branchesdata}
                setbranchesdata={setbranchesdata}
              />
            );
          case 3:
            return <VersionPage />;
          case 4:
            return <CodeComparison current={current} node={node} />;
          default:
            return <></>;
        }
      })()}
    </div>
  );
};
export default FileTab;
