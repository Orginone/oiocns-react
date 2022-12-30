import React from 'react';
import { Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import cls from './index.module.less';
import DonationBill from './componments/Bill';

const items: ItemType[] = [
  {
    label: '公益仓',
    key: 'gyc',
    children: [
      {
        label: '草稿',
        key: 'cg',
      },
      {
        label: '已送审',
        key: 'yss',
      },
      {
        label: '已审核',
        key: 'ysh',
      },
      {
        label: '已捐赠',
        key: 'yjz',
      },
    ],
  },
];

/**
 * 捐赠方--待办
 */
const DonationerTodo: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {};

  return (
    <div className={cls.layout}>
      <Menu onClick={onClick} mode="inline" items={items} style={{ width: 256 }} />
      <DonationBill />
    </div>
  );
};

export default DonationerTodo;
