import { Card, Tabs } from 'antd';
import React from 'react';
import { ImUndo2 } from 'react-icons/im';
import ThingArchive from './Archive';
import ThingCard from './Card';
import { IForm } from '@/ts/core';

interface IThingViewProps {
  thingId: string;
  belongId: string;
  forms: IForm[];
  setTabKey?: (tabKey: number) => void;
}

/**
 * 物-查看
 * @returns
 */
const ThingView: React.FC<IThingViewProps> = (props) => {
  const getItems = () => {
    const items = [
      {
        key: '2',
        label: `归档痕迹`,
        children: <ThingArchive thingId={props.thingId} belongId={props.belongId} />,
      },
    ];
    if (props.forms.length > 0) {
      items.unshift({
        key: '1',
        label: `卡片信息`,
        children: (
          <ThingCard
            thingId={props.thingId}
            forms={props.forms}
            belongId={props.belongId}
          />
        ),
      });
    }
    return items;
  };
  return (
    <Card>
      <Tabs
        items={getItems()}
        tabBarExtraContent={
          <div
            style={{ display: 'flex', cursor: 'pointer' }}
            onClick={() => {
              props.setTabKey?.apply(this, [0]);
            }}>
            <a style={{ paddingTop: '2px' }}>
              <ImUndo2 />
            </a>
            <a style={{ paddingLeft: '6px' }}>返回</a>
          </div>
        }></Tabs>
    </Card>
  );
};

export default ThingView;
