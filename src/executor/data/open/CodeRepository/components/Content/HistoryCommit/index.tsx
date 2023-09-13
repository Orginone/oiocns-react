import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import './index.less';
import { Input } from 'antd';

const { Search } = Input;

function HistoryCommit() {
  const onSearch = (value: string) => console.log(value);
  const arrs = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <div className="history_commit">
      <div className="flex_align_center search_header">
        <p className="commit_history_text">提交历史</p>
        <Search
          style={{ width: '200px' }}
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>
      {arrs.map((_item, index) => (
        <div className="flex_align_center commit_info" key={index}>
          <div className="flex_align_center">
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <span className="file_name_color margin_lefts">UserName</span>
            <span className="margin_lefts git_verson">1aaa3a8773</span>
            <span className="margin_lefts">初始化</span>
          </div>
          <span className="upload_file_color">2月之前</span>
        </div>
      ))}
      <div className="file_list_table_tag"></div>
    </div>
  );
}

export default HistoryCommit;
