import React from 'react';
import './index.less';
import { Button } from 'antd';
import { ApiOutlined } from '@ant-design/icons';

function BranchPage() {
  return (
    <>
      <div className="md_contianer">
        <h3
          style={{
            padding: '.6rem .8rem',
            background: '#f0f0f0',
            borderBottom: '1px solid #ddd',
          }}>
          默认分支
        </h3>
        <div className="branch_box">
          <div className='flex_public'>
            <span className="master_tag">master</span>
            <span className='commit_text'>初始化系统</span>
          </div>
          <Button>更改默认分支</Button>
        </div>
      </div>

        <div className="gap"></div>
    
      <div className="md_contianer">
        <h3
          style={{
            padding: '.6rem .8rem',
            background: '#f0f0f0',
            borderBottom: '1px solid #ddd',
          }}>
          活跃分支
        </h3>
        <div className="branch_box">
          <div className='flex_public'>
            <span className="master_tag">master_branch</span>
            <span className='commit_text'>初始化系统</span>
          </div>
          <Button icon={<ApiOutlined />} >创建合并请求</Button>
        </div>
        <div className="branch_box">
          <div className='flex_public'>
            <span className="master_tag">master_branch</span>
            <span className='commit_text'>初始化系统</span>
          </div>
          <Button icon={<ApiOutlined />} >创建合并请求</Button>
        </div>
      </div>
    </>
  );
}

export default BranchPage;
