import React, { useState } from 'react';
import css from './less/table.module.less';
import { IDEntity, ISysFileInfo } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import { formatSize } from '@/ts/base/common';
import DataGrid, { Column } from 'devextreme-react/data-grid';
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
  const dataRowRender = (e: { data: IDEntity | ISysFileInfo }) => {
    const sizeText = 'filedata' in e.data ? formatSize(e.data.filedata.size) : '';
    return (
      <React.Fragment>
        <tr onContextMenu={() => setCxtItem(e.data)}>
          <td style={{ padding: 12, width: 60 }} rowSpan={2}>
            <Badge count={e.data.badgeCount} size="small">
              <EntityIcon entity={e.data.metadata} size={40} />
            </Badge>
          </td>
          <td>{e.data.name}</td>
          <td>{e.data.code}</td>
          <td>{e.data.typeName}</td>
          <td>{showChatTime(e.data.metadata.createTime)}</td>
          <td>{showChatTime(e.data.updateTime)}</td>
          <td>{sizeText}</td>
        </tr>
        <tr className={css.remarkRow} onContextMenu={() => setCxtItem(e.data)}>
          <td colSpan={6}>
            <div style={{ color: '#999' }}>{e.data.remark}</div>
          </td>
        </tr>
      </React.Fragment>
    );
  };
  return (
    <Dropdown menu={contextMenu(cxtItem)} trigger={['contextMenu']} destroyPopupOnHide>
      <div
        style={{ width: '100%', height: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}>
        <DataGrid<IDEntity, string>
          width="100%"
          height="100%"
          keyExpr="id"
          columnAutoWidth
          allowColumnResizing
          hoverStateEnabled
          style={{ overflow: 'hidden' }}
          scrolling={{ showScrollbar: 'onHover', mode: 'virtual' }}
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
            search: {
              enabled: true,
            },
          }}
          dataRowRender={dataRowRender}
          onContextMenuPreparing={(e) => setCxtItem(e.row?.data)}
          dataSource={content}>
          <Column width={80} dataField="id" caption="" allowFiltering={false} />
          <Column dataField="name" width={200} caption="名称" />
          <Column dataField="code" width={200} caption="代码" />
          <Column dataField="typeName" width={150} caption="类型" />
          <Column dataField="metadata.createTime" width={200} caption="创建时间" />
          <Column dataField="metadata.updateTime" width={200} caption="变更时间" />
          <Column dataField="size" width={100} caption="大小" allowFiltering={false} />
        </DataGrid>
      </div>
    </Dropdown>
  );
};
export default TableMode;
