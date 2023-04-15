import { Card, Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import WorkStartRecord from './WorkStartRecord';
import WorkStartEntry from './WorkStartEntry';

// 卡片渲染
interface IProps {
  selectMenu: MenuItemType;
}
/**
 * 办事-业务流程发起
 * @returns
 */
const Work: React.FC<IProps> = ({ selectMenu }) => {
  const [activeKey, setActiveKey] = useState('1');
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `发起事项`,
      children: <WorkStartEntry selectMenu={selectMenu} />,
    },
    {
      key: '2',
      label: `已发起`,
      children: <WorkStartRecord selectMenu={selectMenu} />,
    },
  ];

  useEffect(() => {
    setActiveKey('1');
  }, [selectMenu]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <Card>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </Card>
  );
};

export default Work;
