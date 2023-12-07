import { UserOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, message, Avatar } from 'antd';
import React, { useState, useEffect } from 'react';
import './index.less';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { getTimeAgo } from '../../hook/index';
import CodeComparison from './CodeComparison';

interface IProps {
  current: IRepository;
  setpage: (value: number) => void;
  historyCommitList: any; //提交历史
  setHistoryCommitList: Function; //变更提交历史
  clickTrees: string; //当前分支
  setClickTrees: Function; //变更当前分支
  setnode: Function;
}
const { Search } = Input;

const HistoryCommit: React.FC<IProps> = ({
  current,
  setpage,
  clickTrees,
  setClickTrees,
  historyCommitList,
  setHistoryCommitList,
  setnode,
}) => {
  //分支列表选项
  const [trees, setTrees] = useState([]);

  //当前分支
  // const [clickTrees, setClickTrees] = useState('master');
  //select 选项
  const [branchStatus, setBranchStatus] = useState(0);
  // const [historyCommitList, setHistoryCommitList] = useState([]);
  useEffect(() => {
    getFiles();
  }, []);
  const getFiles = async (datauri: string = '') => {
    console.log(clickTrees);
    const results = await current.RepoContent(`/src/${clickTrees}`);
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
      const commitList = await current.HistoryCommitList(`/${clickTrees}`);
      setHistoryCommitList(commitList.data);
    } else {
      message.warning(results.message);
    }
  };
  const onID = (_item: any) => {
    return () => {
      console.log(_item);
      setnode(_item);
      setpage(4);
    };
  };
  return (
    <>
      <div>
        <div className="history_top">
          <Select
            style={{ width: 200 }}
            defaultValue={clickTrees}
            placeholder={'分支:' + clickTrees}
            dropdownRender={(menu: any) => (
              <>
                <Space style={{ padding: '6px 8px 0', marginBottom: '1vh' }}>
                  <Input placeholder="过滤分支或标签..." style={{ width: '185px' }} />
                </Space>
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
              const commitList = await current.HistoryCommitList(`/${value}`);
              setHistoryCommitList(commitList.data);
              setClickTrees(value);
            }}
            options={trees.map((item) => ({ label: item, value: item }))}
          />
        </div>
        <div className="history_commit">
          <div className="flex_align_center search_header">
            <p className="commit_history_text">提交历史</p>
            <Search
              style={{ width: '200px' }}
              placeholder="input search text"
              onSearch={async (value: string) => {
                const commitList = await current.HistoryCommitList(
                  `/${clickTrees}${value ? '/search?q=' + value : ''}`,
                );
                console.log(commitList);
                setHistoryCommitList(commitList.data);
              }}
              enterButton
            />
          </div>
          {historyCommitList?.map((_item: any, index) => (
            <div className="flex_align_center commit_info" key={index}>
              <div className="flex_align_center">
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <span className="file_name_color margin_lefts">
                  {_item?.Committer.Name}
                </span>
                <span className="margin_lefts git_verson" onDoubleClick={onID(_item)}>
                  {_item.ID?.substring(0, 10)}
                </span>
                <span className="margin_lefts">{_item.Message}</span>
              </div>
              <span className="upload_file_color">
                {getTimeAgo(_item?.Committer.When)}
              </span>
            </div>
          ))}
          <div className="file_list_table_tag"></div>
        </div>
      </div>
    </>
  );
};

export default HistoryCommit;
