import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import { EditableProTable } from '@ant-design/pro-components';
// import { Button } from 'antd';
// import { SelectOutlined } from '@ant-design/icons';
import { DesignSpecies } from '.';

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
        recursionOrg: true,
        recursionSpecies: true,
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
  deleteSpecies: (id: string) => void;
  setOpenSpeciesModal: (show: boolean) => void;
};

const SpeciesTabs: React.FC<SpeciesTabsProps> = ({
  dsps,
  deleteSpecies,
  setOpenSpeciesModal,
}) => {
  const items = dsps.map((dsp) => {
    return {
      key: dsp.speciesId,
      label: (
        <div style={{ paddingTop: '4px', paddingLeft: '12px', paddingRight: '4px' }}>
          {dsp.species.name}
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

  const add = () => {
    setOpenSpeciesModal(true);
  };

  const onEdit = (id: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      deleteSpecies(id);
    }
  };

  return (
    <div style={{ padding: '6px' }}>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={(key: any, action) => onEdit(key, action)}
        items={items}
        // tabBarExtraContent={<Button icon={<SelectOutlined />}>选择</Button>}
      />
    </div>
  );
};

export default SpeciesTabs;
