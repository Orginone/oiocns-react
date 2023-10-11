import React from 'react';
import Chat from './chat';
import Book from './books';
import { MenuType } from '../config/menuType';
import { MenuItemType } from 'typings/globelType';
import { command } from '@/ts/base';

interface IProps {
  key: string;
  filter: string;
  selectMenu: MenuItemType;
}

const TypeChat = ({ filter, selectMenu }: IProps) => {
  switch (selectMenu.itemType.split('-')[0]) {
    case MenuType.Chat:
      command.emitter('preview', 'open', selectMenu.item);
      return <Chat chat={selectMenu.item} filter={filter} />;
    default:
      return <Book chats={selectMenu.item} filter={filter} />;
  }
};

export default TypeChat;
