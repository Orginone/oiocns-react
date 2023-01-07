import React from 'react';
import Chat from './chat';
import Book from './books';
import { GroupMenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  selectMenu: MenuItemType;
}

const TypeSetting = ({ selectMenu }: IProps) => {
  switch (selectMenu.itemType) {
    case GroupMenuType.Chat:
      return <Chat />;
    case GroupMenuType.Books:
      return <Book selectMenu={selectMenu} />;
    default:
      return <></>;
  }
};

export default TypeSetting;
