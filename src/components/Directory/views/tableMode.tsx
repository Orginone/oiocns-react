import React, { useState } from 'react';
import { IFileInfo, ISysFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import { formatSize } from '@/ts/base/common';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { Dropdown, MenuProps } from 'antd';

const TableMode = ({
  select,
  content,
  fileOpen,
  contextMenu,
}: {
  select: IFileInfo<schema.XEntity> | undefined;
  content: IFileInfo<schema.XEntity>[];
  fileOpen: (
    file: IFileInfo<schema.XEntity> | undefined,
    dblclick: boolean,
  ) => Promise<void>;
  contextMenu: (file?: IFileInfo<schema.XEntity>, clicked?: Function) => MenuProps;
}) => {
  const [cxtItem, setCxtItem] = useState<IFileInfo<schema.XEntity>>();
  return (
    <Dropdown menu={contextMenu(cxtItem)} trigger={['contextMenu']} destroyPopupOnHide>
      <div
        style={{ width: '100%', height: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}>
        <DataGrid<IFileInfo<schema.XEntity>, string>
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
          onRowClick={async (e) => {
            await fileOpen(e.data, false);
          }}
          onRowDblClick={async (e) => {
            await fileOpen(e.data, true);
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
              return <EntityIcon entity={e.data.metadata} showName size={20} />;
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
            calculateDisplayValue={(e: IFileInfo<schema.XEntity>) => {
              return showChatTime(e.metadata.createTime);
            }}
          />
          <Column
            dataField="metadata.updateTime"
            caption="更新时间"
            width={200}
            allowFiltering={false}
            calculateDisplayValue={(e: IFileInfo<schema.XEntity>) => {
              return showChatTime(e.metadata.updateTime);
            }}
          />
          <Column
            width={100}
            dataField="size"
            caption="大小"
            allowFiltering={false}
            calculateCellValue={(e: IFileInfo<schema.XEntity>) => {
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
