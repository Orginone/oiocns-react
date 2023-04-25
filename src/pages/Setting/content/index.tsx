import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import CohortSetting from './Cohort';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import { MenuItemType } from 'typings/globelType';
import React from 'react';
import DictSetting from './Dict';
import PropertySetting from './Property';
import AuthoritySetting from './Authority';
import PageDesignList from './PageDesign/PageList';
import PageCompList from './PageDesign/CompList';
import pageCtrl from './PageDesign/pageCtrl';
import { Empty } from 'antd';
import OgoImg from '../../../../public/img/logo/logo2.jpg';
import { MenuType, GroupMenuType } from '../config/menuType';

interface IProps {
  selectMenu: MenuItemType;
  refreshKey?: string;
}

const ContentIndex = ({ selectMenu, refreshKey }: IProps) => {
  if (selectMenu.itemType === '门户设置') {
    pageCtrl.setBelongId = selectMenu.item.id;
  }
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case MenuType.User:
      return <PersonSetting />;
    case MenuType.Company:
      return <CompanySetting current={selectMenu.item} />;
    case MenuType.Agency:
      return <AgencySetting current={selectMenu.item} />;
    case MenuType.Station:
      return <StationSetting current={selectMenu.item} />;
    case MenuType.Cohort:
      return <CohortSetting current={selectMenu.item} />;
    case MenuType.Species:
      return <StandardSetting current={selectMenu.item} />;
    case MenuType.Dict:
      return (
        <DictSetting current={selectMenu.item.dict} belong={selectMenu.item.belong} />
      );
    case MenuType.Property:
      return <PropertySetting current={selectMenu.item} />;
    case MenuType.Authority:
      return <AuthoritySetting current={selectMenu.item} />;
    case GroupMenuType.PageDesignList: {
      return <PageDesignList />;
    }

    case GroupMenuType.PageCompList:
      return <PageCompList />;
    default:
      return (
        <Empty
          image={OgoImg}
          imageStyle={{
            marginTop: '15vh',
            height: 200,
          }}
          description={
            <span>
              请选择 <a>{selectMenu?.label}</a> 子菜单
            </span>
          }></Empty>
      );
  }
};

export default ContentIndex;
