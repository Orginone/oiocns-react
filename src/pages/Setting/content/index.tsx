import CompanySetting from './Company';
import StationSetting from './Station';
import AgencySetting from './Agency';
import CohortSetting from './Cohort';
import PersonSetting from './Person';
import StandardSetting from './Standard';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import userCtrl from '@/ts/controller/setting';
import React from 'react';
import DictSetting from './Dict';
import PropertySetting from './Property';
import AuthoritySetting from './Authority';
import PageDesignList from './PageDesign/content/list';
import PageCompList from './PageDesign/content/CompList';
import pageCtrl from './PageDesign/pageCtrl';
import { Empty } from 'antd';
import OgoImg from '../../../../public/img/logo/logo2.jpg';
interface IProps {
  selectMenu: MenuItemType;
  refreshKey?: string;
}

const ContentIndex = ({ selectMenu, refreshKey }: IProps) => {
  if (selectMenu.itemType === '门户设置') {
    pageCtrl.setBelongId = selectMenu.belong;
  }
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case GroupMenuType.User:
      return <PersonSetting />;
    case GroupMenuType.Company:
      userCtrl.target = selectMenu.item;
      return <CompanySetting current={selectMenu.item} />;
    case GroupMenuType.Agency:
      userCtrl.target = selectMenu.item;
      return <AgencySetting current={selectMenu.item} />;
    case GroupMenuType.Station:
      return <StationSetting current={selectMenu.item} />;
    case GroupMenuType.Cohort:
      userCtrl.target = selectMenu.item;
      return <CohortSetting current={selectMenu.item} />;
    case GroupMenuType.Species:
      return <StandardSetting current={selectMenu.item} />;
    case GroupMenuType.Dict:
      return <DictSetting current={selectMenu.item} belongId={selectMenu.belong} />;
    case GroupMenuType.Property:
      return <PropertySetting />;
    case GroupMenuType.Authority:
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
