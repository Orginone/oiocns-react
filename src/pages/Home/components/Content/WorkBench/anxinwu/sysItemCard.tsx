import React, { useState } from 'react';
import { Dropdown, Spin } from 'antd';
import useConpanyCacheData from '@/hooks/useCompanyCache';
import { ImPlus } from 'react-icons/im';
import OpenFileDialog from '@/components/OpenFileDialog';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { ICompany, orgAuth } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { XHomeCacheData } from '@/ts/base/schema';
import { formatDate } from '@/utils';
import { OperateMenuType } from 'typings/globelType';
import { command } from '@/ts/base';
interface SysItemCardType {
  title: string;
  tagName?: string;
}

const SysItemCard: React.FC<SysItemCardType> = ({ title, tagName = '' }) => {
  //超级管理员，并且开启编辑允许修改
  const SuperAuth =
    orgCtrl.user.hasAuthoritys([orgAuth.SuperAuthId]) && sessionStorage.homeSetting == 1;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogParams = {
    title: `${title}选择`,
    accepts: ['办事', '表单', '目录', '应用', '模块'], //, '文件'
    excludeIds: ['445708344880140288'],
  };
  const [loaded, dataSource, OpenItem, refresh] = useConpanyCacheData(
    'home',
    tagName || title,
  );
  return (
    <>
      <div className="cardItem-header">
        <span className="title">{title}</span>
        {SuperAuth && (
          <span
            className="extraBtn hidden"
            onClick={() => {
              setIsOpen(true);
            }}>
            <ImPlus /> <span>配置</span>
          </span>
        )}
      </div>
      <Spin spinning={!loaded} tip={'加载中...'}>
        <div className="cardItem-viewer">
          <div className="cardItem-box">
            {dataSource.map((item) =>
              loadSysItem(item, tagName || title, OpenItem, refresh),
            )}
          </div>
        </div>
      </Spin>

      {isOpen && (
        <OpenFileDialog
          title={title + '配置'}
          rootKey={'disk'}
          multiple
          accepts={dialogParams.accepts || []}
          allowInherited
          excludeIds={dialogParams.excludeIds || []}
          onCancel={() => setIsOpen(false)}
          onOk={async (files) => {
            setIsOpen(false);
            for (const item of files) {
              const targetCompany: ICompany | undefined = orgCtrl.user.companys.find(
                (comp) => comp.id === '445708344880140288', //item.metadata.shareId,
              )!;

              const cacheObjItem: XHomeCacheData = {
                id: item.id,
                name: item.name,
                metadata: item.metadata,
                typeName: item.typeName,
                tag: title,
                sort: new Date().getTime(),
                updateTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm'),
              };
              await targetCompany.setCacheData('insert', cacheObjItem);
              targetCompany.cacheCompanyData(true);
            }
            // refresh();
          }}
        />
      )}
    </>
  );
};
// 成果管理入口
const loadSysItem = (
  item: any,
  cacheTagName: string = '常用',
  OpenItem: (item: XHomeCacheData) => void,
  refresh: Function,
) => (
  <Dropdown
    key={item.key}
    menu={contextMenu(item, cacheTagName, refresh)}
    trigger={['contextMenu']}>
    <div
      className="appCard chengguo"
      onClick={async () => {
        OpenItem(item);
      }}>
      <EntityIcon entity={item.metadata} size={40} hideInfo />
      <div className="appName">{item.name}</div>
    </div>
  </Dropdown>
);

const contextMenu = (target: any, cacheTagName: string = '常用', refresh: Function) => {
  const SuperAuth =
    orgCtrl.user.hasAuthoritys([orgAuth.SuperAuthId]) && sessionStorage.homeSetting == 1;
  if (!SuperAuth) {
    return {
      items: [],
    };
  }
  const useAlays = true;
  const menus: OperateMenuType[] = [
    {
      key: 'update',
      label: '更新信息',
      icon: <></>,
    },
    {
      key: useAlays ? 'unsetCommon' : 'setCommon',
      label: useAlays ? '取消常用' : '设为常用',
      icon: <></>,
    },
  ];
  return {
    items: menus,
    onClick: async ({ key }: { key: string }) => {
      const targetCompany: ICompany | undefined = orgCtrl.user.companys.find(
        (comp) => comp.id === '445708344880140288',
        //target.metadata.shareId,
      );
      if (!targetCompany) {
        return <></>;
      }
      switch (key) {
        case 'update': {
          target.groupTags = ['首页配置'];
          command.emitter(
            'executor',
            'update',
            target,
            targetCompany,
            async (updateData: {
              icon: string;
              name: string;
              tag: string;
              sort: number;
            }) => {
              console.log('updateData', updateData);
              const { metadata, ...rest } = target;
              const cacheObjItem: XHomeCacheData = {
                ...rest,
                name: updateData.name,
                metadata: { ...metadata, icon: updateData.icon },
                tag: updateData.tag,
                sort: updateData.sort || 666,
                updateTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm'),
              };
              await targetCompany.setCacheData('insert', cacheObjItem);
              targetCompany.cacheCompanyData(true);
            },
          );

          break;
        }
        case 'unsetCommon':
          {
            const cacheObjItem = {
              id: target.id,
              tag: cacheTagName,
            };
            await targetCompany.setCacheData('delete', cacheObjItem);
            targetCompany.cacheCompanyData(true);
          }
          break;
        default:
          {
            const cacheObjItem: XHomeCacheData = {
              id: target.id,
              name: target.name,
              metadata: target.metadata,
              typeName: target.typeName,
              tag: cacheTagName,
              sort: new Date().getTime(),
              updateTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm'),
            };
            await targetCompany.setCacheData('insert', cacheObjItem);
            targetCompany.cacheCompanyData(true);
          }
          break;
      }
      refresh();
    },
  };
};
export default SysItemCard;
