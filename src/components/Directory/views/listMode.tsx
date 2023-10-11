import React, { useState } from 'react';
import { IFile } from '@/ts/core';
import { Dropdown, List, MenuProps, Tag } from 'antd';
import { showChatTime } from '@/utils/tools';
import css from './less/list.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const ListMode = ({
  focusFile,
  content,
  fileOpen,
  contextMenu,
  selectFiles,
}: {
  content: IFile[];
  selectFiles: IFile[];
  focusFile: IFile | undefined;
  fileOpen: (file: IFile | undefined, dblclick: boolean) => Promise<void>;
  contextMenu: (file?: IFile) => MenuProps;
}) => {
  const [cxtItem, setCxtItem] = useState<IFile>();
  const getItemClassName = (item: IFile) => {
    if (focusFile?.id === item.id || selectFiles.some((i) => i.id === item.id)) {
      return css.list_item_select;
    }
    return css.list_item;
  };
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
              <div className={getItemClassName(item)}>
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
                        <div className={css.item_title}>{item.name}</div>
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
        <div
          style={{ height: `calc(100% - ${content.length * 75}px)` }}
          className={css.blank_area}
          onContextMenu={() => setCxtItem(undefined)}></div>
      </div>
    </Dropdown>
  );
};
export default ListMode;
