import React from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
const loadBookMenu = () => {
  const companyItems = [];
  for (const company of orgCtrl.user.companys) {
    companyItems.push({
      key: company.key + '同事',
      label: company.name,
      item: company.chats.filter((i) => i.isMyChat),
      itemType: company.session.chatdata.chatName,
      icon: <TeamIcon entity={company.metadata} size={18} />,
      company,
      children: [],
    });
  }
  return [
    {
      key: orgCtrl.user.key,
      label: orgCtrl.user.session.chatdata.chatName,
      itemType: orgCtrl.user.session.chatdata.chatName,
      item: orgCtrl.user.chats.filter((i) => i.isMyChat),
      children: [],
      icon: <TeamIcon entity={orgCtrl.user.metadata} size={18} />,
    },
    ...companyItems,
  ];
};
/** 加载会话菜单 */
export const loadChatMenu = () => {
  return {
    key: 'disk',
    label: '沟通',
    itemType: 'Tab',
    children: loadBookMenu(),
    icon: <OrgIcons chat selected />,
  };
};
