import React, { useState } from 'react';
import { IFile, ISession } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { Badge, Dropdown, Tag, Typography } from 'antd';
import { loadChatOperation } from './common';
const { Text } = Typography;

const TableMode = ({
  chats,
  select,
  sessionOpen,
}: {
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}) => {
  const [cxtItem, setCxtItem] = useState<ISession>();
  return (
    <Dropdown
      menu={{ items: loadChatOperation(cxtItem) }}
      trigger={['contextMenu']}
      destroyPopupOnHide>
      <div
        style={{ width: '100%', height: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}>
        <DataGrid<ISession, string>
          id="grid"
          width="100%"
          height="100%"
          keyExpr="id"
          columnAutoWidth
          allowColumnResizing
          hoverStateEnabled
          selectedRowKeys={select ? [select.id] : []}
          selection={{ mode: 'single' }}
          columnResizingMode={'nextColumn'}
          showColumnLines={false}
          onRowClick={(e) => {
            sessionOpen(e.data, false);
          }}
          onRowDblClick={(e) => {
            sessionOpen(e.data, true);
          }}
          headerFilter={{
            visible: true,
            allowSearch: true,
          }}
          onContextMenuPreparing={(e) => setCxtItem(e.row?.data)}
          dataSource={chats}>
          <Scrolling mode="virtual" />
          <Column
            width={250}
            dataField="name"
            caption="名称"
            cellRender={(e) => {
              return (
                <>
                  <EntityIcon entity={e.data.metadata} showName size={20} />{' '}
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
            calculateDisplayValue={(e: IFile) => {
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
      </div>
    </Dropdown>
  );
};
export default TableMode;
