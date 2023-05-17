import React from 'react';
import { MenuItemType } from 'typings/globelType';
import ThingIndex from '@/pages/Store/content/Thing';
import { IForm } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case '表单': {
      const from = props.selectMenu.item as IForm;
      const propertys = [];
      for (const item of from.attributes || []) {
        if (item.linkPropertys && item.linkPropertys.length > 0) {
          propertys.push(item.linkPropertys[0]);
        }
      }
      return (
        <ThingIndex
          belongId={from.metadata.belongId}
          labels={[`S${from.id}`]}
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
