import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
type SeriesType = {
  // type: 'bar' | 'line' | 'pie'; // 柱状图｜折线图｜饼图;
  type: string; // 柱状图｜折线图｜饼图;
  data: any[]; // 数据源
  name?: string; // 图例名称和鼠标移入展示名称
  stack?: string;
}[];
type FooterTitleType = string[] | number[]; // 示图表横向坐标轴展项
type GridType = {
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
}; // 图表距离边缘位置的距离 传入百分比值|{number}（单位px）
type xAxisType = 'value' | 'category' | 'time' | 'log'; // X坐标轴类型。
type yAxisType = 'value' | 'category' | 'time' | 'log'; // Y坐标轴类型。
type legendType = {
  x: 'right';
  data?: string[] | number[]; // 图例数据源
  orient?: 'horizontal' | 'vertical'; //图例列表的布局朝向
  top?: string | number | 'top' | 'middle' | 'bottom';
  right?: string | number;
  textStyle?: {
    color?: string; // 字体颜色
    fontWeight?: string | number; // 字体粗细
    fontSize?: number; // 字体大小
    lineHeight?: number; // 行高2
  };
}; // 图例
type yNameType = string; // Y坐标轴name

interface Iprops {
  id?: any;
  index?:number;
  SeriesType?: SeriesType;
  FooterTitleType?: FooterTitleType;
  GridType?: GridType;
  xAxisType?: xAxisType;
  yAxisType?: yAxisType;
  legendType?: legendType;
  yNameType?: yNameType;
}
const Echart: React.FC<Iprops> = ({
  id = 'main',
  index,
  SeriesType,
  FooterTitleType,
  xAxisType,
  yAxisType,
  yNameType,
  GridType,
  legendType,
}) => {
  const chartsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // 绑定展示图
    const chartDom: any = chartsRef.current;
    // 初始化echats图表
    const histogramChart = echarts.init(chartDom);
    const option = {
      backgroundColor: '#ffffff',
      // 提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params:any) => {
          var total1 = ['12712.66', '13170.48', '14212.19', '15767.99', '28705.94'];
      var total2 = ['104374.61', '138119.96', '167168.46', '206826.16', '249968.87'];
      if(index == 1){
        var sumtext =  total1[params[0].dataIndex];
      }else if(index == 2){
        var sumtext =  total2[params[0].dataIndex];
      }
          return params[0].name + '<br>' +
            params[0].marker + ' ' + params[0].seriesName + ': ' + params[0].data + '<br>' +
            params[1].marker + ' ' + params[1].seriesName + ': ' + params[1].data + '<br>' +
            params[2].marker + ' ' + params[2].seriesName + ': ' +sumtext
        },
      },
      // 图表距离边缘位置的距离
      grid:   {
        top: '6%',
        right: '6%',
        left: '10%',
        bottom: '20%',
      },
      xAxis: [
        {
          type: xAxisType,
          data: FooterTitleType,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)',
            },
          },
          axisLabel: {
            margin: 10,
            color: '#606266',
            textStyle: {
              fontSize: 14,
            },
          },
        },
      ],
      yAxis: [
        {
          type: yAxisType,
          name: yNameType,
          axisLabel: {
            type: yAxisType,
            formatter: '{value}',
            color: '#606266',
          },
          axisLine: {
            show: true,
          },
          /* splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)',
            },
          }, */
        },
      ],
      legend: legendType,
      series: SeriesType,
      media: [
        {
          option: {
            series: [
              { center: ['25%', '50%'] },
              { center: ['50%', '50%'] },
              { center: ['75%', '50%'] },
            ],
          },
        },
      ],
    };
    option && histogramChart.setOption(option);
  }, []);
  return <div id={id} ref={chartsRef} style={{ width: '100%', height: '100%' }} />;
};

export default Echart;
