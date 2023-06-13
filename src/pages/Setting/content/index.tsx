import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import AgencyInfo from '../components/AgencyInfo';
import EntityInfo from '../components/EntityInfo';
import WorkForm from './Standard/WorkForm';
import Attribute from './Standard/Attribute';
import { MenuItemType } from 'typings/globelType';
import React from 'react';
import DictSetting from './Dict';
import AuthoritySetting from './Authority';
import { MenuType } from '../config/menuType';
import { TargetType, companyTypes, departmentTypes } from '@/ts/core';
import Design from '@/bizcomponents/FlowDesign';

interface IProps {
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu }: IProps) => {
  const loadConent = () => {
    /** 加载内容区 */
    switch (selectMenu.itemType) {
      case TargetType.Person:
        return <PersonSetting />;
      case TargetType.Group:
      case TargetType.Cohort:
        return <AgencySetting current={selectMenu.item} />;
      case TargetType.Station:
        return <StationSetting current={selectMenu.item} />;
      case MenuType.Species:
        return <StandardSetting current={selectMenu.item} />;
      case MenuType.Dict:
        return <DictSetting current={selectMenu.item} />;
      case MenuType.Authority:
        return <AuthoritySetting current={selectMenu.item} />;
      case MenuType.Form:
        return <WorkForm current={selectMenu.item} />;
      case MenuType.Work:
        return <Design current={selectMenu.item} />;
      case MenuType.Property:
        return (
          <Attribute
            current={selectMenu.item.species}
            property={selectMenu.item.property}
          />
        );
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
  const loadInfo = () => {
    /** 加载信息区 */
    const entity = selectMenu.item;
    if (entity) {
      if ('memberTypes' in entity) {
        return <AgencyInfo entity={entity} />;
      } else if ('share' in entity) {
        return <EntityInfo entity={entity} />;
      }
    }
    return <></>;
  };
  return (
    <>
      {loadInfo()}
      {loadConent()}
    </>
  );
};

export default ContentIndex;
