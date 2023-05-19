import React from 'react';
import { MenuItemType } from 'typings/globelType';
import ThingIndex from '@/pages/Store/content/Thing';
import { ICommodity, SpeciesType } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case SpeciesType.Commodity: {
      const commodity = props.selectMenu.item as ICommodity;
      const propertys = [];
      for (const item of commodity.form?.attributes || []) {
        if (item.linkPropertys && item.linkPropertys.length > 0) {
          propertys.push(item.linkPropertys[0]);
        }
      }
      return (
        <ThingIndex
          belongId={commodity.belongId}
          labels={[`S${commodity.metadata.id}`]}
          forms={[]}
          propertys={propertys}
        />
      );
    }
    default:
      return <></>;
  }
};

export default ContentIndex;
