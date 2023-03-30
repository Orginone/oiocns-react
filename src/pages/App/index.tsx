import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { IconFont } from '@/components/IconFont';
import { useLocation } from 'react-router-dom';
import * as im from 'react-icons/im';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, message } from 'antd';
import ChooseOperation from '@/pages/App/chooseOperation';
import { getUuid } from '@/utils/tools';
import { MenuItemType } from 'typings/globelType';
import Content from './content';
import BaseInfo from '@/pages/App/baseInfo';
import { XOperation } from '@/ts/base/schema';
/** 应用模块 */
const AppManager: React.FC = () => {
  const [selectMenu, setSelectMenu] = useState<any>();
  const [contentType, setContentType] = useState<any>();
  const [chooseOperationModal, setChooseOperationModal] = useState<any>();
  const [baseInfoModal, setBaseInfoModal] = useState<any>();
  const [tkey, setTKey] = useState<number>(0);
  const location = useLocation<any>();
  let appInfo = location.state?.appInfo;
  const [app, setApp] = useState<any>(appInfo);
  const refreshApp_ = (parent: any, key: string, data: any) => {
    parent.children = parent.children || [];
    if (parent.children.map((item: any) => item.key).includes(key)) {
      if (!data) {
        parent.children = parent.children.filter((item: any) => item.key != key);
      } else {
        parent.children = parent.children.map((item: any) => {
          if (item.key == key) {
            return data;
          }
          return item;
        });
      }
    } else {
      parent.children = parent.children.map((item: any) => refreshApp_(item, key, data));
    }

    return parent;
  };
  const refreshApp = (key: string, data: any) => {
    let app_ = refreshApp_(app, key, data);
    setApp(app_);
    setTKey(tkey + 1);
    message.success('已刷新');
  };
  const getNewItem = (type: string, item: any): MenuItemType => {
    let typeName = '表单';
    let typeIcon = <im.ImFileText />;
    let typeOperates = [
      {
        key: 'formDesign',
        label: '设计',
        icon: <></>,
      },
      {
        key: 'chooseTemplate',
        label: '选取模板',
        icon: <></>,
      },
    ];
    if (type == 'folder') {
      typeName = '分组';
      typeIcon = <im.ImFolder />;
      typeOperates = [
        {
          key: 'formAdd',
          label: '新建表单',
          icon: <></>,
        },
        {
          key: 'folderAdd',
          label: '新建分组',
          icon: <></>,
        },
      ];
    }
    return {
      key: getUuid(),
      label: `未命名${typeName}`,
      itemType: `${typeName}`,
      item: item,
      icon: typeIcon,
      menus: [
        ...typeOperates,
        ...[
          // {
          //   key: `${type}Move`,
          //   label: '移动',
          //   icon: <></>,
          // },
          {
            key: `${type}Edit`,
            label: '修改',
            icon: <></>,
          },
          {
            key: `${type}Delete`,
            label: '删除',
            icon: <></>,
          },
        ],
      ],
      children: [],
    };
  };

  const addFolderOrForm = (data: any, type: string, item?: any) => {
    if (!data.children) {
      data.children = [];
    }
    data.children = [...data.children, getNewItem(type, item)];
    refreshApp(data.key, data);
  };
  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span
          onClick={() => {
            // addFolderOrForm(app, 'form');
            setChooseOperationModal({ data: app, type: 'formAdd' });
            // setBaseInfoModal({ data: undefined, root: app, type: 'formAdd' });
          }}>
          新建表单
        </span>
      ),
      icon: <im.ImFileText />,
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            addFolderOrForm(app, 'folder');
            // setBaseInfoModal({ data: undefined, root: app, type: 'folderAdd' });
          }}>
          新建分组
        </span>
      ),
      icon: <im.ImFolder />,
    },
  ];
  return (
    <MainLayout
      key={tkey}
      title={{
        label: `应用(${app.name})`,
        icon: <IconFont type={'icon-jianyingyong'} />,
      }}
      selectMenu={
        selectMenu || {
          key: '1',
          label: '管理的',
          itemType: 'group',
          icon: <im.ImHome />,
          children: [],
        }
      }
      onSelect={async (data) => {
        setContentType(undefined);
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case 'formAdd':
            setChooseOperationModal({ data: data, type: key });
            // setBaseInfoModal({ data: undefined, root: data, type: key });
            break;
          case 'folderAdd':
            addFolderOrForm(data, 'folder');
            // setBaseInfoModal({ data: undefined, root: data, type: key });
            break;
          case 'formMove':
          case 'folderMove':
            break;
          case 'formEdit':
          case 'folderEdit':
            // setRenameModal(data);
            setBaseInfoModal({ data: data, type: key });
            break;
          case 'formDelete':
          case 'folderDelete':
            refreshApp(data.key, undefined);
            break;
          case 'formDesign':
            setSelectMenu(data);
            setContentType('formDesign');
            break;
          case 'chooseTemplate':
            setChooseOperationModal({ data: data, type: key });
            break;
          default:
            break;
        }
      }}
      checkedList={[]}
      onCheckedChange={() => {}}
      onTabChanged={() => {}}
      searchRightRegion={
        <span style={{ paddingLeft: 5 }}>
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}>
            <Button icon={<PlusOutlined />} />
          </Dropdown>
        </span>
      }
      siderMenuData={{
        key: '可见的',
        label: '可见的',
        itemType: '可见的',
        icon: <im.ImCoinDollar />,
        children: app.children || [],
      }}>
      {selectMenu && (
        <Content
          selectMenu={selectMenu}
          contentType={contentType}
          setContentType={setContentType}
          onSave={(operation: XOperation) => {}}
        />
      )}
      <BaseInfo
        baseInfoModal={baseInfoModal}
        setBaseInfoModal={setBaseInfoModal}
        onOk={(formdata: any) => {
          if (baseInfoModal.type.includes('Edit')) {
            let nodeData = baseInfoModal.data;
            nodeData.label = formdata.label;
            nodeData.remark = formdata.remark;
            refreshApp(nodeData.key, nodeData);
          }
          setBaseInfoModal(undefined);
        }}></BaseInfo>
      <ChooseOperation
        open={chooseOperationModal != undefined}
        onOk={(item: any) => {
          if (chooseOperationModal.type.includes('Add')) {
            addFolderOrForm(chooseOperationModal.data, 'form', item);
          } else if (chooseOperationModal.type.includes('chooseTemplate')) {
            let node = chooseOperationModal.data;
            node.item = item;
            refreshApp(chooseOperationModal.data.key, node);
          }
          setChooseOperationModal(undefined);
        }}
        onCancel={() => setChooseOperationModal(undefined)}></ChooseOperation>
    </MainLayout>
  );
};

export default AppManager;
