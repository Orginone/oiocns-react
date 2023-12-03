import React, { useState } from 'react';
import { Spin } from 'antd';
import useConpanyCacheData from '@/hooks/useCompanyCache';
import { ImPlus } from 'react-icons/im';
import OpenFileDialog from '@/components/OpenFileDialog';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { ICompany } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { XHomeCacheData } from '@/ts/base/schema';
import { formatDate } from '@/utils';
interface SysItemCardType {
  title: string;
  tagName?: string;
}
const SysItemCard: React.FC<SysItemCardType> = ({ title, tagName = '' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogParams = {
    title: `${title}选择`,
    accepts: ['办事', '表单', '目录', '模块'], //, '文件'
    excludeIds: ['445708344880140288'],
  };
  const [loaded, dataSource, OpenItem] = useConpanyCacheData('home', title);
  return (
    <>
      <div className="cardItem-header">
        <span className="title">{title}</span>
        <span
          className="extraBtn hidden"
          onClick={() => {
            setIsOpen(true);
          }}>
          <ImPlus /> <span>配置</span>
        </span>
      </div>
      <Spin spinning={!loaded} tip={'加载中...'}>
        <div className="cardItem-viewer">
          <div className="cardItem-box">
            {dataSource.map((item) => loadSysItem(item, tagName || title, OpenItem))}
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
) => (
  <div
    className="appCard chengguo"
    onClick={async () => {
      OpenItem(item);
    }}>
    <EntityIcon entity={item.metadata} size={50} hideInfo />
    <div className="appName">{item.name}</div>
  </div>
);

export default SysItemCard;
