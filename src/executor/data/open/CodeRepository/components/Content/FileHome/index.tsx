import React, { useRef, useState } from 'react';

import { Col, Divider, Input, Row, Select, Space, message, Avatar } from 'antd';
import './index.less';
import {
  CopyOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  FileOutlined,
  FolderOpenFilled,
  PullRequestOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

function FileHome() {
  /**
   * 复制git 地址
   */
  let copyRef = useRef<any>(null);
  const copyGitUrl = () => {
    navigator.clipboard
      .writeText(copyRef.current.outerText)
      .then(() => {
        message.success('复制成功');
      })
      .catch((_error) => {
        message.error('复制失败');
      });
  };
  /**
   * select 选项
   */
  const items = ['main', 'fenzhi'];
  const [branchStatus, setBranchStatus] = useState(0);

  /**
   * 文件列表
   */
  const fileLists = [
    {
      id: 1,
      fileType: 'folder',
      fileName: '.idea',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
    {
      id: 2,
      fileType: 'folder',
      fileName: 'controller',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
    {
      id: 3,
      fileType: 'folder',
      fileName: 'service',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
    {
      id: 4,
      fileType: 'files',
      fileName: 'mnvw',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
    {
      id: 5,
      fileType: 'files',
      fileName: 'mnvw',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
    {
      id: 6,
      fileType: 'files',
      fileName: 'pom.xml',
      nowNum: '9fe877fjx',
      commitDesc: '初始化项目',
      dateStanp: '一天前',
    },
  ];
  /**
   * md 文档模拟数据
   */
  const [mdContent, setMdContent] = React.useState('');
  React.useEffect(() => {
    fetch('/README.md')
      .then((res) => res.text())
      .then((text) => setMdContent(text));
  }, []);

  return (
    <>
      {/*功能区 克隆等操作*/}
      <Row>
        <Col span={12} className="flex_align_center">
          <span className="contrast">
            <PullRequestOutlined />
          </span>
          <Select
            style={{ width: 200 }}
            placeholder="分支: main"
            dropdownRender={(menu: any) => (
              <>
                <Space style={{ padding: '6px 8px 0' }}>
                  <Input placeholder="过滤分支或标签..." style={{ width: '185px' }} />
                </Space>
                <div className="gap"></div>
                <Space style={{ padding: '0 8px 0' }}>
                  <div className="flex_align_center select_tabs">
                    <p
                      onClick={() => {
                        setBranchStatus(0);
                      }}
                      className={branchStatus == 0 ? 'active' : ''}>
                      分支列表
                    </p>
                    <p
                      onClick={() => {
                        setBranchStatus(1);
                      }}
                      className={branchStatus == 1 ? 'active' : ''}>
                      标签列表
                    </p>
                  </div>
                </Space>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
              </>
            )}
            options={items.map((item) => ({ label: item, value: item }))}
          />
          <span className="margin_lefts file_name_color text_warp">文件名</span>
        </Col>
        <Col
          span={12}
          style={{ justifyContent: 'flex-end' }}
          className="flex_align_center">
          <div className="flex_align_center btn_list">
            <span>新的文件</span>
            <span>上传文件</span>
          </div>
          <div className="flex_align_center file_url margin_lefts">
            <span>HTTP</span>
            <span>SSH</span>
            <span ref={copyRef}>https://gogos.jx686.com/zianxin/xxxxxxxxxx</span>
            <span onClick={copyGitUrl}>
              <CopyOutlined />
            </span>
            <span>
              <DownloadOutlined />
            </span>
          </div>
        </Col>
      </Row>
      <div className="gap"></div>
      <div className="gap"></div>
      {/*表头用户提交信息*/}
      <div className="file_list_table">
        <div
          className="file_list_header flex_align_center"
          style={{ justifyContent: 'space-between' }}>
          <div className="flex_align_center">
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <span className="file_name_color margin_lefts">UserName</span>
            <span className="margin_lefts git_verson">1aaa3a8773</span>
            <span className="margin_lefts">初始化</span>
          </div>
          <span className="upload_file_color">2月之前</span>
        </div>
        <div className="file_list_table_tag"></div>

        {/* 渲染文件列表*/}

        {fileLists.map((_item) => (
          <div
            key={_item.id}
            className="flex_align_center file_list_table_item"
            style={{ justifyContent: 'space-between' }}>
            <div className="file_cloum">
              {_item.fileType == 'folder' ? (
                <FolderOpenFilled style={{ fontSize: '16px', color: '#1e70bf' }} />
              ) : (
                <FileOutlined style={{ marginRight: '.14rem' }} />
              )}
              <span className="file_name_color margin_lefts">{_item.fileName}</span>
            </div>
            <div style={{ flex: 1 }} className="flex_align_center">
              <span className="margin_lefts git_verson">{_item.nowNum}</span>
              <p className="margin_lefts commit_desc">{_item.commitDesc}</p>
            </div>
            <span className="upload_file_color">{_item.dateStanp}</span>
          </div>
        ))}
      </div>
      {/*渲染md文档*/}
      <div className="gap"></div>
      <div className="md_contianer">
        <h3
          style={{
            padding: '.6rem .8rem',
            background: '#f0f0f0',
            borderBottom: '1px solid #ddd',
          }}>
          <FileDoneOutlined style={{ marginRight: '.4rem' }} />
          README.md
        </h3>
        <div style={{ padding: '.8rem .8rem' }}>
          <ReactMarkdown className={'markdown-body'}>{mdContent}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default FileHome;
