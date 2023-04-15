import React, { useState } from 'react';
import { Tabs } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { XOperationItem } from '@/ts/base/schema';
import SpeciesDataGrid from './SpeciesDataGrid';

/**
 * 多子表
 */
type SpeciesTabsProps = {
  operationItems: XOperationItem[];
};

const SpeciesTabs: React.FC<SpeciesTabsProps> = ({ operationItems }) => {
  const items = operationItems.map((item) => {
    return {
      key: item.id,
      label: <div style={{ paddingLeft: '12px', paddingRight: '4px' }}>{item.name}</div>,
      closable: item.belongId == userCtrl.space.id,
      children: (
        <SpeciesDataGrid
          speciesArray={(item.containSpecies || []).sort((a: any, b: any) => a.id - b.id)}
        />
      ),
    };
  });

  const [activeKey, setActiveKey] = useState<any>();

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  return <Tabs onChange={onChange} activeKey={activeKey} items={items} />;
};

export default SpeciesTabs;
