import MainLayout from '@/components/MainLayout';
import React from 'react';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() => {
    return {
      key: 'disk',
      label: '办事',
      itemType: 'Tab',
      children: [],
      icon: <OrgIcons work selected />,
    };
  });

  if (!selectMenu || !rootMenu) return <></>;

  return (
    <MainLayout
      rightShow
      leftShow={false}
      previewFlag={'work'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} />
    </MainLayout>
  );
};

export default Todo;
