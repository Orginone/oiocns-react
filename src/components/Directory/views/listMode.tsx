import React from 'react';
import { IFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import { Dropdown, List, MenuProps, Tag } from 'antd';
import { showChatTime } from '@/utils/tools';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const ListMode = ({
  content,
  fileOpen,
  contextMenu,
}: {
  content: IFileInfo<schema.XEntity>[];
  fileOpen: (file: IFileInfo<schema.XEntity>) => Promise<void>;
  contextMenu: (file?: IFileInfo<schema.XEntity>) => MenuProps;
}) => {
  return (
    <Dropdown menu={contextMenu()} trigger={['contextMenu']}>
      <div style={{ width: '100%', height: '100%' }}>
        <div onContextMenu={(e) => e.stopPropagation()}>
          <List
            itemLayout="horizontal"
            dataSource={content}
            renderItem={(item) => {
              return (
                <Dropdown
                  menu={contextMenu(item)}
                  trigger={['contextMenu']}
                  destroyPopupOnHide>
                  <List.Item
                    className={'rlv-list-item'}
                    style={{ cursor: 'pointer', padding: 6 }}
                    onDoubleClick={async () => {
                      await fileOpen(item);
                    }}
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
                </Dropdown>
              );
            }}
          />
        </div>
      </div>
    </Dropdown>
  );
};
export default ListMode;
