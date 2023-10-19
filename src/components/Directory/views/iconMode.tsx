import { Dropdown, Card, Typography, MenuProps, Badge } from 'antd';

import React from 'react';
import css from './less/icon.module.less';
import { IDEntity } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const IconMode = ({
  focusFile,
  content,
  fileOpen,
  contextMenu,
  selectFiles,
}: {
  focusFile: IDEntity | undefined;
  content: IDEntity[];
  selectFiles: IDEntity[];
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => MenuProps;
}) => {
  const getItemClassName = (item: IDEntity) => {
    if (focusFile?.id === item.id || selectFiles.some((i) => i.id === item.id)) {
      return css.list_item_select;
    }
    return css.list_item;
  };
  const FileCard = (item: IDEntity) => (
    <Dropdown key={item.id} menu={contextMenu(item)} trigger={['contextMenu']}>
      <Card
        size="small"
        className={getItemClassName(item)}
        bordered={false}
        key={item.key}
        onClick={() => {
          fileOpen(item, false);
        }}
        onDoubleClick={() => {
          fileOpen(item, true);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={css.fileImage}>
          <Badge count={item.badgeCount} size="small">
            <EntityIcon entity={item.metadata} size={50} />
          </Badge>
        </div>
        <div className={css.fileName} title={item.name}>
          <Typography.Text title={item.name} ellipsis>
            {item.name}
          </Typography.Text>
        </div>
        <div className={css.fileName} title={item.typeName}>
          <Typography.Text
            style={{ fontSize: 12, color: '#888' }}
            title={item.typeName}
            ellipsis>
            {item.typeName}
          </Typography.Text>
        </div>
      </Card>
    </Dropdown>
  );
  return (
    <Dropdown menu={contextMenu()} trigger={['contextMenu']} destroyPopupOnHide>
      <div
        className={css.content}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        {content.map((el) => FileCard(el))}
      </div>
    </Dropdown>
  );
};
export default IconMode;
