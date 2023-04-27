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
  title: '单位资产情况',
  bcakImg: '',
  backgroundColor: '',
  list: [
    { title: '可用资产数量', value: '101个' },
    { title: '组织资产总数', value: '10050个' },
    { title: '资产总产值', value: '10001亿' },
    { title: '资产折旧总值', value: '5000万' },
    { title: '当月核销数量', value: '80个' },
    // { title: '企业专利总数', value: '100个' },
  ],
};
const demo2 = {
  title: '资产使用概况',
  list: [
    {
      subtitle: '单位使用信息',
      icon: '',
      list: [
        { title: '未使用数量', value: '100个' },
        { title: '在用数量', value: '777个' },
        { title: '采购申请数量', value: '999个' },
      ],
    },
    {
      subtitle: '核销处置',
      icon: '',
      list: [
        { title: '待处理数量', value: '66个' },
        { title: '已处理', value: '88个' },
        { title: '待处理总值', value: '10000万' },
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
