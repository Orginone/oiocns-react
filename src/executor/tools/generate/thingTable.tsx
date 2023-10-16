import React from 'react';
import { model, schema } from '@/ts/base';
import { Dropdown } from 'antd';
import { AiOutlineEllipsis } from '@/icons/ai';
import { GenerateColumn } from './columns';
import { Column, DataGrid, IDataGridOptions } from 'devextreme-react/data-grid';
import { FullThingColumns } from '@/config/column';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface IProps extends IDataGridOptions {
  beforeSource?: schema.XThing[];
  fields: model.FieldModel[];
  dataIndex?: 'attribute' | 'property';
  dataMenus?: {
    items: ItemType[];
    onMenuClick: (key: string, data: any) => void;
  };
}

/** 使用form生成表单 */
const GenerateThingTable = (props: IProps) => {
  const fields = FullThingColumns(props.fields);
  return (
    <DataGrid<schema.XThing, string>
      keyExpr="id"
      width="100%"
      height={props.height ?? '100%'}
      columnMinWidth={props.columnMinWidth ?? 80}
      focusedRowEnabled
      allowColumnReordering
      allowColumnResizing
      columnAutoWidth
      showColumnLines
      showRowLines
      rowAlternationEnabled
      hoverStateEnabled
      columnResizingMode={'widget'}
      headerFilter={{ visible: true }}
      filterRow={{ visible: true }}
      columnFixing={{ enabled: true }}
      scrolling={{
        showScrollbar: 'onHover',
        mode: 'standard',
      }}
      columnChooser={{
        enabled: true,
        allowSearch: true,
        mode: 'select',
        height: 500,
      }}
      paging={{ pageSize: 20, enabled: true }}
      pager={{
        visible: true,
        showInfo: true,
        showNavigationButtons: true,
        allowedPageSizes: [10, 30, 40, 50, 200],
      }}
      searchPanel={{ width: 300, highlightCaseSensitive: true, visible: true }}
      showBorders={true}
      {...props}
      onSelectionChanged={(e) => {
        const info = { ...e };
        info.selectedRowsData = e.selectedRowsData.map((data) => {
          const newData: any = {};
          fields.forEach((c) => {
            if (props.dataIndex === 'attribute') {
              if (data[c.id]) {
                newData[c.id] = data[c.id];
              }
            } else {
              if (data[c.code]) {
                newData[c.id] = data[c.code];
              }
            }
          });
          return newData;
        });
        props.onSelectionChanged?.apply(this, [info]);
      }}>
      {fields.map((field) => GenerateColumn(field, props.beforeSource, props.dataIndex))}
      {props.dataMenus && (
        <Column
          dataField="操作"
          type={'buttons'}
          width={30}
          cellRender={(row) => {
            return (
              <Dropdown
                menu={{
                  items: props.dataMenus?.items,
                  onClick: (info) => props.dataMenus?.onMenuClick(info.key, row.data),
                }}
                placement="bottom">
                <div style={{ cursor: 'pointer', width: '50px' }}>
                  <AiOutlineEllipsis fontSize={18} rotate={90} />
                </div>
              </Dropdown>
            );
          }}></Column>
      )}
    </DataGrid>
  );
};

export default GenerateThingTable;
