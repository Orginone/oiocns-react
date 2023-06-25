import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { schema } from '@/ts/base';
import { Dropdown } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { ColumnGenerateProps, GenerateColumn } from './columns';
import { Column, DataGrid, IDataGridOptions } from 'devextreme-react/data-grid';
import { ThingColumns } from '@/config/column';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface IProps extends IDataGridOptions {
  form: schema.XForm;
  autoColumn?: boolean;
  dataIndex?: 'attribute' | 'property';
  hideColumns?: string[];
  dataMenus?: {
    items: ItemType[];
    onMenuClick: (key: string, data: any) => void;
  };
}

const loadFormColumns = async (props: IProps) => {
  const newColumnProps: ColumnGenerateProps[] = [];
  if (props.autoColumn) {
    newColumnProps.push(...ThingColumns(props.hideColumns));
  }
  const attributes =
    props.form.attributes?.filter(
      (attr) => attr.linkPropertys && attr.linkPropertys.length > 0,
    ) || [];
  for (const attr of attributes) {
    const property = attr.linkPropertys![0];
    const datasource: any[] = [];
    if (property.speciesId && property.speciesId.length > 0) {
      const items = await orgCtrl.work.loadItems(property.speciesId);
      items?.forEach((i) => {
        datasource.push({
          text: i.name,
          value: i.id,
        });
      });
    }
    newColumnProps.push({
      id: attr.id,
      name: attr.name,
      remark: attr.remark,
      lookupSource: datasource,
      valueType: property.valueType,
      visible: !props.hideColumns?.includes(attr.id),
      dataField: props.dataIndex === 'attribute' ? attr.id : property.code,
    });
  }
  return newColumnProps;
};

/** 使用form生成表单 */
const GenerateTable = (props: IProps) => {
  const [columnProps, setColumnProps] = useState<ColumnGenerateProps[]>([]);
  useEffect(() => {
    loadFormColumns(props).then((value) => {
      setColumnProps(value);
    });
  }, []);
  return (
    <DataGrid<any, string>
      keyExpr="Id"
      key={props.form.id}
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
      scrolling={{ showScrollbar: 'always', useNative: false }}
      searchPanel={{ width: 300, highlightCaseSensitive: true, visible: true }}
      width="100%"
      height={props.height ?? '100%'}
      showBorders={true}
      {...props}
      onSelectionChanged={(e) => {
        const info = { ...e };
        info.selectedRowsData = e.selectedRowsData.map((data) => {
          const newData: any = {};
          columnProps.forEach((c) => {
            if (data[c.dataField]) {
              newData[c.id] = data[c.dataField];
            }
          });
          return newData;
        });
        props.onSelectionChanged?.apply(this, [info]);
      }}>
      {columnProps.map((item) => GenerateColumn(item))}
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

export default GenerateTable;
