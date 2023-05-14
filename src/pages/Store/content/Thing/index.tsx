import React, { useState } from 'react';
import Thing from './Thing';
import ThingView from './View';
import { XProperty } from '@/ts/base/schema';
import { IForm } from '@/ts/core';

interface IProps {
  labels: string[];
  forms: IForm[];
  propertys: XProperty[];
  belongId: string;
  selectable?: boolean;
}
/**
 * 存储-物
 */
const ThingIndex: React.FC<IProps> = (props) => {
  const [tabKey, setTabKey] = useState(0);
  const [thingId, setThingId] = useState<string>('');

  switch (tabKey) {
    case 0:
      return (
        <Thing
          labels={props.labels}
          propertys={props.propertys}
          belongId={props.belongId}
          selectable={props.selectable}
          onBack={() => setTabKey(1)}
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
      return (
        <ThingView
          thingId={thingId}
          setTabKey={setTabKey}
          belongId={props.belongId}
          forms={props.forms}
        />
      );
    default:
      return <></>;
  }
};
export default ThingIndex;
