import React, { useState } from 'react';
import { Tabs } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { DesignSpecies } from '.';
import SpeciesTable from './SpeciesTable';

type SpeciesTabsProps = {
  dsps: DesignSpecies[];
  deleteSpecies: (id: string) => void;
  setOpenSpeciesModal: (show: boolean) => void;
};

/**
 * 子表Tabs
 */
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
      />
    </div>
  );
};

export default SpeciesTabs;
