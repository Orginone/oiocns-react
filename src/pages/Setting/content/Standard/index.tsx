import { ISpeciesItem, SpeciesType } from '@/ts/core';
import React from 'react';
import WorkForm from './WorkForm';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

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
      return <WorkForm current={current as IWorkForm} />;
    case SpeciesType.WorkItem:
  }
  return <></>;
};

export default SettingStandrad;
