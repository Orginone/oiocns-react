import { deepClone } from '@/ts/base/common';
import React, { useMemo } from 'react';
import TitleCard from '../components/ItemCard';
import SubCard from '../components/SubCard';
import cls from './index.module.less';
interface CardItemType {
  title?: string;
  value?: string | number;
  type?: 'sub';
  subtitle?: string;
  icon?: '';
  list: { title: string; value: string | number }[];
}
interface indexType {
  className?: string;
  dataSource: CardItemType;
}

const demo = {
  title: '企业情况',
  bcakImg: '',
  backgroundColor: '',
  list: [
    { title: '企业数量', value: '101个' },
    { title: '入驻企业员工总数', value: '10050个' },
    { title: '企业总产值', value: '10001亿' },
    { title: '企业总税收', value: '5000万' },
    { title: '高级人才数', value: '80个' },
    // { title: '企业专利总数', value: '100个' },
  ],
};
const demo2 = {
  title: '园区概况',
  list: [
    {
      subtitle: '博览中心',
      icon: '',
      list: [
        { title: '园区数量', value: '100个' },
        { title: '入驻园区员工总数2', value: '777个' },
        { title: '园区总产值2', value: '999个' },
      ],
    },
    {
      subtitle: '数据可视化',
      icon: '',
      list: [
        { title: '展示数量', value: '66个' },
        { title: '展示员工总数', value: '88个' },
        { title: '展示总产值', value: '10000个' },
      ],
    },
  ],
};

const Index: React.FC<indexType> = ({ className, dataSource }) => {
  const { type = '' } = dataSource || {};
  const demoData = type === 'sub' ? demo2 : demo;
  if (!dataSource) {
    return <></>;
  }
  const renderItem = useMemo(() => {
    const list = demoData.list;
    if (!list) {
      return <></>;
    }
    const willPushCount = 3 - (list.length % 3);
    let showArr: any[] = deepClone(list);
    if (willPushCount > 0) {
      for (let i = 0; i < willPushCount; i++) {
        showArr.push({ title: '', subtitle: '', value: '' });
      }
    }

    return showArr.map((v: any, index: number) => {
      if (v?.subtitle) {
        return <SubCard key={v.subtitle + index} info={v} />;
      }
      return <TitleCard key={index} info={v} />;
    });
  }, [demoData]);
  return (
    <div className={`${cls['cockpit-wrap']} ${className}`}>
      <h3 className={cls['cockpit-title']}>{demoData.title}</h3>
      <div className={cls['cockpit-body']}>{renderItem}</div>
    </div>
  );
};

export default Index;
