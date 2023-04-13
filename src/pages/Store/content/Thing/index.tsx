import React, { useEffect, useState } from 'react';
import Thing from './Thing';
import ThingView from './View';
import { ISpeciesItem } from '@/ts/core';

interface IProps {
  species: ISpeciesItem;
  selectable: boolean;
  checkedList?: any[];
}
/**
 * 仓库-物
 */
const ThingIndex: React.FC<IProps> = ({ species, selectable, checkedList }) => {
  const [tabKey, setTabKey] = useState(0);
  const [thingId, setThingId] = useState<string>('');
  useEffect(() => {
    setTabKey(0);
  }, [species]);

  switch (tabKey) {
    case 0:
      return (
        <Thing
          current={species}
          checkedList={checkedList || []}
          selectable={selectable}
          setTabKey={setTabKey}
          setThingId={setThingId}
          menuItems={[
            {
              key: 'listStore',
              label: '上架商店',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'nft',
              label: '生成NFT',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'assign',
              label: '分配',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'share',
              label: '共享',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'handle',
              label: '处置',
              click(data) {
                console.log(data);
              },
            },
          ]}
          toolBarItems={[]}
        />
      );
    case 1:
      return <ThingView thingId={thingId} setTabKey={setTabKey} />;
    default:
      return <></>;
  }
};
export default ThingIndex;
