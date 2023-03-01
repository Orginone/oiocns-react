import React, { useState } from 'react';
import { Tabs } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { XOperationItem } from '@/ts/base/schema';
import SpeciesDataGrid from './SpeciesDataGrid';

type SpeciesTabsProps = {
  operationItems: XOperationItem[];
  setSelectedItem: (item: XOperationItem) => void;
  deleteOperationItem: (id: string) => void;
  setOpenSpeciesModal: (show: boolean) => void;
};

/**
 * 子表Tabs
 */
const SpeciesTabs: React.FC<SpeciesTabsProps> = ({
  operationItems,
  deleteOperationItem,
  setOpenSpeciesModal,
}) => {
  const items = operationItems.map((item) => {
    return {
      key: item.code,
      label: (
        <div style={{ paddingTop: '4px', paddingLeft: '12px', paddingRight: '4px' }}>
          {item.name}
        </div>
      ),
      closable: item.belongId == userCtrl.space.id,
      children: <SpeciesDataGrid speciesArray={item.containSpecies || []} />,
    };
  });

  const [activeKey, setActiveKey] = useState<any>();

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    setOpenSpeciesModal(true);
  };

  const onEdit = (key: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      deleteOperationItem(key);
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
