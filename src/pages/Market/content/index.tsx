import React from 'react';
import { MenuItemType } from 'typings/globelType';
import { MenuType } from '../config/menuType';
import ThingIndex from './Thing';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  if (props.checkedList && props.checkedList.length) {
    return (
      <ThingIndex
        key={props.checkedList?.length}
        species={props.selectMenu.item}
        checkedList={props.checkedList}
        selectable={false}
      />
    );
  }
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case MenuType.Species:
      return (
        <ThingIndex
          species={props.selectMenu.item}
          checkedList={props.checkedList}
          selectable={false}
        />
      );
    default:
      return <></>;
  }
};

export default ContentIndex;
