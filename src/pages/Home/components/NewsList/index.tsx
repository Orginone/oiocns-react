import React from 'react';
import cls from './index.module.less';
import { Typography } from 'antd';
import BaseTitle from '@/pages/Home/components/BaseTitle';

const list = [
  '《浙江XXXXXXXXXXXXXXXXXXXXXXXXXXXXX管理规范》简介',
  '《浙江XXXXXXXXXXXXXXXXXXXXXXXXXXXXX管理规范》简介',
  '《浙江XXXXXXXXXXXXXXXXXXXXXXXXXXXXX管理规范》简介',
  '《浙江XXXXXXXXXXXXXXXXXXXXXXXXXXXXX管理规范》简介',
];

const NewsList: React.FC = () => {
  return (
    <div className={cls.newsList}>
      <BaseTitle title="新闻列表" more="more" />
      <div className={cls.content}>
        {list.map((item, index) => {
          return <Typography.Text key={index}>{item}</Typography.Text>;
        })}
      </div>
    </div>
  );
};

export default NewsList;
