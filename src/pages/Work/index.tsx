import MainLayout from '@/components/MainLayout';
import React, { useState } from 'react';
import Content from './content';
import { ImSearch } from 'react-icons/im';
import { XWorkDefine } from '@/ts/base/schema';
import WorkStart from './content/work/start';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadWorkMenu } from './config/menuOperate';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
import { Input } from 'antd';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadWorkMenu);
  const [openFlow, setOpenFlow] = useState(false);
  const [filter, setFilter] = useState('');

  if (!selectMenu || !rootMenu) return <></>;

  const content = () => {
    if (openFlow) {
      return (
        <WorkStart
          current={selectMenu.item as XWorkDefine}
          species={selectMenu.parentMenu?.item as IWorkItem}
          space={(selectMenu.parentMenu?.item as IWorkItem).current.space}
          goBack={() => setOpenFlow(false)}
        />
      );
    }
    return <Content key={key} selectMenu={selectMenu} filter={filter} />;
  };

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={
        <Input
          style={{ height: 30, fontSize: 15 }}
          placeholder="搜索"
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}></Input>
      }
      onMenuClick={async (_data, key) => {
        switch (key) {
          case '发起办事':
            setOpenFlow(true);
            break;
          default:
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {content()}
    </MainLayout>
  );
};

export default Todo;
