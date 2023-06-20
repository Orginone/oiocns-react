import { MenuItemType } from 'typings/globelType';
import React from 'react';
import TaskContent from './Task';

interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu, filter }: IProps) => {
  /** 加载内容区 */
  return (
    <TaskContent taskType={selectMenu.itemType} space={selectMenu.item} filter={filter} />
  );
};

export default ContentIndex;
