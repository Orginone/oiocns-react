import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, {
  Column,
  ColumnFixing,
  HeaderFilter,
  FilterRow,
} from 'devextreme-react/data-grid';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XSpecies } from '@/ts/base/schema';

export type Header = {
  id: string;
  title: string;
  children: Header[];
};

interface IProps {
  speciesArray: XSpecies[];
}
/**
 * 类别-数据表格子表
 */
const SpeciesDataGrid: React.FC<IProps> = ({ speciesArray }) => {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [tkey, tforceUpdate] = useObjectUpdate(speciesArray);

  useEffect(() => {
    const loadHeader = async () => {
      const headers: Header[] = [];
      for (const species of speciesArray) {
        const header: Header = {
          id: species.id,
          title: species.name,
          children: [],
        };
        const res = await kernel.querySpeciesAttrs({
          id: species.id,
          spaceId: userCtrl.space.id,
          recursionOrg: true,
          recursionSpecies: false,
          page: {
            offset: 0,
            limit: 10000,
            filter: '',
          },
        });
        const childern: Header[] = (res.data.result || []).map((attr) => {
          return { id: attr.id, title: attr.name, children: [] };
        });
        header.children = childern;
        headers.push(header);
      }
      setHeaders(headers);
      tforceUpdate();
    };
    loadHeader();
  }, []);

  return (
    <DataGrid
      key={tkey}
      dataSource={[]}
      keyExpr="key"
      columnMinWidth={80}
      focusedRowEnabled={true}
      allowColumnReordering={true}
      allowColumnResizing={true}
      columnAutoWidth={true}
      showColumnLines={true}
      showRowLines={true}
      rowAlternationEnabled={true}
      hoverStateEnabled={true}
      height={'400px'}
      showBorders={true}>
      {/* <ColumnChooser
          enabled={true}
          title={'列选择器'}
          height={'500px'}
          allowSearch={true}
          mode={'select'}
          sortOrder={'asc'}
        /> */}
      <ColumnFixing enabled={true} />
      <HeaderFilter visible={true} />
      <FilterRow visible={true} />
      {headers.map((header) => (
        <Column key={header.id} caption={header.title}>
          {header.children.map((h) => (
            <Column key={h.id} dataField={h.id} caption={h.title}></Column>
          ))}
        </Column>
      ))}
    </DataGrid>
  );
};
export default SpeciesDataGrid;
