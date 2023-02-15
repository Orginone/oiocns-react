import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import CohortSetting from './Cohort';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import React from 'react';
import { ISpeciesItem, ITarget } from '@/ts/core';

interface IProps {
  species: ISpeciesItem | undefined;
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu, species }: IProps) => {
  if (species) {
    return <StandardSetting current={species} target={selectMenu.item as ITarget} />;
  }
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case GroupMenuType.User:
      return <PersonSetting />;
    case GroupMenuType.Company:
      return <CompanySetting current={selectMenu.item} />;
    case GroupMenuType.Agency:
      return <AgencySetting current={selectMenu.item} />;
    case GroupMenuType.Station:
      return <StationSetting current={selectMenu.item} />;
    case GroupMenuType.Cohort:
      return <CohortSetting current={selectMenu.item} />;
    default:
      return <></>;
  }
};

export default ContentIndex;
