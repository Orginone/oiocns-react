import { Card, Tabs, TabsProps } from 'antd';
import React from 'react';
import { ImUndo2 } from 'react-icons/im';
import ThingArchive from './Archive';
import ThingCard from './Card';

interface IThingViewProps {
  thingId: string;
  setTabKey?: (tabKey: number) => void;
}

/**
 * 物-查看
 * @returns
 */
const ThingView: React.FC<IThingViewProps> = ({ thingId, setTabKey }) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `资产卡片`,
      children: <ThingCard thingId={thingId} />,
    },
    {
      key: '2',
      label: `归档痕迹`,
      children: <ThingArchive thingId={thingId} />,
    },
  ];

  const tabBarExtraContent = (
    <div
      style={{ display: 'flex', cursor: 'pointer' }}
      onClick={() => {
        if (setTabKey) {
          setTabKey(0);
        }
      }}>
      <a style={{ paddingTop: '2px' }}>
        <ImUndo2 />
      </a>
      <a style={{ paddingLeft: '6px' }}>返回</a>
    </div>
  );

  return (
    <Card>
      <Tabs items={items} tabBarExtraContent={tabBarExtraContent}></Tabs>
    </Card>
  );
};

export default ThingView;
