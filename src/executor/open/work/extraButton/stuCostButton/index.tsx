import React from 'react';
import { IWork, IWorkTask } from '@/ts/core';
import { Button } from 'antd';
interface IProps {
  current: IWork | IWorkTask;
}
const StuCostButton: React.FC<IProps> = ({ current }) => {
  const handleClick = () => {
    console.log(current);
  };

  return (
    <>
      <Button type="primary" onClick={handleClick}>
        计算
      </Button>
    </>
  );
};

export default StuCostButton;
