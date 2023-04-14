import React, { useMemo } from 'react';
import TitleCard from '../ItemCard';
import cls from './index.module.less';
import { deepClone } from '@/ts/base/common';
import { HeatMapOutlined } from '@ant-design/icons';
interface indexType {
  info: {
    subtitle: string;
    icon?: any;
    list?: { title: string; value: string | number }[];
  };
}
const Index: React.FC<indexType> = ({ info }) => {
  const { subtitle, list } = info;
  const renderItem = useMemo(() => {
    if (!list) {
      return <></>;
    }
    const willPushCount = 3 - (list.length % 3);
    let showArr = deepClone(list);
    if (willPushCount !== 3) {
      for (let i = 0; i < willPushCount; i++) {
        showArr.push({ title: '', value: '' });
      }
    }

    return showArr.map((v) => {
      return <TitleCard key={v.title} info={v} />;
    });
  }, [info]);
  return (
    <div className={cls['subWrap']}>
      <div className={cls['sub-title']}>
        <HeatMapOutlined className={cls['sub-title-icon']} />
        {subtitle ?? '--'}
      </div>
      <div className={cls['sub-body']}>{renderItem}</div>
    </div>
  );
};

export default Index;
