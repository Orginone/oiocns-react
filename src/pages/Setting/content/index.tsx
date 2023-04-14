import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import CohortSetting from './Cohort';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import AuthoritySetting from './Authority';
import PropertySetting from './Property';
import DictSetting from './Dict';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import React from 'react';

interface IProps {
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu }: IProps) => {
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
    case GroupMenuType.Authority:
      return <AuthoritySetting current={selectMenu.item} />;
    case GroupMenuType.Property:
      return <PropertySetting />;
    case GroupMenuType.Dict:
      return <DictSetting current={selectMenu.item} />;
    case GroupMenuType.Species:
      return <StandardSetting current={selectMenu.item} />;
    default:
      return <></>;
  }
};

export default ContentIndex;
