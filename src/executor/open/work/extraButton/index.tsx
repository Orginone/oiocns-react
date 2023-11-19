import React from 'react';
import ApparatusButton from './apparatusButton';
import { IWork, IWorkTask } from '@/ts/core';

interface IProps {
  title: string;
  current: IWork | IWorkTask;
}
const ExtraButton: React.FC<IProps> = ({ title, current }) => {
  console.log(current);
  switch (title) {
    case '预约上机':
      return <ApparatusButton current={current}></ApparatusButton>;
    default:
      return <></>;
  }
};

export default ExtraButton;
