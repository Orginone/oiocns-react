import { Card, Tabs } from 'antd';
import React from 'react';
import { ImUndo2 } from 'react-icons/im';
import ThingArchive from './archive';
import { schema } from '@/ts/base';

interface IProps {
  archives: schema.XWorkInstance[];
  onBack: () => void;
}

/**
 * 物-查看
 * @returns
 */
const ThingView: React.FC<IProps> = (props) => {
  const getItems = () => {
    const items = [
      {
        key: '1',
        label: `卡片信息`,
        children: <></>,
      },
      {
        key: '2',
        label: `归档痕迹`,
        children: <ThingArchive instances={props.archives} />,
      },
    ];
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
              props.onBack();
            }}>
            <a style={{ paddingTop: '2px' }}>
              <ImUndo2 />
            </a>
            <a style={{ paddingLeft: '6px' }}>返回</a>
          </div>
        }
      />
    </Card>
  );
};

export default ThingView;
