import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

type SeriesType = {
  // type: 'bar' | 'line' | 'pie'; // 柱状图｜折线图｜饼图;
  type: string; // 柱状图｜折线图｜饼图;
  data: any[]; // 数据源
  name?: string; // 图例名称和鼠标移入展示名称
  stack?: string;
}[];
type FooterTitleType = string[] | number[]; // 图表横向坐标轴展示项
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
    lineHeight?: number; // 行高
  };
}; // 图例
type yNameType = string; // Y坐标轴name

export const onEcharts = (
  SeriesType?: SeriesType,
  FooterTitleType?: FooterTitleType,
  xAxisType?: xAxisType,
  yAxisType?: yAxisType,
  yNameType?: yNameType,
  GridType?: GridType,
  legendType?: legendType,
) => {
  const chartsRef = useRef(null) as any;
  useEffect(() => {
    // 绑定展示图
    const chartDom = chartsRef.current;
    // 初始化echats图表
    const histogramChart = echarts.init(chartDom);
    const option = {
      backgroundColor: '#00265f',
      // 提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      // 图表距离边缘位置的距离
      grid: GridType || {
        top: '15%',
        right: '3%',
        left: '10%',
        bottom: '12%',
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
            color: '#e2e9ff',
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
            color: '#e2e9ff',
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)',
            },
          },
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
    // 根据页面大小重新渲染图表
    const handleResize = () => {
      histogramChart?.resize();
    };
    window.addEventListener('resize', handleResize);
  }, []);
  //  图表容器
  return <div ref={chartsRef} style={{ width: '100%', height: '100%' }} />;
};
