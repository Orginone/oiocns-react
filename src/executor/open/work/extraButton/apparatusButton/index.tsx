import React from 'react';
import { IWork, IWorkTask } from '@/ts/core';
import { Button, message } from 'antd';
import axios from 'axios';
interface IProps {
  current: IWork | IWorkTask;
}
const ApparatusButton: React.FC<IProps> = ({ current }) => {
  const beginCollect = () => {
    axios.get('/apparatus/start').then((res) => {
      message.open({
        type: 'success',
        content: res.data,
      });
    });
  };
  const endCollect = () => {
    axios.get('/apparatus/end').then((res) => {
      message.open({
        type: 'success',
        content: res.data,
      });
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button type="primary" onClick={beginCollect}>
        开始采集
      </Button>
      <Button type="primary" onClick={endCollect}>
        结束采集
      </Button>
    </div>
  );
};

export default ApparatusButton;
