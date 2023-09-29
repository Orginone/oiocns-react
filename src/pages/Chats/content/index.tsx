import React from 'react';
import Chat from './chat';
import Book from './books';
import { MenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';
import { ICompany } from '@/ts/core';

interface IProps {
  key: string;
  filter: string;
  selectMenu: MenuItemType;
  belong: ICompany;
}

const TypeChat = ({ filter, selectMenu, belong }: IProps) => {
  switch (selectMenu.itemType.split('-')[0]) {
    case MenuType.Chat:
      return <Chat chat={selectMenu.item} filter={filter} />;
    default:
      return <Book chats={selectMenu.item} filter={filter} belong={belong} />;
  }
};

export default TypeChat;
