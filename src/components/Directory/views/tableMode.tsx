import React from 'react';
import { IFileInfo, ISysFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import { formatSize } from '@/ts/base/common';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { Dropdown, MenuProps, Modal } from 'antd';

const TableMode = ({
  content,
  fileOpen,
  contextMenu,
}: {
  content: IFileInfo<schema.XEntity>[];
  fileOpen: (file: IFileInfo<schema.XEntity>) => Promise<void>;
  contextMenu: (file?: IFileInfo<schema.XEntity>, clicked?: Function) => MenuProps;
}) => {
  return (
    <Dropdown menu={contextMenu()} trigger={['contextMenu']} destroyPopupOnHide>
      <div style={{ width: '100%', height: '100%' }}>
        <DataGrid<IFileInfo<schema.XEntity>, string>
          id="grid"
          width="100%"
          height="100%"
          keyExpr="id"
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
            await fileOpen(e.data);
          }}
          headerFilter={{
            visible: true,
            allowSearch: true,
          }}
          dataSource={content}
          onContextMenuPreparing={(e: any) => {
            if (e.row?.data) {
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
                    menu={contextMenu(e.row.data, () => {
                      modal.destroy();
                    })}
                    open>
                    <div style={{ width: 1 }}></div>
                  </Dropdown>
                ),
              });
              e.items = [];
            }
          }}>
          <Scrolling mode="virtual" />
          <Column
            width={250}
            dataField="name"
            caption="名称"
            cellRender={(e) => {
              return <EntityIcon entity={e.data} showName size={20} />;
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
