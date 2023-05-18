import { ISpeciesItem, IWorkItem, SpeciesType } from '@/ts/core';
import React from 'react';
import Property from './Property';
import WorkItem from './Flow';
import Description from './Description';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  const Content = () => {
    switch (current.typeName) {
      case SpeciesType.Store:
        return <Property current={current} />;
      case SpeciesType.Market:
      case SpeciesType.WorkItem:
        return <WorkItem current={current as IWorkItem} />;
      default:
        return <></>;
    }
  };
  return (
    <>
      <Description current={current} />
      {Content()}
    </>
  );
};

export default SettingStandrad;
