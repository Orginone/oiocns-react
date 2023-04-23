import React from 'react';
import Chat from './chat';
import Book from './books';
import { MenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  key: string;
  filter: string;
  openDetail: boolean;
  selectMenu: MenuItemType;
}

const TypeChat = ({ filter, selectMenu, openDetail }: IProps) => {
  switch (selectMenu.itemType.split('-')[0]) {
    case MenuType.Chat:
      return <Chat chat={selectMenu.item} openDetail={openDetail} filter={filter} />;
    default:
      return <Book chats={selectMenu.item} filter={filter} />;
  }
};

export default TypeChat;
