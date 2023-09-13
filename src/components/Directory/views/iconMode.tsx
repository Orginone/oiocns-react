import { Dropdown, Card, Typography, MenuProps } from 'antd';

import React from 'react';
import cls from './less/icon.module.less';
import { IFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const IconMode = ({
  content,
  fileOpen,
  contextMenu,
}: {
  content: IFileInfo<schema.XEntity>[];
  fileOpen: (file: IFileInfo<schema.XEntity>) => Promise<void>;
  contextMenu: (file?: IFileInfo<schema.XEntity>) => MenuProps;
}) => {
  const FileCard = (item: IFileInfo<schema.XEntity>) => (
    <Dropdown key={item.id} menu={contextMenu(item)} trigger={['contextMenu']}>
      <Card
        size="small"
        className={cls.fileCard}
        bordered={false}
        key={item.key}
        onDoubleClick={async () => {
          await fileOpen(item);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <EntityIcon entity={item.metadata} size={50} />
        </div>
        <div className={cls.fileName} title={item.name}>
          <Typography.Text title={item.name} ellipsis>
            {item.name}
          </Typography.Text>
        </div>
        <div className={cls.fileName} title={item.typeName}>
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
        className={cls.content}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        {content.map((el) => FileCard(el))}
      </div>
    </Dropdown>
  );
};
export default IconMode;
