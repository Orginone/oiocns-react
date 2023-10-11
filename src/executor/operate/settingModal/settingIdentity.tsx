import React, { useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { IIdentity, ITarget } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import EntityInfo from '@/components/Common/EntityInfo';
import * as im from '@/icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import IdentityForm from './subModal/IdentityForm';
import SelectMember from '@/components/Common/SelectMember';
import { Modal, message } from 'antd';
import CardOrTableComp from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { PersonColumns } from '@/config/column';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { Controller } from '@/ts/controller';

interface IProps {
  target: ITarget;
  finished: () => void;
}

/** 角色设置 */
const SettingIdentity: React.FC<IProps> = ({ target, finished }) => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    () => loadSettingMenu(target),
    new Controller(target.key),
  );
  const [tabKey, refreshTable] = useObjectUpdate(key);
  const [operateKey, setOperateKey] = useState('');
  const [identity, setIdentity] = useState<IIdentity>();
  if (!selectMenu || !rootMenu) return <></>;

  const readerOperation = (item: schema.XTarget) => {
    if (item.id !== target.userId) {
      return [
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除</span>,
          onClick: async () => {
            Modal.confirm({
              title: '提示',
              content: '确认移除该人员',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                await identity?.removeMembers([item]);
                setOperateKey('');
                refreshTable();
              },
            });
          },
        },
      ];
    }
    return [];
  };
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={target.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entity={target.metadata} />}
      destroyOnClose
      onCancel={() => finished()}>
      <MainLayout
        notExitIcon
        leftShow
        rightShow={false}
        selectMenu={selectMenu}
        onSelect={async (data) => {
          if ('current' in data.item) {
            const identity: IIdentity = data.item;
            await identity.loadMembers();
            setIdentity(identity);
          } else {
            setIdentity(undefined);
          }
          setSelectMenu(data);
        }}
        onMenuClick={(_, key) => {
          if (key == '删除') {
            setSelectMenu(rootMenu);
          } else {
            setOperateKey(key);
          }
        }}
        siderMenuData={rootMenu}>
        <EntityInfo key={key} entity={selectMenu.item} />
        {identity && (
          <>
            <div style={{ flex: 1 }}>
              <CardOrTableComp<schema.XTarget>
                key={tabKey}
                dataSource={identity.members}
                scroll={{ y: 'calc(60vh - 150px)' }}
                columns={PersonColumns}
                rowKey={'id'}
                operation={readerOperation}
              />
            </div>
            <SelectMember
              open={operateKey === '分配成员'}
              members={target.space.members}
              exclude={identity.members}
              finished={async (selected) => {
                if (selected.length > 0) {
                  if (await identity.pullMembers(selected)) {
                    message.success('分配成员成功');
                    refreshTable();
                  }
                }
                setOperateKey('');
              }}
            />
          </>
        )}
      </MainLayout>
      {['新增', '编辑'].includes(operateKey) && (
        <IdentityForm
          current={selectMenu.item}
          finished={(success) => {
            setOperateKey('');
            if (success) {
              setSelectMenu(selectMenu);
            }
          }}
        />
      )}
    </FullScreenModal>
  );
};

/** 加载设置模块菜单 */
const loadSettingMenu = (target: ITarget): MenuItemType => {
  return {
    key: target.key,
    label: target.name,
    itemType: 'Tab',
    item: target,
    menus: loadMenus(target),
    children: target.identitys.map((item) => {
      return {
        key: item.key,
        item: item,
        label: item.name,
        itemType: '角色',
        menus: loadMenus(item),
        icon: <EntityIcon notAvatar={true} entity={item.metadata} size={18} />,
        children: [],
      };
    }),
    icon: <EntityIcon entity={target.metadata} size={18} />,
  };
};

/** 加载右侧菜单 */
const loadMenus = (item: ITarget | IIdentity) => {
  const items: OperateMenuType[] = [];
  if ('current' in item) {
    if (item.current.hasRelationAuth()) {
      items.push(
        {
          key: '分配成员',
          icon: <im.ImUserPlus />,
          label: '分配成员',
          model: 'outside',
        },
        {
          key: '编辑',
          icon: <im.ImCog />,
          label: '编辑角色',
        },
        {
          key: '删除',
          icon: <im.ImBin />,
          label: '删除角色',
          beforeLoad: async () => {
            return await item.delete();
          },
        },
      );
    }
  } else if (item.hasRelationAuth()) {
    items.push({
      key: '新增',
      icon: <im.ImPlus />,
      label: '新增角色',
      model: 'outside',
    });
  }
  return items;
};
export default SettingIdentity;
