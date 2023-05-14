import { StatisticCard } from '@ant-design/pro-components';
import React from 'react';
import './index.less';
import CardWidthTitlemid from '@/components/CardWidthTitlemid';
import Echarts from '../Echarts'
import Echarts1 from '../Echarts1'

const { Divider } = StatisticCard;
let SeriesTypes: any = {
  type: 'bar',
  data: [5000, 10000, 15000, 20000, 25000, 30000],
  name: '总额',
  stack: ''
};
let FooterTitleTypes: any = [2017, 2018, 2019, 2020, 2021]
//
let legendTypes: any = {
  x: 'right',
  data: [],
  orient: 'horizontal',
  top: 'bottom',
  right: 1,
  textStyle: {
    color: '#606266', // 字体颜色
    fontWeight: 700, // 字体粗细
    fontSize: '14px', // 字体大小
    lineHeight: 2 // 行高2
  }
}
let GridTypes: any = {}




//TODO: 图表传参数据
let SeriesType: any = {
  type: 'bar',
  data: [5000, 10000, 15000, 20000, 25000, 30000],
  name: '',
};
let FooterTitleType: any = [2017, 2018, 2019, 2020, 2021];
let GridType: any = {}
let legendType: any = {
  x: 'right',
  // data: [177, 144, 141, 411, 4141, 414, 54125],
  // 图例数据源
  orient: 'vertical', //图例列表的布局朝向
  top: 'bottom',
}



let SeriesType3: any = {
  type: 'bar',
  data: [5000, 10000, 15000, 20000, 25000, 30000],
  name: '',
};
let FooterTitleType3: any = [2017, 2018, 2019, 2020, 2021];
let GridType3: any = {}
let legendType3: any = {
  x: 'right',
  // data: [177, 144, 141, 411, 4141, 414, 54125],
  // 图例数据源
  orient: 'vertical', //图例列表的布局朝向
  top: 'bottom',
}


const Charts: React.FC<any> = () => {
  return (
    <CardWidthTitlemid  title="数据监测" title2='浙江省国有资产概况'>
      <StatisticCard.Group direction={'row'}>
        <StatisticCard
          // statistic={{
          //   value: '单位:亿元',
          // }}
          chart={
            <Echarts id={'demo'} SeriesType={SeriesTypes} FooterTitleType={FooterTitleTypes} xAxisType={'category'}
                 yAxisType={'category'} GridType={GridTypes} legendType={legendTypes} yNameType={'单位:亿元'}/>
          }
        />
        <div className='home-position1'>行政事业性国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          // statistic={{
          //   value: '单位:亿元',
          // }}
          chart={
            <Echarts id={'aa'} SeriesType={SeriesType} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'category'} legendType={legendType}  yNameType={"单位:亿元"}/>
          }
        />
        <div className='home-position2'>企业国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          // statistic={{
          //   value: '单位:万公顷/种/亿立方米',
          // }}
          chart={
            <Echarts1 id={'aaa'} SeriesType={SeriesType3} FooterTitleType={FooterTitleType3} GridType={GridType3} xAxisType={'category'} yAxisType={'category'} legendType={legendType3}  yNameType={"单位:万公顷/种/亿立方米"}/>
          }
        />
        <div className='home-position3'>自然资源</div>
      </StatisticCard.Group>
    </CardWidthTitlemid>
  );
};
export default Charts;
