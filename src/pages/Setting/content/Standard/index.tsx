import { ISpeciesItem, SpeciesType } from '@/ts/core';
import React from 'react';
import SpeciesForm from '../Standard/WorkForm/Form';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  switch (current.metadata.typeName) {
    case SpeciesType.WorkForm:
      return <SpeciesForm />;
    case SpeciesType.WorkItem:
  }
  return <></>;
};

export default SettingStandrad;
