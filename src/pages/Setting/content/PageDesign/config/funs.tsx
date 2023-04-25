import SelfAppCom from '@/pages/Home/components/SelfAppCom';
import Shortcuts from '@/pages/Home/components/ShortcutsCom';
import BannerCom from '@/pages/Home/components/BannerCom';
import { StatisticCard } from '@ant-design/pro-components';
import Echart from '@/pages/Home/components/Echarts';
import Questions from '../components/ListwithTitle';
import React from 'react';
import {
  demo,
  demo2,
  questionsList,
  policyList,
  complaintList,
  announcementList,
  todoList,
  cardList,
} from './demo';
import DataCard from '../components/DataCockpit/DataCardBox';
import { seriesA, FooterTitle, seriesData } from './demo';
import DealutHome from '@/pages/Home/indexStatic';
import CardList from '@/pages/Home/components/CardList';
import './index.less'
const SCHEME = 'scheme-list';
let imgList: any[] = [];
export enum CompTypes {
  'System' = '系统组件',
  'Ifream' = '自定义组件',
}
//<BannerCom imgList={imgList} />
export interface DataType {
  title: string;
  id?: string;
  list: CompTypeItem[];
  styleData?:any;
  isPublish?: boolean;
}
export interface CompTypeItem {
  name: string;
  type: CompTypes;
  ref?: any;
  i?: string | number;
  width?: number;
  height?: number;
  content?: any;
  url?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  static?: boolean;
  data?: any;
  link?: string;
  style?: React.CSSProperties;
}
function getImgAssets() {
  for (let i = 1; i < 5; i++) {
    imgList.push({
      url: `/img/banner/${i}.png`,
    });
  }
}
getImgAssets();
// canvas方法
const getCanvasBg = () => {
  //获取canvas元素
  let workSpace: any = document.getElementById('SettingWrap');
  let panelWidth = workSpace.clientWidth - 12,
    panelHeight = workSpace.clientHeight - 20;
  let canvas: any = document.getElementById('canvasID');
  let isDarkTheme = document.getElementsByClassName('dark');
  if (canvas == null) return false;
  canvas.width = panelWidth;
  canvas.height = panelHeight;
  //获取上下文
  let context = canvas.getContext('2d');
  let w = (panelWidth - 20) / 12;
  let hig = 120;
  for (let h = panelHeight, j = 0; h > hig; h -= hig, j++) {
    for (let i = 0; i < 12; i++) {
      drowJux(
        context,
        i * (w + 3.8) + 5,
        j * (hig + 3.8) + 5,
        w,
        hig - 1,
        isDarkTheme[0],
      );
    }
  }
};
//绘制矩形
const drowJux = (
  context: {
    strokeStyle: string;
    lineWidth: number;
    strokeRect: (arg0: any, arg1: any, arg2: any, arg3: any) => void;
  },
  left: number,
  top: number,
  w: number,
  h: number,
  isDarkTheme: Element,
) => {
  //设定图形边框的样式
  context.strokeStyle = isDarkTheme ? '#414243' : '#E0E5F3';
  //指定线宽
  context.lineWidth = 1;
  context.strokeRect(left, top, w, h);
};

const renderComp = (item: CompTypeItem, ref?: any) => {
  const { name, i, data = {}, link } = item;
  if (link) {
    return (
      <iframe
        id="CustomIframe"
        allow="payment"
        allowFullScreen={true}
        src={link}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    );
  }
  switch (name) {
    case '轮播图': {
      let showList = imgList;
      if (data?.slideshow?.length > 0) {
        showList = data?.slideshow;
      }

      return <BannerCom imgList={showList} />;
    }
    case '快捷入口':
      return <Shortcuts props={[]} />;
    case '应用列表':
      return <SelfAppCom props={[]} />;
    case '卡片列表':
      return <DataCard dataSource={demo} />;
    case '卡片带title列表':
      return <DataCard dataSource={demo2 as any} />;
    case '饼图2':
      return <Echart id={i} SeriesType={seriesA} />;
    case '折线图':
      return (
        <StatisticCard
          title="流量走势"
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
              width="100%"
            />
          }
        />
      );
    case '折线图2':
      return <Echart id={i} SeriesType={seriesData} FooterTitleType={FooterTitle} />;
    case '饼图':
      return (
        <StatisticCard
          title="资产业务情况"
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png"
              alt="数据"
              width="100%"
            />
          }
        />
      );
    case '柱形图':
      return (
        <StatisticCard
          title="设计资源数"
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
              alt="直方图"
              width="100%"
            />
          }
        />
      );
    case '驾驶舱':
      return <DealutHome />;
    case '咨询问答':
      return <Questions title="咨询问答" dataSourceList={questionsList} />;
    case '政策咨询':
      return <Questions title="政策咨询" dataSourceList={policyList} />;
    case '投诉反馈':
      return <Questions title="投诉反馈" dataSourceList={complaintList} />;
    case '通知公告':
      return <Questions title="通知公告" dataSourceList={announcementList} />;
    case '待办事项':
      return <Questions title="待办事项" dataSourceList={todoList} />;
    case '卡片标题':
      return <CardList List={cardList} />;
    default:
      return <></>;
  }
};

export { getCanvasBg, renderComp, SCHEME };
