import React, { useEffect, useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { ProConfigProvider } from '@ant-design/pro-components';
import './index.less';
import FileTab from './fileTab';
import WordOrderTab from './wordOrderTab';
import RepositorySettings from './repositorySettings';
import PullRequestTab from './pullRequestTab';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { Tabs } from 'antd';
interface IProps {
  current: IRepository;
  finished: () => void;
}

const CodeRepository: React.FC<IProps> = ({ current, finished }) => {
  //tabs的选中标签
  const [activeTabKey, setActiveTabKey] = useState('1'); // 初始选中的标签
  //当前分支
  const [clickTrees, setClickTrees] = useState('master');
  //FileTab 提交史,分支,版本发布的点击
  const [States, setStates] = useState(0);
  //WordOrderTab 标签，里程碑，工单的点击
  const [WordOrder, setWordOrder] = useState(0);
  //PullRequestTab 创建合并请求的点击
  const [pullRequest, setPullRequest] = useState(0);
  //提交史数据
  const [historyCommitList, setHistoryCommitList] = useState<any>(null);
  const [Node, setNode] = useState<any>();
  useEffect(() => {
    (async () => {
      const commitList = await current.HistoryCommitList(`/${clickTrees}`);
      //查询办事节点
      const workNode = await current.works[0].loadNode();
      setNode(workNode);
      setHistoryCommitList(commitList.data);
    })();
  }, [clickTrees]);
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
        {Node && Node.code ? (
          <div className="content">
            <h2 className="file_name">
              {current.directory.target.code}/{current.name}
            </h2>
            <Tabs
              // renderTabBar={()=>{
              //   return <></>
              // }}
              onTabClick={(key: any) => {
                setActiveTabKey(key);
                if (key == 1) {
                  setStates(0);
                }
                if (key == 2) {
                  setWordOrder(2);
                }
                if (key == 3) {
                  setPullRequest(0);
                }
              }}
              defaultActiveKey="1"
              activeKey={activeTabKey}
              type={'card'}
              tabBarGutter={0}
              className="file_name">
              <Tabs.TabPane tab="文件" key="1">
                <FileTab
                  current={current}
                  States={States}
                  setStates={setStates}
                  historyCommitList={historyCommitList}
                  setHistoryCommitList={setHistoryCommitList}
                  clickTrees={clickTrees}
                  setClickTrees={(value: string = 'master') => {
                    setClickTrees(value);
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="工单管理" key="2">
                <WordOrderTab
                  current={current}
                  States={WordOrder}
                  setStates={setWordOrder}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="合并请求" key="3">
                <PullRequestTab
                  current={current}
                  States={pullRequest}
                  setStates={setPullRequest}
                  setActiveTabKey={setActiveTabKey}
                  setWordOrder={setWordOrder}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="仓库设置" key="4">
                <RepositorySettings current={current} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        ) : (
          <>
            <div>请先设置管理者</div>
          </>
        )}
      </FullScreenModal>
    </ProConfigProvider>
  );
};
export default CodeRepository;
