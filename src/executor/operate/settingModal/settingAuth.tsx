import React, { useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { IAuthority, IBelong } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import MainLayout from '@/components/MainLayout/minLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import EntityInfo from '@/components/Common/EntityInfo';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import AuthForm from './subModal/authForm';
import { Descriptions, Divider, Space, Typography } from 'antd';
import { Controller } from '@/ts/controller';

interface IProps {
  space: IBelong;
  finished: () => void;
}

/** 权限设置 */
const SettingAuth: React.FC<IProps> = ({ space, finished }) => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    () => loadSettingMenu(space.superAuth!),
    new Controller(space.superAuth!.key),
  );
  const [operateKey, setOperateKey] = useState('');
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={space.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entity={space.metadata} />}
      destroyOnClose
      onCancel={() => finished()}>
      <MainLayout
        selectMenu={selectMenu}
        onSelect={(data) => {
          setSelectMenu(data);
        }}
        onMenuClick={(_, key) => {
          if (key == '删除') {
            setSelectMenu(selectMenu.parentMenu || rootMenu);
          } else {
            setOperateKey(key);
          }
        }}
        siderMenuData={rootMenu}>
        <EntityInfo
          key={key}
          entity={selectMenu.item}
          other={
            <>
              {selectMenu.item.metadata.shareId && (
                <Descriptions.Item label="共享组织">
                  <EntityIcon entityId={selectMenu.item.metadata.shareId} showName />
                </Descriptions.Item>
              )}
              <Descriptions.Item label="是否开放">
                {selectMenu.item.metadata.public ? '开放' : '不开放'}
              </Descriptions.Item>
            </>
          }
          extra={
            <Space split={<Divider type="vertical" />} size={0}>
              {selectMenu.menus &&
                selectMenu.menus.length > 0 &&
                selectMenu.menus.map((item) => {
                  return (
                    <Typography.Link
                      key={item.key}
                      title={item.label}
                      style={{ fontSize: 18 }}
                      onClick={() => {
                        item.beforeLoad?.apply(this);
                        if (item.key == '删除') {
                          setSelectMenu(selectMenu.parentMenu || rootMenu);
                        } else {
                          setOperateKey(item.key);
                        }
                      }}>
                      {item.icon}
                    </Typography.Link>
                  );
                })}
            </Space>
          }
        />
      </MainLayout>
      {['新增', '编辑'].includes(operateKey) && (
        <AuthForm
          open
          title={operateKey}
          current={selectMenu.item}
          handleCancel={() => {
            setOperateKey('');
          }}
          handleOk={() => {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }}
        />
      )}
    </FullScreenModal>
  );
};

/** 加载设置模块菜单 */
const loadSettingMenu = (authority: IAuthority): MenuItemType => {
  return {
    key: '超级管理权',
    label: '超级管理权',
    itemType: 'Tab',
    item: authority,
    menus: loadAuthorityMenus(authority),
    children: createMenu(authority.children),
    icon: <EntityIcon notAvatar={true} entity={authority.metadata} size={18} />,
  };
};

/** 创建团队菜单 */
const createMenu = (authoritys: IAuthority[]): MenuItemType[] => {
  const result: any[] = [];
  for (const auth of authoritys) {
    result.push({
      key: auth.key,
      item: auth,
      label: auth.name,
      itemType: '权限',
      menus: loadAuthorityMenus(auth),
      icon: <EntityIcon notAvatar={true} entity={auth.metadata} size={18} />,
      children: createMenu(auth.children),
    });
  }
  return result;
};

/** 加载右侧菜单 */
const loadAuthorityMenus = (item: IAuthority) => {
  const items: OperateMenuType[] = [];
  if (item.space.hasRelationAuth()) {
    items.push({
      key: '新增',
      icon: <im.ImPlus />,
      label: '新增权限',
      model: 'outside',
    });
    if (item.metadata.belongId == item.space.id) {
      items.push(
        {
          key: '编辑',
          icon: <im.ImCog />,
          label: '编辑权限',
        },
        {
          key: '删除',
          icon: <im.ImBin />,
          label: '删除权限',
          beforeLoad: async () => {
            return await item.delete();
          },
        },
      );
    }
  }
  return items;
};
export default SettingAuth;
