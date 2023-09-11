import { MenuItemType } from 'typings/globelType';
import { IForm } from '@/ts/core';
import React from 'react';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

/** 加载组织分类菜单(待完成) */
export const loadSpeciesItemMenu = (form: IForm): MenuItemType => {
  return {
    key: form.key,
    label: form.name,
    itemType: 'Tab',
    children: [],
    icon: <EntityIcon notAvatar={true} entityId={form.id} size={18} />,
  };
};
