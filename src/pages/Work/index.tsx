import MainLayout from '@/components/MainLayout';
import React, { useEffect, useState } from 'react';
import Content from './content';
import orgCtrl from '@/ts/controller/';
import { Input, Modal } from 'antd';
import { ImSearch } from 'react-icons/im';
import { XWorkDefine } from '@/ts/base/schema';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem } from '@/ts/core';
import { FlowColumn } from '../Setting/config/columns';
import WorkStart from './content/work/start';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadWorkMenu } from './config/menuOperate';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadWorkMenu);
  const [openFlow, setOpenFlow] = useState(false);
  const [dataSource, setDataSource] = useState<XWorkDefine[]>([]);
  const [selectWork, setSelectWork] = useState<XWorkDefine>();
  const [filter, setFilter] = useState('');
  useEffect(() => {
    if (selectMenu?.item) {
      setDataSource((selectMenu.item as IWorkItem).defines);
    }
  }, [selectMenu]);

  if (!selectMenu || !rootMenu) return <></>;

  const content = () => {
    if (selectWork) {
      return (
        <WorkStart
          current={selectWork}
          space={(selectMenu.item as ISpeciesItem).current.space}
          goBack={() => setSelectWork(undefined)}
        />
      );
    }
    return <Content key={key} selectMenu={selectMenu} filter={filter} />;
  };

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
        setSelectWork(undefined);
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
      <Modal
        width="800px"
        title="发起办事"
        open={openFlow}
        destroyOnClose={true}
        onOk={() => setOpenFlow(false)}
        onCancel={() => setOpenFlow(false)}>
        <CardOrTableComp<XWorkDefine>
          rowKey={'id'}
          columns={FlowColumn}
          hideOperation={true}
          dataSource={dataSource}
          rowSelection={{
            type: 'radio',
            onSelect: (record: XWorkDefine, _: any) => {
              setSelectWork(record);
            },
          }}
        />
      </Modal>
      {content()}
    </MainLayout>
  );
};

export default Todo;
