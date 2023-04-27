import { deepClone } from '@/ts/base/common';
import React, { useMemo } from 'react';
import TitleCard from '../components/ItemCard';
import cls from './index.module.less';

interface indexType {
  className?: string;
}
const demo = {
  title: '企业情况',
  list: [
    { title: '企业数量', value: '100个' },
    { title: '入驻企业员工总数', value: '100个' },
    { title: '企业总产值', value: '100个' },
    { title: '企业总税收', value: '100个' },
    { title: '高级人才数', value: '100个' },
    // { title: '企业专利总数', value: '100个' },
  ],
};

const Index: React.FC<indexType> = ({ className }) => {
  const renderItem = useMemo(() => {
    if (!demo.list) {
      return <></>;
    }
    const willPushCount = 3 - (demo.list.length % 3);
    let showArr = deepClone(demo.list);
    if (willPushCount > 0) {
      for (let i = 0; i < willPushCount; i++) {
        showArr.push({ title: '', value: '' });
      }
    }

    return showArr.map((v) => {
      return <TitleCard key={v.title} info={v} />;
    });
  }, [demo]);
  return (
    <div className={`${cls['cockpit-wrap']} ${className}`}>
      <h3 className={cls['cockpit-title']}>{demo.title}</h3>
      <div className={cls['cockpit-body']}>{renderItem}</div>
    </div>
  );
};

export default Index;
