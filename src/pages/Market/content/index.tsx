import React from 'react';
import { MenuItemType } from 'typings/globelType';
import ThingIndex from '@/pages/Store/content/Thing';
import { SpeciesType } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case SpeciesType.Commodity:
      return <ThingIndex species={props.selectMenu.item} selectable={false} />;
    default:
      return <></>;
  }
};

export default ContentIndex;
