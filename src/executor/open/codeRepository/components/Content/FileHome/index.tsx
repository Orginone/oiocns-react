import React, { useEffect, useRef, useState } from 'react';

import { Col, Divider, Input, Row, Select, Space, message, Avatar } from 'antd';
import './index.less';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs';
import ReactMarkdown from 'react-markdown';

import {
  CopyOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  FileOutlined,
  FolderOpenFilled,
  PullRequestOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { IRepository } from '@/ts/core/thing/standard/repository';
interface IProps {
  current: IRepository;
}
/**
 * 时间处理函数
 */
function getTimeAgo(timestamp: any) {
  const currentDate = new Date();
  const pastDate = new Date(timestamp);

  const millisecondsDiff = currentDate.getTime() - pastDate.getTime();
  const secondsDiff = Math.floor(millisecondsDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);
  const monthsDiff = Math.floor(daysDiff / 30);
  const yearsDiff = Math.floor(monthsDiff / 12);

  if (yearsDiff > 0) {
    return yearsDiff === 1 ? '1年前' : `${yearsDiff}年前`;
  } else if (monthsDiff > 0) {
    return monthsDiff === 1 ? '1个月前' : `${monthsDiff}个月前`;
  } else if (daysDiff > 0) {
    return daysDiff === 1 ? '1天前' : `${daysDiff}天前`;
  } else if (hoursDiff > 0) {
    return hoursDiff === 1 ? '1小时前' : `${hoursDiff}小时前`;
  } else if (minutesDiff > 0) {
    return minutesDiff === 1 ? '1分钟前' : `${minutesDiff}分钟前`;
  } else {
    return '刚刚';
  }
}

const FileHome: React.FC<IProps> = ({ current }) => {
  //分支列表选项
  const [trees, setTrees] = useState([]);
  //当前分支
  const [clickTrees, setClickTrees] = useState('master');
  //select 选项
  const [branchStatus, setBranchStatus] = useState(0);
  //复制git 地址
  const copyRef = useRef<any>(null);
  //仓库内容
  const [repoContent, setRepoContent]: any = useState({});
  //获取目录/文件内容
  const [fileHistory, setFileHistory] = useState<Array<any>>([]);
  //当前文件标题
  // const [fileTitle, setFileTitle] = useState('');
  //当前文件类型
  const [filetype, setFiletype] = useState('tree');
  //文档内容
  const [mdContent, setMdContent] = React.useState('');
  const mdFile = async (filePath: RequestInfo | URL) => {
    fetch(filePath)
      .then((res) => res.text())
      .then((text) => setMdContent(text));
  };
  //代码编辑器颜色
  const [extensions] = useState(langs.markdown);
  useEffect(() => {
    getFiles();
  }, []);
  // //刷新数据方法
  // interface Irefscontent {
  //   datauri?: string;
  //   ClickTree?: string;
  // }
  // const refscontent = async (data: Irefscontent) => {
  //   const results = await current.RepoContent(data?.datauri || '');
  //   data?.ClickTree && setClickTrees(data?.ClickTree); //当前分支
  //   setRepoContent(results.data);
  // };
  const getFiles = async (datauri: string = '') => {
    const results = await current.RepoContent(datauri);
    if (results.code === 200) {
      const moveElementToFirst = (elementToMove: string = 'master') => {
        const index = results.data.Branchs.indexOf(elementToMove);
        if (index !== -1) {
          const newArray: any = [...results.data.Branchs];
          newArray.splice(index, 1);
          newArray.unshift(elementToMove);
          setTrees(newArray);
        }
      };
      moveElementToFirst();
      setClickTrees('master');
      setRepoContent(results.data);
    } else {
      message.warning(results.message);
    }
  };
  const fileDesc = async (item: any) => {
    let fileNames = item.Entry.Name; //当前文件名称
    let filepath = [...fileHistory, fileNames]; //当前文件路径数组
    let url = '';
    for (let i = 0; i < filepath.length; i++) {
      url += `/${filepath[i]}`;
    }
    const results = await current.RepoContent(`/src/${clickTrees}` + url);
    if (results.code === 200) {
      setRepoContent(results.data);
    } else {
      message.warning(results.message);
    }
    if (item.Entry.Typ === 'tree') {
      setFiletype('tree');
    }
    if (item.Entry.Typ === 'blob') {
      const url = results.data?.Url;
      if (url) {
        const fileTyp = url.substring(url.lastIndexOf('.'));
        setFiletype(fileTyp);
        if (fileTyp != '.rar') {
          mdFile(results.data.Url.replace('http://gittest.jx868.com', '/warehouse'));
        }
      }
    }
    setFileHistory(filepath);
  };

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
            placeholder={'分支:' + trees[0]}
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
                {(() => {
                  switch (branchStatus) {
                    case 0:
                      return menu;
                    default:
                      return <></>;
                  }
                })()}
                <Divider style={{ margin: '8px 0' }} />
              </>
            )}
            onChange={async (value) => {
              const results = await current.RepoContent(`/src/${value}`);
              setRepoContent(results.data);
              setClickTrees(value);
              setFiletype('tree');
              setFileHistory([]);
            }}
            options={trees.map((item) => ({ label: item, value: item }))}
          />
          <span className="margin_lefts file_name_color text_warp">
            <span
              style={fileHistory.length <= 0 ? { color: 'black', fontWeight: '600' } : {}}
              onClick={async () => {
                const results = await current.RepoContent(`/src/${clickTrees}`);
                setRepoContent(results.data);
                setFiletype('tree');
                setFileHistory([]);
              }}>
              {current.name + ` /`}
            </span>
            {fileHistory.map((items, index) => {
              return (
                <span
                  key={index}
                  style={
                    index == fileHistory.length - 1
                      ? { color: 'black', fontWeight: '600' }
                      : {}
                  }
                  onClick={async () => {
                    const results = await current.RepoContent(
                      `/src/${clickTrees}/${fileHistory?.slice(0, index + 1).join('/')}`,
                    );
                    setRepoContent(results.data);
                    setFiletype('tree');
                    setFileHistory(fileHistory?.slice(0, index + 1));
                  }}>
                  {items + ` /`}
                </span>
              );
            })}
          </span>
        </Col>
        <Col
          span={12}
          style={{ justifyContent: 'flex-end' }}
          className="flex_align_center">
          {/* <div className="flex_align_center btn_list">
            <span>新的文件</span>
            <span>上传文件</span>
          </div> */}
          <div className="flex_align_center file_url margin_lefts">
            <span
              onClick={() => {
                copyRef.current.innerText = current.HTTPS;
              }}>
              HTTP
            </span>
            <span
              onClick={() => {
                copyRef.current.innerText = current.SSH;
              }}>
              SSH
            </span>
            <span ref={copyRef} className="address">
              {current.HTTPS}
            </span>
            <span
              onClick={() => {
                navigator.clipboard
                  .writeText(copyRef.current.outerText)
                  .then(() => {
                    message.success('复制成功');
                  })
                  .catch((_error) => {
                    message.error('复制失败');
                  });
              }}>
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
      {(() => {
        switch (filetype) {
          case 'tree':
            return (
              <div className="file_list_table">
                <div
                  className="file_list_header flex_align_center"
                  style={{ justifyContent: 'space-between' }}>
                  <div className="flex_align_center">
                    <Avatar
                      style={{ backgroundColor: '#87d068' }}
                      icon={<UserOutlined />}
                    />
                    <span className="file_name_color margin_lefts">
                      {repoContent?.LatestCommit?.Committer
                        ? repoContent?.LatestCommit?.Committer.Name
                        : 'username'}
                    </span>
                    <span className="margin_lefts git_verson">
                      {repoContent?.LatestCommit?.ID?.substring(0, 10)}
                    </span>
                    <span className="margin_lefts">
                      {repoContent?.LatestCommit?.Message}
                    </span>
                  </div>
                  <span className="upload_file_color">
                    {getTimeAgo(
                      repoContent?.LatestCommit?.Committer
                        ? repoContent?.LatestCommit?.Committer.When
                        : '',
                    )}
                  </span>
                </div>
                <div className="file_list_table_tag"></div>
                <div className="tag"></div>
                {repoContent?.EntryCommitInfo?.map((_item: any) => (
                  <div
                    onDoubleClick={async () => {
                      fileDesc(_item);
                    }}
                    key={_item.Index}
                    className="flex_align_center file_list_table_item"
                    style={{ justifyContent: 'space-between' }}>
                    <div className="file_cloum">
                      {_item.Entry.Typ == 'tree' ? (
                        <FolderOpenFilled
                          style={{ fontSize: '16px', color: '#1e70bf' }}
                        />
                      ) : (
                        <FileOutlined style={{ marginRight: '.14rem' }} />
                      )}
                      <span className="file_name_color margin_lefts">
                        {_item.Entry.Name}
                      </span>
                    </div>
                    <div style={{ flex: 1 }} className="flex_align_center">
                      <span
                        className="margin_lefts git_verson"
                        onClick={() => {
                          console.log(123);
                        }}>
                        {_item.Commit.ID?.substring(0, 10)}
                      </span>
                      <span className="margin_lefts commit_desc">
                        {_item.Commit.Message}
                      </span>
                    </div>
                    <span className="upload_file_color">
                      {getTimeAgo(_item.Commit.Committer.When)}
                    </span>
                  </div>
                ))}
              </div>
            );
          case '.png':
            return (
              <div
                className="md_contianer"
                style={{ padding: '.4rem .4rem', marginTop: '.4rem' }}>
                <img
                  src={repoContent?.Url?.replace(
                    'http://gittest.jx868.com',
                    '/warehouse',
                  )}
                />
              </div>
            );
          case '.md':
            return (
              <>
                <div className="md_contianer">
                  <h3
                    style={{
                      padding: '.6rem .8rem',
                      background: '#f0f0f0',
                      borderBottom: '1px solid #ddd',
                    }}>
                    <FileDoneOutlined style={{ marginRight: '.4rem' }} />
                    {repoContent?.FileName}
                  </h3>
                  <div style={{ padding: '.8rem .8rem' }}>
                    <ReactMarkdown className="markdown-body">{mdContent}</ReactMarkdown>
                  </div>
                </div>
              </>
            );
          case '.rar':
            return (
              <>
                <div>压缩文件过大无法查看</div>
              </>
            );
          default:
            return (
              <div className="md_contianer" style={{ marginTop: '.4rem' }}>
                <h3
                  style={{
                    padding: '.6rem .8rem',
                    background: '#f0f0f0',
                    borderBottom: '1px solid #ddd',
                  }}>
                  <FileDoneOutlined style={{ marginRight: '.4rem' }} />
                  {repoContent?.FileName}
                </h3>
                <div style={{ marginTop: '-.5rem' }}>
                  <CodeMirror
                    width={'100%'}
                    theme={vscodeDark}
                    value={mdContent}
                    extensions={[extensions]}
                  />
                </div>
              </div>
            );
        }
      })()}
    </>
  );
};

export default FileHome;
