import { StatisticCard } from '@ant-design/pro-components';
import React from 'react';

import CardWidthTitle from '@/components/CardWidthTitle';

const { Divider } = StatisticCard;

const Charts: React.FC<any> = () => {
  return (
    <CardWidthTitle title="数据监测">
      <StatisticCard.Group direction={'row'}>
        <StatisticCard
          statistic={{
            title: '应用',
            value: 20190102,
            precision: 2,
            suffix: '个',
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
              alt="直方图"
              width="100%"
            />
          }
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '数据',
            value: 234,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
              alt="直方图"
              width="100%"
            />
          }
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '实体',
            value: 5,
            suffix: '/ 100',
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
              alt="直方图"
              width="100%"
            />
          }
        />
      </StatisticCard.Group>
    </CardWidthTitle>
  );
};
export default Charts;
