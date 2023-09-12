import React, { useState } from 'react';
import FullScreenModal from '../../../tools/fullScreen';
import { ProConfigProvider } from '@ant-design/pro-components';
import './index.less';
import { Col, Row, Tabs } from 'antd';
import FileHome from './components/Content/FileHome';
import HistoryCommit from './components/Content/HistoryCommit';
import BranchPage from './components/Content/BranchPage';
import VersionPage from './components/Content/VersionPage';
import { BranchesOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';

const CodeRepository = ({ finished, args }) => {
  const [fileStates, setFileStates] = useState(<FileHome />);

  const handleTabClick = (key: any) => {
    if (key == 1) {
      setFileStates(<FileHome />);
    }
  };

  return (
    <ProConfigProvider dark={true}>
      <FullScreenModal
        centered
        open={true}
        width={'1200px'}
        destroyOnClose
        fullScreen
        title={'form.name'}
        onCancel={() => {
          finished();
        }}>
        <div className="gap"></div>
        <h2 className="file_name">文件名/file.name</h2>
        <div className="gap"></div>
        <Tabs
          onTabClick={handleTabClick}
          defaultActiveKey="1"
          type={'card'}
          tabBarGutter={0}
          style={{ padding: '0 14%' }}>
          <Tabs.TabPane tab="文件" key="1">
            <h3>资产云3.0react前端-软件资产</h3>
            <div className="gap"></div>

            {/*提交史分支版本发布*/}
            <Row className="history_contianer">
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<HistoryCommit />)}>
                  <ClockCircleOutlined style={{ marginRight: '.4rem' }} />
                  26次提交史
                </p>
              </Col>
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<BranchPage />)}>
                  <BranchesOutlined style={{ marginRight: '.4rem' }} />
                  2个代码分支
                </p>
              </Col>
              <Col span={8}>
                <p
                  className="public_text_center"
                  onClick={() => setFileStates(<VersionPage />)}>
                  <TagOutlined style={{ marginRight: '.4rem' }} />
                  0版本发布
                </p>
              </Col>
            </Row>
            <div className="gap"></div>
            <div className="gap"></div>

            {fileStates}
          </Tabs.TabPane>
          <Tabs.TabPane tab="工单管理" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="合并请求" key="3">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Wiki" key="4">
            Content of Tab Pane 2
          </Tabs.TabPane>
        </Tabs>
      </FullScreenModal>
    </ProConfigProvider>
  );
};
export default CodeRepository;
