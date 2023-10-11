import { Dropdown, Card, Typography } from 'antd';

import React from 'react';
import cls from './index.module.less';
import { IDirectory, IFile } from '@/ts/core';
import { command } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadFileMenus } from '@/executor/fileOperate';

const IconMode = ({ dircetory }: { dircetory: IDirectory }) => {
  const contextMenu = (file?: IFile) => {
    var entity = file || dircetory;
    return {
      items: loadFileMenus(entity, 0).filter(
        (i) => !['openChat', 'copy', 'parse'].includes(i.key),
      ),
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, file || dircetory, dircetory.key);
      },
    };
  };
  const FileCard = (item: IFile) => (
    <Dropdown key={item.id} menu={contextMenu(item)} trigger={['contextMenu']}>
      <Card
        size="small"
        bordered={false}
        key={item.key}
        className={cls.fileCard}
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
        {dircetory.content(0).map((el) => FileCard(el))}
      </div>
    </Dropdown>
  );
};
export default IconMode;
