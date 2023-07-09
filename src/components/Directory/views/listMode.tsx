import React from 'react';
import { IFileInfo } from '@/ts/core';
import { command, schema } from '@/ts/base';
import { Dropdown, List, Tag } from 'antd';
import { showChatTime } from '@/utils/tools';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadFileMenus } from '@/executor/fileOperate';

const ListMode = ({
  current,
  mode,
}: {
  current: IFileInfo<schema.XEntity>;
  mode: number;
}) => {
  const cmdType = mode === 1 ? 'data' : 'config';
  return (
    <List
      itemLayout="horizontal"
      dataSource={current.content(mode)}
      renderItem={(item) => {
        return (
          <Dropdown
            menu={{
              items: loadFileMenus(item, mode),
              onClick: ({ key }) => {
                command.emitter(cmdType, key, current, current.key);
              },
            }}
            trigger={['contextMenu']}>
            <List.Item
              className={'rlv-list-item'}
              style={{ cursor: 'pointer', padding: 6 }}
              onDoubleClick={async () => {
                await item.loadContent();
                command.emitter(cmdType, 'open', item);
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
  );
};
export default ListMode;
