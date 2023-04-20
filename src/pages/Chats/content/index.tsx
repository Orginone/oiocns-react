import React from 'react';
import Chat from './chat';
import Book from './books';
import { GroupMenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  key: string;
  openDetail: boolean;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ key, selectMenu, openDetail }: IProps) => {
  switch (selectMenu.itemType.split('-')[0]) {
    case GroupMenuType.Chat:
      return <Chat openDetail={openDetail} />;
    default:
      return <Book key={key} belongId={selectMenu.belong?.id ?? ''} />;
  }
};

export default TypeSetting;
