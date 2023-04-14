import React from 'react';

import cls from './index.module.less';

interface indexType {
  info: { title: string; value: string | number };
}
const Index: React.FC<indexType> = ({ info }) => {
  if (!info?.title) {
    return <div className={`${cls['base-card']} ${cls['empty']} `}></div>;
  }

  return (
    <div className={cls['base-card']}>
      <div className={cls['border_corner']}>
        <span className={cls['base-card-title']}>{info?.title ?? '--'}</span>
        <span className={cls['base-card-value']}>{info?.value ?? '--'}</span>
      </div>
    </div>
  );
};

export default Index;
