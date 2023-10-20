import React, { useState } from 'react';
import { IDEntity, ISysFileInfo } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import { formatSize } from '@/ts/base/common';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { Badge, Dropdown, MenuProps } from 'antd';

const TableMode = ({
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
  contextMenu: (file?: IDEntity, clicked?: Function) => MenuProps;
}) => {
  const [cxtItem, setCxtItem] = useState<IDEntity>();
  if (focusFile) {
    selectFiles.push(focusFile);
  }
  return (
    <Dropdown menu={contextMenu(cxtItem)} trigger={['contextMenu']} destroyPopupOnHide>
      <div
        style={{ width: '100%', height: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}>
        <DataGrid<IDEntity, string>
          id="grid"
          width="100%"
          height="100%"
          keyExpr="id"
          columnAutoWidth
          allowColumnResizing
          hoverStateEnabled
          selectedRowKeys={selectFiles.map((i) => i.id)}
          selection={{ mode: 'single' }}
          columnResizingMode={'nextColumn'}
          showColumnLines={false}
          onRowClick={(e) => {
            fileOpen(e.data, false);
          }}
          onRowDblClick={(e) => {
            fileOpen(e.data, true);
          }}
          headerFilter={{
            visible: true,
            allowSearch: true,
          }}
          onContextMenuPreparing={(e) => setCxtItem(e.row?.data)}
          dataSource={content}>
          <Scrolling mode="virtual" />
          <Column
            width={250}
            dataField="name"
            caption="名称"
            cellRender={(e) => {
              return (
                <Badge count={e.data.badgeCount} size="small">
                  <EntityIcon entity={e.data.metadata} showName size={20} />
                </Badge>
              );
            }}
          />
          <Column dataField="code" caption="代码" width={200} />
          <Column dataField="typeName" caption="类型" width={200} />
          <Column
            dataField="metadata.createTime"
            caption="创建时间"
            width={200}
            dataType={'datetime'}
            allowFiltering={false}
            calculateDisplayValue={(e: IDEntity) => {
              return showChatTime(e.metadata.createTime);
            }}
          />
          <Column
            dataField="metadata.updateTime"
            caption="更新时间"
            width={200}
            allowFiltering={false}
            calculateDisplayValue={(e: IDEntity) => {
              return showChatTime(e.updateTime);
            }}
          />
          <Column
            width={100}
            dataField="size"
            caption="大小"
            allowFiltering={false}
            calculateCellValue={(e: IDEntity) => {
              if ('filedata' in e) {
                return formatSize((e as ISysFileInfo).filedata.size);
              }
              return '';
            }}
          />
          <Column width={250} dataField="remark" caption="描述" allowFiltering={false} />
        </DataGrid>
      </div>
    </Dropdown>
  );
};
export default TableMode;
