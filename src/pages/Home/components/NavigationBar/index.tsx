import React, { useState } from 'react';

import cls from './index.module.less';
import { EllipsisOutlined } from '@ant-design/icons';

const navigationList = [
  {
    key: 'activity',
    label: '群动态',
  },
  {
    key: 'circle',
    label: '好友圈',
  },
  {
    key: 'warehouse',
    label: '公物仓',
  },
];

const NavigationBar: React.FC = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className={cls.navigationBar}>
      <div className={cls.navigationBarContent}>
        {navigationList.map((item, index) => {
          return (
            <div
              key={item.key}
              className={
                current === index
                  ? cls.navigationBarContent__itemActive
                  : cls.navigationBarContent__item
              }
              onClick={() => {
                setCurrent(index);
              }}>
              {item.label}
            </div>
          );
        })}
      </div>
      <EllipsisOutlined className={cls.navigationBarMore} />
    </div>
  );
};

export default NavigationBar;
