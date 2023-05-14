import { StatisticCard } from '@ant-design/pro-components';
import React from 'react';
import './index.less';
import CardWidthTitlemid from '@/components/CardWidthTitlemid';
import EchartsCom from '../Echarts'

const { Divider } = StatisticCard;
//TODO: 图表传参数据
let SeriesType: any = {
  type: 'bar',
  data: [5, 10, 20, 40],
  name: 'sales',
};
let FooterTitleType: any = 123;
let GridType: any = {}
let legendType: any = {
  x: 'right',
  data: [177, 144, 141, 411, 4141, 414, 54125],// 图例数据源
  orient: 'vertical', //图例列表的布局朝向
  top: 'bottom',
}

const Charts: React.FC<any> = () => {
  return (
    <CardWidthTitlemid  title="数据监测" title2='浙江省国有资产概况'>
      <StatisticCard.Group direction={'row'}>
        <StatisticCard
          statistic={{
            value: '单位:亿元',
          }}
          chart={
            <EchartsCom id={'a'} SeriesType={SeriesType} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'category'} legendType={legendType}  yNameType={""}/>
          }
          
        />
        <div className='home-position'>行政事业性国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            value: '单位:亿元',
          }}
          chart={
            <EchartsCom id={'aa'} SeriesType={SeriesType} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'category'} legendType={legendType}  yNameType={""}/>
          }
        />
        <div className='home-position'>企业国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            value: '单位:亿元',
          }}
          chart={
            <EchartsCom id={'aaa'} SeriesType={SeriesType} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'category'} legendType={legendType}  yNameType={""}/>
          }
        />
        <div className='home-position'>自然资源</div>
      </StatisticCard.Group>
    </CardWidthTitlemid>
  );
};
export default Charts;
