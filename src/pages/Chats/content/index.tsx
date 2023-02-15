import React from 'react';
import Chat from './chat';
import Book from './books';
import { GroupMenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  selectMenu: MenuItemType;
  enterChat: Function;
}

const TypeSetting = ({ selectMenu, enterChat }: IProps) => {
  let preType =
    selectMenu.itemType.indexOf('-') > 0
      ? selectMenu.itemType.substring(0, selectMenu.itemType.indexOf('-'))
      : selectMenu.itemType;
  switch (preType) {
    case GroupMenuType.Chat:
      return <Chat />;
    case GroupMenuType.Books:
      return <Book selectMenu={selectMenu} enterChat={enterChat} />;
    default:
      return <></>;
  }
};

export default TypeSetting;
