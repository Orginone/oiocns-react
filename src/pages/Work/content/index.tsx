import { MenuItemType } from 'typings/globelType';
import React from 'react';
import { GroupMenuType } from '../config/menuType';
import TaskContent from './Task';
import WorkContent from './Work';

interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const ContentIndex = ({ selectMenu, filter }: IProps) => {
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case GroupMenuType.WorkItem:
      return <WorkContent current={selectMenu.item} />;
    case GroupMenuType.Species:
      return <></>;
    default:
      return (
        <TaskContent
          taskType={selectMenu.itemType}
          space={selectMenu.item}
          filter={filter}
        />
      );
  }
};

export default ContentIndex;
