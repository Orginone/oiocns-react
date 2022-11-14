import { StatisticCard } from '@ant-design/pro-components';
import React from 'react';

import CardWidthTitle from '@/components/CardWidthTitle';

const { Divider } = StatisticCard;

const Charts: React.FC<any> = () => {
  return (
    <CardWidthTitle title="数据检测">
      <StatisticCard.Group direction={'row'}>
        <StatisticCard
          statistic={{
            title: '冻结金额',
            value: 20190102,
            precision: 2,
            suffix: '元',
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
            title: '设计资源数',
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
            title: '信息完成度',
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
