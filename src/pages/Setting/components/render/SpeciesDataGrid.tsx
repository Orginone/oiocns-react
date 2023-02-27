import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
  HeaderFilter,
  FilterRow,
} from 'devextreme-react/data-grid';
import { DesignSpecies } from './../design';
import useObjectUpdate from '@/hooks/useObjectUpdate';

export type Header = {
  id: string;
  title: string;
  children: Header[];
};

interface IProps {
  dsps: DesignSpecies[];
}
/**
 * 类别-数据表格子表
 */
const SpeciesDataGrid: React.FC<IProps> = ({ dsps }) => {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [tkey, tforceUpdate] = useObjectUpdate(dsps);

  useEffect(() => {
    const loadHeader = async () => {
      const headers: Header[] = [];
      for (const dsp of dsps) {
        const header: Header = {
          id: dsp.speciesId,
          title: dsp.species.name,
          children: [],
        };
        const res = await kernel.querySpeciesAttrs({
          id: dsp.speciesId,
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
    <Card bordered={false}>
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
        <ColumnChooser
          enabled={true}
          title={'列选择器'}
          height={'500px'}
          allowSearch={true}
          mode={'select'}
          sortOrder={'asc'}
        />
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
    </Card>
  );
};
export default SpeciesDataGrid;
