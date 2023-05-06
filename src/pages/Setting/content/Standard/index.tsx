import { ISpeciesItem, SpeciesType } from '@/ts/core';
import React from 'react';
import Property from './Property';
import WorkForm from './WorkForm';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';
import WorkItem from './Flow';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
import Description from './Description';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  switch (current.metadata.typeName) {
    case SpeciesType.Store:
      return <Property current={current} />;
    case SpeciesType.Application:
      return <Description current={current} />;
    case SpeciesType.WorkForm:
      return <WorkForm current={current as IWorkForm} />;
    case SpeciesType.WorkItem:
      return <WorkItem current={current as IWorkItem} />;
    default:
      return <></>;
  }
};

export default SettingStandrad;
