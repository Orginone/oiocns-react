import MainLayout from '@/components/MainLayout';
import orgCtrl from '@/ts/controller';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import React, { useEffect, useState } from 'react';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import FlowSelect from '@/bizcomponents/FlowManage';
import { Modal, message } from 'antd';
import { XFlowDefine } from '@/ts/base/schema';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [openFlow, setOpenFlow] = useState<boolean>();
  const [selectData, setSelectData] = useState<any>();
  const [doWork, setDoWork] = useState<XFlowDefine>();
  useEffect(() => {
    refreshMenu();
    todoCtrl.loadWorkTodo();
  }, [orgCtrl.user.id]);

  if (!selectMenu) return <></>;

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        todoCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      // onMenuClick={async (data, key) => {}}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '发起':
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
      </Modal>
      <Content
        key={key}
        selectMenu={selectMenu}
        reflashMenu={refreshMenu}
        doWork={doWork}
      />
    </MainLayout>
  );
};

export default Todo;
