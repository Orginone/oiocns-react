import React, { useState } from 'react';

import cls from './index.module.less';
import { AiOutlineEllipsis } from '@/icons/ai';
import { NavigationItem } from '@/pages/Home';

const NavigationBar: React.FC<{
  list: NavigationItem[];
  onChange: (item: NavigationItem) => void;
}> = (props) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className={cls.navigationBar}>
      <div className={cls.navigationBarContent}>
        {props.list.map((item, index) => {
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
                props.onChange(item);
              }}>
              {item.label}
            </div>
          );
        })}
      </div>
      <AiOutlineEllipsis className={cls.navigationBarMore} />
    </div>
  );
};

export default NavigationBar;
