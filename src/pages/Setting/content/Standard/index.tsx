import { ISpeciesItem, SpeciesType } from '@/ts/core';
import React from 'react';
import Property from './Property';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  switch (current.metadata.typeName) {
    case SpeciesType.PropClass:
      return <Property current={current} />;
    default:
      return <></>;
  }
};

export default SettingStandrad;
