import React from 'react';
import { IDEntity } from '@/ts/core';
import { Badge, Dropdown, List, MenuProps, Tag } from 'antd';
import { showChatTime } from '@/utils/tools';
import css from './less/list.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import * as dev from 'devextreme-react';

const VListMode = ({
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
  const getItemClassName = (item: IDEntity) => {
    if (focusFile?.key === item.key || selectFiles.some((i) => i.key === item.key)) {
      return css.list_item_select;
    }
    return css.list_item;
  };
  return (
    <dev.List<IDEntity, string>
      itemKeyFn={(item: IDEntity) => item.id}
      dataSource={content}
      height={'100%'}
      width={'100%'}
      scrollingEnabled
      hoverStateEnabled={false}
      focusStateEnabled={false}
      activeStateEnabled={false}
      pageLoadMode="scrollBottom"
      searchExpr={['name', 'remark']}
      scrollByContent={false}
      onItemClick={(e) => {
        fileOpen(e.itemData, false);
      }}
      noDataText=""
      itemRender={(item: IDEntity) => {
        return (
          <Dropdown menu={contextMenu(item)} trigger={['contextMenu']} destroyPopupOnHide>
            <div className={getItemClassName(item)}>
              <List.Item
                onClick={() => {
                  fileOpen(item, false);
                }}
                onDoubleClick={() => {
                  fileOpen(item, true);
                }}
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
                            <Tag key={label} color={'success'}>
                              {label}
                            </Tag>
                          );
                        })}
                    </>
                  }
                  avatar={
                    <Badge count={item.badgeCount} size="small">
                      <EntityIcon entity={item.metadata} size={46} />
                    </Badge>
                  }
                  description={
                    <div className="ellipsis1">{item.remark || item.code}</div>
                  }
                />
              </List.Item>
            </div>
          </Dropdown>
        );
      }}
      itemDeleteMode="static"></dev.List>
  );
};
export default VListMode;
