import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import CohortSetting from './Cohort';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import { MenuItemType } from 'typings/globelType';
import React from 'react';
import DictSetting from './Dict';
import AuthoritySetting from './Authority';
import { MenuType } from '../config/menuType';
import { TargetType, companyTypes, departmentTypes } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu }: IProps) => {
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case TargetType.Person:
      return <PersonSetting />;
    case TargetType.Station:
      return <StationSetting current={selectMenu.item} />;
    case TargetType.Cohort:
      return <CohortSetting current={selectMenu.item} />;
    case MenuType.Species:
      return <StandardSetting current={selectMenu.item} />;
    case MenuType.Dict:
      return (
        <DictSetting current={selectMenu.item.dict} belong={selectMenu.item.belong} />
      );
    case MenuType.Authority:
      return <AuthoritySetting current={selectMenu.item} />;
    default:
      if (companyTypes.includes(selectMenu.itemType as TargetType)) {
        return <CompanySetting current={selectMenu.item} />;
      }
      if (departmentTypes.includes(selectMenu.itemType as TargetType)) {
        return <AgencySetting current={selectMenu.item} />;
      }
      return <></>;
  }
};

export default ContentIndex;
