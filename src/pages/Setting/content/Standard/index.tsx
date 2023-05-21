import { ISpeciesItem, IWorkItem, SpeciesType } from '@/ts/core';
import React from 'react';
import Property from './Property';
import WorkItem from './Flow';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  switch (current.typeName) {
    case SpeciesType.Store:
      return <Property current={current} />;
    case SpeciesType.Market:
    case SpeciesType.Work:
      return <WorkItem current={current as IWorkItem} />;
    default:
      return <></>;
  }
};

export default SettingStandrad;
