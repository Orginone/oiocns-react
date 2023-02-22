import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import { EditableProTable } from '@ant-design/pro-components';
import { DesignSpecies } from './../design';

type SpeciesTableProps = {
  sp: ISpeciesItem;
};

/**
 * 子表
 */
const SpeciesTable: React.FC<SpeciesTableProps> = ({ sp }) => {
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    const loadAttrs = async () => {
      const res = await kernel.querySpeciesAttrs({
        id: sp.id,
        spaceId: userCtrl.space.id,
        page: {
          offset: 0,
          limit: 10000,
          filter: '',
        },
      });
      const attrs = res.data?.result || [];
      setColumns(
        attrs.map((item: XAttribute) => {
          return {
            title: item.name,
            dataIndex: item.code,
            key: item.code,
            width:
              item.name.length <= 2
                ? 60
                : item.name.length > 12
                ? item.name.length * 12
                : item.name.length * 20,
          };
        }),
      );
    };
    loadAttrs();
  }, []);
  return (
    <EditableProTable
      columns={columns}
      recordCreatorProps={false}
      scroll={{
        x: 1100,
      }}
      editable={{
        type: 'multiple',
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
    />
  );
};

type SpeciesTabsProps = {
  dsps: DesignSpecies[];
};

const SpeciesTables: React.FC<SpeciesTabsProps> = ({ dsps }) => {
  const items = dsps.map((dsp) => {
    return {
      key: dsp.speciesId,
      label: (
        <div style={{ paddingTop: '4px', paddingLeft: '12px', paddingRight: '4px' }}>
          {dsp.species?.name}
        </div>
      ),
      closable: dsp.belongId == userCtrl.space.id,
      children: <SpeciesTable sp={dsp.species} />,
    };
  });

  const [activeKey, setActiveKey] = useState<any>();

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  return (
    <div style={{ padding: '6px' }}>
      <Tabs onChange={onChange} activeKey={activeKey} items={items} />
    </div>
  );
};

export default SpeciesTables;
