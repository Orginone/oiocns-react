import MainLayout from '@/components/MainLayout';
import React, { useState } from 'react';
import Content from './content';
import orgCtrl from '@/ts/controller/';
import useMenuUpdate from './hooks/useMenuUpdate';
import { Input, Modal } from 'antd';
import { ImSearch } from 'react-icons/im';
import { XFlowDefine } from '@/ts/base/schema';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem } from '@/ts/core';
import { FlowColumn } from '../Setting/config/columns';
import WorkStart from './work/WorkStartDo';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [openFlow, setOpenFlow] = useState(false);
  const [selectData, setSelectData] = useState<XFlowDefine>();
  const [filter, setFilter] = useState('');
  if (!selectMenu) return <></>;

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
        setSelectData(undefined);
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
      onMenuClick={async (data, key) => {
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
        onOk={() => {
          setOpenFlow(false);
        }}
        onCancel={() => setOpenFlow(false)}>
        <CardOrTableComp<XFlowDefine>
          dataSource={[]}
          rowSelection={{
            type: 'radio',
            onSelect: (record: XFlowDefine, _: any) => {
              setSelectData(record);
            },
          }}
          request={async (page) => {
            let species = (selectMenu.item as ISpeciesItem[])[0];
            let defines = await species.loadFlowDefine();
            return {
              offset: page.offset,
              limit: page.limit,
              total: defines.length,
              result: defines.slice(page.offset, page.offset + page.limit),
            };
          }}
          hideOperation={true}
          scroll={{ y: 300 }}
          columns={FlowColumn}
          rowKey={'id'}
        />
      </Modal>
      {selectData ? (
        <WorkStart
          current={selectData}
          target={(selectMenu.item as ISpeciesItem[])[0].team}
          goBack={() => setSelectData(undefined)}></WorkStart>
      ) : (
        <Content key={key} selectMenu={selectMenu} filter={filter} />
      )}
    </MainLayout>
  );
};

export default Todo;
