import { GroupMenuType } from '../config/menuType';
import React from 'react';
import List from './list';
import CardComp from './components/CardComp';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
interface IProps {
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu }: IProps) => {
  /** 加载内容区 */
  switch (selectMenu.key) {
    case GroupMenuType.PageList:
      return <List />;
    case GroupMenuType.CompList:
    case GroupMenuType.System:
    case GroupMenuType.Chart:
    case GroupMenuType.Custom:
      return <CardComp type={selectMenu.key} />;
    case GroupMenuType.CompDesign:
      return <>CompDesign</>;
    default:
      return <></>;
  }
};

export default ContentIndex;
