import MainLayout from '@/components/MainLayout';
import React, { useState } from 'react';
import Content from './content';
import orgCtrl from '@/ts/controller/';
import { Input } from 'antd';
import { ImSearch } from 'react-icons/im';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadWorkMenu);
  const [filter, setFilter] = useState('');
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
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
      // onMenuClick={async (data, key) => {}}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '发起':
            // setOpenFlow(true);
            break;
          default:
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {/* <Modal
        width="800px"
        title="发起办事"
        open={openFlow}
        destroyOnClose={true}
        onOk={() => {
          if (!selectData) {
            message.error('请先选择办事');
            return;
          }
          setDoWork(selectData[0].data);
          setOpenFlow(false);
        }}
        onCancel={() => setOpenFlow(false)}>
        <FlowSelect
          multiple={false}
          orgId={orgCtrl.user.id}
          onCheckeds={(params: any) => setSelectData(params)}
        />
      </Modal> */}
      <Content key={key} selectMenu={selectMenu} filter={filter} />
    </MainLayout>
  );
};

export default Todo;
