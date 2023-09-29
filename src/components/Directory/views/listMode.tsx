import React, { useState } from 'react';
import { IFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import { Dropdown, List, MenuProps, Tag } from 'antd';
import { showChatTime } from '@/utils/tools';
import css from './less/list.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const ListMode = ({
  select,
  content,
  fileOpen,
  contextMenu,
}: {
  select: IFileInfo<schema.XEntity> | undefined;
  content: IFileInfo<schema.XEntity>[];
  fileOpen: (
    file: IFileInfo<schema.XEntity> | undefined,
    dblclick: boolean,
  ) => Promise<void>;
  contextMenu: (file?: IFileInfo<schema.XEntity>) => MenuProps;
}) => {
  const [cxtItem, setCxtItem] = useState<IFileInfo<schema.XEntity>>();
  return (
    <Dropdown menu={contextMenu(cxtItem)} trigger={['contextMenu']} destroyPopupOnHide>
      <div
        style={{ width: '100%', height: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}>
        <List
          itemLayout="horizontal"
          dataSource={content}
          renderItem={(item) => {
            return (
              <div
                className={select?.id === item.id ? css.list_item_select : css.list_item}>
                <List.Item
                  onClick={async () => {
                    await fileOpen(item, false);
                  }}
                  onDoubleClick={async () => {
                    await fileOpen(item, true);
                  }}
                  onContextMenu={() => setCxtItem(item)}
                  actions={[
                    <div key={item.id} title={item.metadata.updateTime}>
                      {showChatTime(item.metadata.updateTime)}
                    </div>,
                  ]}>
                  <List.Item.Meta
                    title={
                      <>
                        <span style={{ marginRight: 10 }}>{item.name}</span>
                        <Tag color="green" title={'文件类型'}>
                          {item.typeName}
                        </Tag>
                      </>
                    }
                    avatar={<EntityIcon entity={item.metadata} size={42} />}
                    description={item.remark || item.code}
                  />
                </List.Item>
              </div>
            );
          }}
        />
      </div>
    </Dropdown>
  );
};
export default ListMode;
