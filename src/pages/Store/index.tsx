import React, { useRef, useState } from 'react';
import storeCtrl from '@/ts/controller/store';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import { GroupMenuType } from './config/menuType';
import { IFileSystemItem } from '@/ts/core';
import Content, { TopBarExtra } from './content';
import { MenuItemType } from 'typings/globelType';
import FileSysOperate from './components/FileSysOperate';
import { IconFont } from '@/components/IconFont';
import { message, Modal } from 'antd';
import SelectOperation from '@/pages/Setting/content/Standard/Flow/Comp/SelectOperation';
import OioForm from '@/components/Form';
import { ProFormInstance } from '@ant-design/pro-components';
import thingCtrl from '@/ts/controller/thing';
import { create_repo,addssh} from "@/services/MyRequest/index";
import userCtrl from '@/ts/controller/setting';
/** 仓库模块 */
const Package: React.FC = () => {
  const formRef = useRef<ProFormInstance<any>>();
  const [operateTarget, setOperateTarget] = useState<MenuItemType>();
  const [operateKey, setOperateKey] = useState<string>();
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [showData, setShowData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const uname=userCtrl.user.target.id
  const usdata:Object={token:"7c49b153d4b59f8c0cf8c3e18dc80cb7",uname:uname}
  return (
    <MainLayout
      title={{ label: '仓库', icon: <IconFont type={'icon-store'} /> }}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        storeCtrl.currentKey = data.key;
        if (data.itemType === GroupMenuType.FileSystemItem) {
          const item = data.item as IFileSystemItem;
          if (item.children.length === 0 && (await item.loadChildren())) {
            refreshMenu();
          }
        }
        setSelectMenu(data);
      }}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onMenuClick={async (data, key) => {
        setOperateKey(key);
        setOperateTarget(data);
      }}
      checkedList={checkedList}
      onTabChanged={(tabKey) => {
        storeCtrl.setTabIndex(tabKey);
        setCheckedList([]);
        refreshMenu();
      }}
      tabKey={storeCtrl.tabIndex}
      onCheckedChange={async (checks: any[]) => {
        setCheckedList(checks);
        refreshMenu();
      }}
      siderMenuData={menus[0]?.menu}
      tabs={menus}>
      <FileSysOperate
        operateKey={operateKey}
        operateTarget={
          operateTarget?.itemType === GroupMenuType.FileSystemItem
            ? operateTarget.item
            : undefined
        }
        operateDone={() => {
          setOperateKey(undefined);
          setOperateTarget(undefined);
        }}
      />
      {operateKey == '创建实体' && (
        <Modal
          title={`选择表单`}
          width={800}
          destroyOnClose={true}
          open={true}
          okText="确定"
          onOk={() => {
            if (showData.length == 0 || showData.length > 1) {
              message.warn('只能选择单条数据');
            }
            if (showData.length == 1) {
              setShowForm(true);
              setOperateKey(undefined);
            }
          }}
          onCancel={() => {
            setOperateKey(undefined);
          }}>
          <SelectOperation
            showData={showData}
            setShowData={setShowData}></SelectOperation>
        </Modal>
      )}
      {showForm && (
        <Modal
          title={`创建实体`}
          width={800}
          destroyOnClose={true}
          open={showForm}
          okText="确定"
          onOk={async () => {
            let values = await formRef.current?.validateFields();
            if (values) {
              /**调用创建物接口 */
              let res = await thingCtrl.createThing(values);
              console.log(values);

              if (res.success) {
                message.success('创建成功');
                if (Object.keys(values)[0]=='428213504277876736') {
                  addssh({...usdata,content:values['428213504277876736'],title:values['428551199910924288']}).then(res=>{
                      message.info(res.data.msg)
                    console.log(res);
                    
                    
                  })
                }
                if(Object.keys(values)[0]=='428210428825440256'){
                  create_repo({...usdata,repo_name:values['428210428825440256']}).then(res=>{
                    message.success(res.data.msg)
                    
                  })
                  
                }

                setShowForm(false);
              } else {
                message.error('创建失败');
              }
            }
          }}
          onCancel={() => {
            setShowForm(false);
          }}>
          <OioForm
            operation={showData[0]?.item}
            formRef={formRef}
            submitter={{
              resetButtonProps: {
                style: { display: 'none' },
              },
              submitButtonProps: {
                style: { display: 'none' },
              },
            }}
          />
        </Modal>
      )}

      <Content
        key={checkedList.length}
        selectMenu={selectMenu}
        checkedList={checkedList}
      />
    </MainLayout>
  );
};

export default Package;
