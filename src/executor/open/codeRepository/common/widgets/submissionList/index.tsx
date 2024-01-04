import React, { useEffect, useState } from 'react';
import { getTimeAgo } from '../../../hook';
import { Avatar, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
interface IProps {
  onSearch?: (value: string) => void; //是否有搜索框，搜索框的方法
  onID: (_item: any) => any; //双击id方法
  historyCommitList: any; //提交历史
  title: string;
  BeforeCommitID?: string;
  AfterCommitID?: string;
}
const { Search } = Input;
const SubmissionList: React.FC<IProps> = ({
  onSearch,
  onID,
  historyCommitList,
  title,
  BeforeCommitID,
  AfterCommitID,
}) => {
  return (
    <>
      <div className="history_commit">
        <div className="flex_align_center search_header">
          <div
            className="search_header"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'flex-start',
            }}>
            <p className="commit_history_text">{title}</p>
            {BeforeCommitID ? (
              <>
                <span className=" git_verson3" onDoubleClick={onID(BeforeCommitID)}>
                  {BeforeCommitID?.substring(0, 10)}
                </span>
                <span className="mar">...</span>
                <span className=" git_verson3" onDoubleClick={onID(AfterCommitID)}>
                  {AfterCommitID?.substring(0, 10)}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          {onSearch ? (
            <Search
              style={{ width: '200px' }}
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          ) : (
            <></>
          )}
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
            <span className="upload_file_color">{getTimeAgo(_item?.Committer.When)}</span>
          </div>
        ))}
      </div>
    </>
  );
};
export { SubmissionList };
