import React from 'react';
import ApparatusButton from './apparatusButton';
import { IWork, IWorkTask } from '@/ts/core';
import StuCostButton from './stuCostButton';

interface IProps {
  title: string;
  current: IWork | IWorkTask;
}
const ExtraButton: React.FC<IProps> = ({ title, current }) => {
  console.log(current);
  switch (title) {
    case '预约上机':
      return <ApparatusButton current={current}></ApparatusButton>;
    case '生均成本核算':
      return <StuCostButton current={current}></StuCostButton>;
    default:
      return <></>;
  }
};

export default ExtraButton;
