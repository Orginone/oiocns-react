import { StatisticCard } from '@ant-design/pro-components';
import React from 'react';
import './index.less';
import * as echarts from 'echarts';
import CardWidthTitlemid from '@/components/CardWidthTitlemid';
import EchartsCom from '../Echarts'
import EchartsCom2 from '../Echarts/indexbar';

const { Divider } = StatisticCard;
//TODO: 图表传参数据
let SeriesType: any = [{
  name: '负债',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position: 'insideTop'
  },
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {color: 'rgba(44,66,152,1)'}
  },
  data: [4112.44, 4004.56, 4044.39, 4461.32, 4573.78]
},
{
  name: '净资产',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position: 'insideTop'
  },
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {color: 'rgba(140,166,231,0.5)'}
  },
  data: [8605.22, 9165.92, 10167.79, 11306.67, 24132.16]
},{
  name: '总额',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position:'top',
    formatter: function (params:any) {
      //合计数据
      var total = ['12712.66', '13170.48', '14212.19', '15767.99', '28705.94'];
      return total[params.dataIndex];
    },
  },
  emphasis: {
    focus: 'series'
  },
  data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
}];
let SeriesType2: any = [{
  name: '负债',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position: 'insideTop'
  },
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {color: 'rgba(44,66,152,1)'}
  },
  data: [71781.38, 99231.25, 120926.54, 149356.95, 182383.3]
},
{
  name: '净资产',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position: 'insideTop'
  },
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {color: 'rgba(140,166,231,0.5)'}
  },
  data: [28212.77, 33300.78, 38953.81, 47895.48, 67585.57]
},{
  name: '总额',
  type: 'bar',
  stack: 'total',
  label: {
    show: true,
    position:'top',
    formatter: function (params:any) {
      //合计数据
      var total = ['104374.61', '138119.96', '167168.46', '206826.16', '249968.87'];
      return total[params.dataIndex];
    },
  },
  emphasis: {
    focus: 'series'
  },
  data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
}];
let SeriesType3: any = [{
  name: '土地',
  type: 'bar',
  // label: labelOption,
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {
    barBorderRadius:[10,10,0,0],
      color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{  
                offset: 0,
                color: '#2B6ED9'
              }, {
                offset: 1,
                color: '#C0D8FF'
              }]),}
  },
  data: [156.27, 157.19, 157.20, 180.35, 181.20]
},
{
  name: '矿产',
  type: 'bar',
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {
    barBorderRadius:[10,10,0,0],
    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{  
      offset: 0,
      color: '#84B0F5'
    }, {
      offset: 1,
      color: '#ECF3FF'
    }]),}
  },
  data: [93, 93, 94, 94, 94]
},
{
  name: '水资源',
  type: 'bar',
  // label: labelOption,
  emphasis: {
    focus: 'series'
  },
  itemStyle:{
    normal: {
      barBorderRadius:[10,10,0,0],
      color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{  
      offset: 0,
      color: '#0B3D8C'
    }, {
      offset: 1,
      color: '#3E78D1'
    }]),}
  },
  data: [895.35, 866.54, 1321.36, 1024.6, 1344.73]
},];
let FooterTitleType: any = ['2017', '2018', '2019', '2020', '2021'];
let GridType: any = {}
let legendType: any = {
  // x: 'right',
  // data: [177, 144, 141, 411, 4141, 414, 54125],// 图例数据源
  // orient: 'vertical', //图例列表的布局朝向
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
            <EchartsCom id={'a'} SeriesType={SeriesType} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'value'} legendType={legendType}  yNameType={""} index={1}/>
          }
          
        />
        <div className='home-position1'>行政事业性国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            value: '单位:亿元',
          }}
          chart={
            <EchartsCom id={'aa'} SeriesType={SeriesType2} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'value'} legendType={legendType}  yNameType={""} index={2}/>
          }
        />
        <div className='home-position2'>企业国有资产总额</div>
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            value: ' ',
          }}
          chart={
            <EchartsCom2 id={'aaa'} SeriesType={SeriesType3} FooterTitleType={FooterTitleType} GridType={GridType} xAxisType={'category'} yAxisType={'value'} legendType={legendType}  yNameType={""}/>
          }
        />
        <div className='home-position3'>自然资源</div>
      </StatisticCard.Group>
    </CardWidthTitlemid>
  );
};
export default Charts;
