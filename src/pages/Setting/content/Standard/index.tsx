import { ISpeciesItem, IFlowClass, SpeciesType } from '@/ts/core';
import React from 'react';
import Property from './Property';
import FlowItem from './Flow';

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
    case SpeciesType.Flow:
      return <FlowItem current={current as IFlowClass} />;
    default:
      return <></>;
  }
};

export default SettingStandrad;
