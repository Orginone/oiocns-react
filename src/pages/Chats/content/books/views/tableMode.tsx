import React from 'react';
import { IFileInfo, IMsgChat } from '@/ts/core';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { Badge, Dropdown, Modal, Tag, Typography } from 'antd';
import { loadChatOperation } from './common';
const { Text } = Typography;

const TableMode = ({ chats }: { chats: IMsgChat[] }) => {
  return (
    <DataGrid<IMsgChat, string>
      id="grid"
      width="100%"
      height="100%"
      keyExpr="chatdata.fullId"
      columnAutoWidth
      allowColumnResizing
      hoverStateEnabled
      activeStateEnabled
      columnResizingMode={'nextColumn'}
      showColumnLines={false}
      selection={{
        mode: 'single',
      }}
      onRowDblClick={async (e) => {
        orgCtrl.currentKey = e.data.chatdata.fullId;
        orgCtrl.changCallback();
      }}
      headerFilter={{
        visible: true,
        allowSearch: true,
      }}
      dataSource={chats}
      onContextMenuPreparing={(e: any) => {
        e.component.selectRowsByIndexes([e.rowIndex]);
        const modal = Modal.info({
          mask: false,
          icon: <></>,
          width: 1,
          style: {
            position: 'fixed',
            left: e.event.pageX,
            top: e.event.pageY,
            padding: 0,
          },
          bodyStyle: {
            padding: 0,
            height: 1,
          },
          maskClosable: true,
          okButtonProps: {
            style: {
              display: 'none',
            },
          },
          content: (
            <Dropdown
              menu={{
                items: loadChatOperation(e.row?.data),
                onClick: () => {
                  modal.destroy();
                },
              }}
              trigger={['contextMenu']}
              open>
              <div style={{ width: 1 }}></div>
            </Dropdown>
          ),
        });
        e.items = [];
      }}>
      <Scrolling mode="virtual" />
      <Column
        width={250}
        dataField="name"
        caption="名称"
        cellRender={(e) => {
          return (
            <>
              <EntityIcon entity={e.data} showName size={20} />{' '}
              <Badge
                className="site-badge-count-109"
                count={e.data.chatdata.noReadCount}
                size="small"></Badge>
            </>
          );
        }}
      />
      <Column dataField="code" caption="代码" width={200} />
      <Column
        dataField="chatdata.labels"
        caption="标签"
        width={200}
        dataType={'datetime'}
        allowFiltering={false}
        cellRender={(e) => {
          return (
            <>
              {e.data.chatdata.labels
                .filter((i: any) => i.length > 0)
                .map((label: any) => {
                  return (
                    <Tag key={label} color={label === '置顶' ? 'red' : 'success'}>
                      {label}
                    </Tag>
                  );
                })}
            </>
          );
        }}
      />
      <Column
        dataField="metadata.updateTime"
        caption="最近时间"
        width={200}
        allowFiltering={false}
        cellRender={(e) => {
          return (
            <Text type="secondary">
              {e.data.chatdata.lastMessage
                ? showChatTime(e.data.chatdata.lastMessage?.createTime)
                : ''}
            </Text>
          );
        }}
        calculateDisplayValue={(e: IFileInfo<schema.XEntity>) => {
          return showChatTime(e.metadata.updateTime);
        }}
      />
      <Column
        width={250}
        dataField="remark"
        caption="描述"
        allowFiltering={false}
        cellRender={(e) => {
          return (
            <>
              {e.data.chatdata.mentionMe && (
                <span style={{ color: 'red' }}>[有人@我]</span>
              )}
              <span>{e.data.information}</span>
            </>
          );
        }}
      />
    </DataGrid>
  );
};
export default TableMode;
