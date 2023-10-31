import React, { useState } from 'react';
import { IDEntity } from '@/ts/core';
import { Badge, Dropdown, List, MenuProps, Tag } from 'antd';
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
  content: IDEntity[];
  selectFiles: IDEntity[];
  focusFile: IDEntity | undefined;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => MenuProps;
}) => {
  const [cxtItem, setCxtItem] = useState<IDEntity>();
  const getItemClassName = (item: IDEntity) => {
    if (focusFile?.key === item.key || selectFiles.some((i) => i.key === item.key)) {
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
                  onClick={() => {
                    fileOpen(item, false);
                  }}
                  onDoubleClick={() => {
                    fileOpen(item, true);
                  }}
                  onContextMenu={() => setCxtItem(item)}
                  actions={[
                    <div key={item.id} title={item.updateTime}>
                      {showChatTime(item.updateTime)}
                    </div>,
                  ]}>
                  <List.Item.Meta
                    title={
                      <>
                        <div className={css.item_title}>{item.name}</div>
                        {item.groupTags
                          .filter((i) => i.length > 0)
                          .map((label) => {
                            return (
                              <Tag
                                key={label}
                                color={label === '置顶' ? 'red' : 'success'}>
                                {label}
                              </Tag>
                            );
                          })}
                      </>
                    }
                    avatar={
                      <Badge count={item.badgeCount} size="small">
                        <EntityIcon entity={item.metadata} size={40} />
                      </Badge>
                    }
                    description={item.remark || item.code}
                  />
                </List.Item>
              </div>
            );
          }}
        />
        <div
          style={{ height: `calc(100% - ${content.length * 78}px)` }}
          className={css.blank_area}
          onContextMenu={() => setCxtItem(undefined)}></div>
      </div>
    </Dropdown>
  );
};
export default ListMode;
