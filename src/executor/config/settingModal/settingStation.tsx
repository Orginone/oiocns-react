import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { ICompany, IStation } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as im from '@/icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import StationForm from './subModal/stationForm';
import SelectMember from '@/components/Common/SelectMember';
import SelectIdentity from '@/components/Common/SelectIdentity';
import { Modal, message } from 'antd';
import CardOrTableComp from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { IdentityColumn, PersonColumns } from '@/config/column';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import EntityInfo from '@/components/Common/EntityInfo';
import { Controller } from '@/ts/controller';

interface IProps {
  company: ICompany;
  finished: () => void;
}

/** 岗位设置 */
const SettingStation: React.FC<IProps> = ({ company, finished }) => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    () => loadSettingMenu(company),
    new Controller(company.key),
  );
  const [tabKey, refreshTable] = useObjectUpdate(key);
  const [operateKey, setOperateKey] = useState('');
  const [station, setStation] = useState<IStation>();
  if (!selectMenu || !rootMenu) return <></>;

  const readerOperation = (item: schema.XTarget | schema.XIdentity) => {
    if (item.id !== company.userId) {
      return [
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除{item.name}</span>,
          onClick: async () => {
            Modal.confirm({
              title: '提示',
              content: '确认移除该' + item.typeName ?? '角色',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                if ('authId' in item) {
                  await station?.removeIdentitys([item]);
                } else {
                  await station?.removeMembers([item]);
                }
                refreshTable();
              },
            });
          },
        },
      ];
    }
    return [];
  };

  const loadModal = () => {
    switch (operateKey) {
      case '添加角色':
        return (
          <SelectIdentity
            multiple
            space={company}
            open={operateKey === '添加角色'}
            exclude={station!.identitys}
            finished={async (selected) => {
              let delIdentitys = station!.identitys.filter((a) =>
                selected.every((s) => s.id != a.id),
              );
              if (delIdentitys.length > 0) {
                await station!.removeIdentitys(delIdentitys);
              }
              if (selected.length > 0) {
                if (await station!.pullIdentitys(selected)) {
                  message.success('添加角色成功');
                }
              }
              refreshTable();
              setOperateKey('');
            }}
          />
        );
      case '分配成员':
        <SelectMember
          open={operateKey === '分配成员'}
          members={company.space.members}
          exclude={station!.members}
          finished={async (selected) => {
            if (selected.length > 0) {
              if (await station!.pullMembers(selected)) {
                message.success('分配成员成功');
              }
            }
            refreshTable();
            setOperateKey('');
          }}
        />;
      default:
        return <></>;
    }
  };
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={company.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entityId={company.id} />}
      destroyOnClose
      onCancel={() => finished()}>
      <MainLayout
        notExitIcon
        selectMenu={selectMenu}
        onSelect={async (data) => {
          if (data.itemType === '岗位') {
            const station: IStation = data.item;
            await station.loadIdentitys();
            await station.loadMembers();
            setStation(station);
          } else {
            setStation(undefined);
          }
          setSelectMenu(data);
        }}
        onMenuClick={(_, key) => setOperateKey(key)}
        siderMenuData={rootMenu}>
        {station ? (
          <>
            <div style={{ flex: 1, height: '40vh' }}>
              <CardOrTableComp<schema.XIdentity>
                key={tabKey}
                dataSource={station.identitys}
                scroll={{ y: 'calc(40vh - 150px)' }}
                columns={IdentityColumn}
                rowKey={'id'}
                operation={readerOperation}
              />
            </div>
            <div style={{ flex: 1, height: '40vh' }}>
              <CardOrTableComp<schema.XTarget>
                key={tabKey}
                dataSource={station.members}
                scroll={{ y: 'calc(60vh - 150px)' }}
                columns={PersonColumns}
                rowKey={'id'}
                operation={readerOperation}
              />
            </div>
            {loadModal()}
          </>
        ) : (
          <EntityInfo key={key} entity={selectMenu.item} />
        )}
      </MainLayout>
      {operateKey.includes('岗位') && (
        <StationForm
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
const loadSettingMenu = (company: ICompany): MenuItemType => {
  return {
    key: company.key,
    label: company.name,
    itemType: 'Tab',
    item: company,
    menus: loadMenus(company),
    children: company.stations.map((item) => {
      return {
        key: item.key,
        item: item,
        label: item.name,
        itemType: '岗位',
        menus: loadMenus(item),
        icon: <EntityIcon notAvatar={true} entityId={item.id} size={18} />,
        children: [],
      };
    }),
    icon: <EntityIcon typeName={'岗位'} entityId={'0'} size={18} />,
  };
};

/** 加载右侧菜单 */
const loadMenus = (item: ICompany | IStation) => {
  const items: OperateMenuType[] = [];
  if (!('stations' in item)) {
    if (item.space.hasRelationAuth()) {
      items.push(
        {
          key: '添加角色',
          icon: <im.ImKey2 />,
          label: '添加角色',
          model: 'outside',
        },
        {
          key: '分配成员',
          icon: <im.ImUserPlus />,
          label: '分配成员',
          model: 'outside',
        },
        {
          key: '编辑岗位',
          icon: <im.ImCog />,
          label: '编辑岗位',
        },
        {
          key: '删除岗位',
          icon: <im.ImBin />,
          label: '删除岗位',
          beforeLoad: async () => {
            return await item.delete();
          },
        },
      );
    }
  } else if (item.hasRelationAuth()) {
    items.push({
      key: '新增岗位',
      icon: <im.ImPlus />,
      label: '新增岗位',
      model: 'outside',
    });
  }
  return items;
};
export default SettingStation;
