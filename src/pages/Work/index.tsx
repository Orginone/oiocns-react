import MainLayout from '@/components/MainLayout';
import React, { useState } from 'react';
import Content from './content';
import orgCtrl from '@/ts/controller/';
import { Input, Modal } from 'antd';
import { ImSearch } from 'react-icons/im';
import { XFlowDefine } from '@/ts/base/schema';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { FlowColumn } from '../Setting/config/columns';
import WorkStart from './content/work/start/Start';
import { GroupMenuType } from './config/menuType';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadWorkMenu } from './config/menuOperate';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadWorkMenu);
  const [openFlow, setOpenFlow] = useState(false);
  const [selectWork, setSelectWork] = useState<XFlowDefine>();
  const [filter, setFilter] = useState('');
  if (!selectMenu || !rootMenu) return <></>;

  const content = () => {
    if (selectWork) {
      switch (selectMenu.itemType) {
        case GroupMenuType.Organization:
          let target = (selectMenu.item as ITarget[])[0];
          return (
            <WorkStart
              space={target.space}
              current={selectWork}
              goBack={() => setSelectWork(undefined)}
            />
          );
        case GroupMenuType.Species:
          let species = (selectMenu.item as ISpeciesItem[])[0];
          return (
            <WorkStart
              current={selectWork}
              space={species.team.space}
              goBack={() => setSelectWork(undefined)}
            />
          );
        default:
          break;
      }
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
        <CardOrTableComp<XFlowDefine>
          rowKey={'id'}
          columns={FlowColumn}
          hideOperation={true}
          dataSource={[]}
          rowSelection={{
            type: 'radio',
            onSelect: (record: XFlowDefine, _: any) => {
              setSelectWork(record);
            },
          }}
          request={async (page) => {
            switch (selectMenu.itemType) {
              case GroupMenuType.Organization:
                let target = (selectMenu.item as ITarget[])[0];
                return await target.loadWork(page);
              case GroupMenuType.Species:
                let species = (selectMenu.item as ISpeciesItem[])[0];
                return await species.loadWork(page);
              default:
                break;
            }
          }}
        />
      </Modal>
      {content()}
    </MainLayout>
  );
};

export default Todo;
