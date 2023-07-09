import React from 'react';
import { model } from '@/ts/base';
import { Dropdown } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { GenerateColumn } from './columns';
import { Column, DataGrid, IDataGridOptions } from 'devextreme-react/data-grid';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface IProps extends IDataGridOptions {
  fields: model.FieldModel[];
  hideColumns?: string[];
  dataMenus?: {
    items: ItemType[];
    onMenuClick: (key: string, data: any) => void;
  };
}

/** 使用form生成表单 */
const GenerateEntityTable = (props: IProps) => {
  return (
    <DataGrid<any, string>
      keyExpr="id"
      columnMinWidth={props.columnMinWidth ?? 80}
      focusedRowEnabled={true}
      allowColumnReordering={true}
      allowColumnResizing={true}
      columnAutoWidth={true}
      showColumnLines={true}
      showRowLines={true}
      rowAlternationEnabled={true}
      hoverStateEnabled={true}
      columnResizingMode={'widget'}
      headerFilter={{ visible: true }}
      filterRow={{ visible: true }}
      columnFixing={{ enabled: true }}
      scrolling={{
        showScrollbar: 'onHover',
        mode: 'standard',
      }}
      paging={{ pageSize: 20, enabled: true }}
      pager={{
        visible: true,
        showInfo: true,
        showNavigationButtons: true,
        allowedPageSizes: [10, 30, 40, 50, 200],
      }}
      searchPanel={{ width: 300, highlightCaseSensitive: true, visible: true }}
      width="100%"
      height={props.height ?? '100%'}
      showBorders={true}
      remoteOperations={{
        paging: true,
        sorting: false,
        filtering: false,
        grouping: false,
        groupPaging: false,
      }}
      {...props}>
      {props.fields.map((field) =>
        GenerateColumn(field, [], props.hideColumns, 'property'),
      )}
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

export default GenerateEntityTable;
