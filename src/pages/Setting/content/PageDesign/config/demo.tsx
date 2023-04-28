import {
  FcBiotech,
  FcBrokenLink,
  FcPieChart,
  FcShipped,
  FcStumbleupon,
} from 'react-icons/fc';
import React from 'react';
export const seriesData = [
  {
    type: 'line',
    data: [120, 132, 101, 134, 90, 230, 210],
    name: '资产消耗均值',
    stack: 'Total',
  },
  {
    type: 'line',
    data: [220, 232, 201, 234, 20, 330, 310],
    name: '资产核销量',
    stack: 'Total',
  },
];
export const FooterTitle = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const demo = {
  title: '资产情况',
  bcakImg: '',
  backgroundColor: '',
  list: [
    { title: '资产数量', value: '100个' },
    { title: '资产种类总数', value: '100个' },
    { title: '资产总产值', value: '100个' },
    { title: '资产总税收', value: '100个' },
    { title: '一级资产数', value: '100个' },
    // { title: '资产专利总数', value: '100个' },
  ],
};
export const demo2 = {
  title: '资产情况2',
  type: 'sub',
  list: [
    {
      subtitle: '资产处置',
      icon: '',
      list: [
        { title: '资产数量2', value: '100个' },
        { title: '资产种类总数2', value: '300个' },
        { title: '资产总产值2', value: '100万' },
      ],
    },
    {
      subtitle: '资产变更',
      icon: '',
      list: [
        { title: '资产数量2', value: '100个' },
        { title: '资产种类总数2', value: '50个' },
        { title: '资产总产值2', value: '100万' },
      ],
    },
  ],
};
export const flowTableData = {
  header: ['辖区', '名称', '覆盖率', '报警处置率', '报警完成率'],
  data: [
    ['<span style="color:#37a2da;">滨江</span>', 'A区', '100%', '90%', '100%'],
    ['上城', '<span style="color:#32c5e9;">B区</span>', '100%', '90%', '100%'],
    ['拱墅', 'C区', '<span style="color:#67e0e3;">100%</span>', '90%', '100%'],
    ['西湖', '<span style="color:#9fe6b8;">D区</span>', '100%', '90%', '100%'],
    ['<span style="color:#ffdb5c;">余杭</span>', 'E区', '90%', '90%', '100%'],
    ['金华', '<span style="color:#ff9f7f;">F区</span>', '100%', '90%', '100%'],
  ],
  columnWidth: [50],
  align: ['center'],
  carousel: 'single',
  waitTime: 1000,
};
export const seriesA = [
  {
    name: '',
    type: 'pie',
    radius: '40%',
    center: ['18%', '80.2%'],
    data: [
      { value: 0, name: '优秀' },
      { value: 0, name: '通过' },
      { value: 0, name: '建议修改' },
    ],
    label: {
      normal: {
        position: 'inner',
        formatter: '{c}份',
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
        },
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  {
    name: '',
    type: 'pie',
    radius: '40%',
    center: ['40%', '81%'],
    data: [
      { value: 14, name: '优秀' },
      { value: 21 - 14 - 4, name: '通过' },
      { value: 4, name: '建议修改' },
    ],
    label: {
      normal: {
        position: 'inner',
        formatter: '{c}份',
        offset: [100],
        textStyle: {
          color: '#ffffff',
          fontSize: 14,
        },
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  {
    name: '',
    type: 'pie',
    radius: '40%',
    center: ['62%', '81%'],
    data: [
      { value: 0, name: '优秀' },
      { value: 0, name: '通过' },
      { value: 0, name: '建议修改' },
    ],
    label: {
      normal: {
        position: 'inner',
        formatter: '{c}份',
        textStyle: {
          color: '#ffffff',
          fontSize: 14,
        },
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
];

/**
 * @description: 咨询问答
 * @return {*}
 */
export const questionsList = [
  {
    id: '1',
    title: '国务院办公厅《关于暂停各类开发区的紧急通知》',
    time: '2023年3月1日',
  },
  { id: '2', title: '优化营商环境专题', time: '2023年3月1日' },
  { id: '3', title: '稳经济 一揽子政策措施和接续政策', time: '2023年3月1日' },
  { id: '4', title: '杭州市“十四五”系列规划', time: '2023年3月1日' },
];

/**
 * @description: 政策咨询
 * @return {*}
 */
export const policyList = [
  {
    id: '1',
    title: '《支持国家电子信息产业基地和产业园发展政策》',
    time: '2023年3月1日',
  },
  {
    id: '2',
    title: '《国家发展改革委关于促进产业集群发展的若干意见》',
    time: '2023年3月1日',
  },
  {
    id: '3',
    title: '《工业和信息化部关于促进产业集聚发展和工业合理布局工作的通知》',
    time: '2023年3月1日',
  },
  { id: '4', title: '最新减税政策信息是哪些', time: '2023年3月1日' },
];

/**
 * @description: 投诉反馈
 * @return {*}
 */
export const complaintList = [
  {
    id: '1',
    title: '《国家发展改革委、财政部关于推进园区循环化改造的意见》',
    time: '2023年3月1日',
  },
  {
    id: '2',
    title: '在推进中国式现代化建设中走在前列”——习近平总书记考察广东纪实',
    time: '2023年3月1日',
  },
  {
    id: '3',
    title: '中共杭州市委关于认真学习宣传贯彻党的二十大精神的通知',
    time: '2023年3月1日',
  },
  {
    id: '4',
    title: '中共杭州市委 杭州市人民政府关于促进中医药传承创新发展的实施意见',
    time: '2023年3月1日',
  },
];

/**
 * @description: 通知公告
 * @return {*}
 */
export const announcementList = [
  {
    id: '1',
    title: '《关于加强国家生态工业示范园区建设的指导意见》',
    time: '2023年3月1日',
  },
  {
    id: '2',
    title: '国土资源部《进一步治理整顿土地市场秩序工作方案》通知',
    time: '2023年3月1日',
  },
  { id: '3', title: '关于杭州市人才评定意见(暂行）', time: '2023年3月1日' },
  { id: '4', title: '杭州“定制化”回访 教育激励担当作为', time: '2023年3月1日' },
];

export const todoList = [
  {
    id: '1',
    title: '好友申请：千与千寻 请求 成为您的好友',
    time: '2023年3月19日',
  },
  { id: '2', title: '资产处置：单位审批 处置损坏资产请求', time: '2023年3月13日' },
  { id: '3', title: '组织审批：Tom 请求加入 组织 资产协同中心', time: '2023年3月2日' },
];

// 无限滚动配置项
export const config = {
  header: ['辖区', '园区名称', '消控点位覆盖率', '消控报警处置率', '消控报警完成率'],
  data: [
    ['<span style="color:#37a2da;">滨江</span>', 'A区', '100%', '90%', '100%'],
    ['上城', '<span style="color:#32c5e9;">B区</span>', '100%', '90%', '100%'],
    ['拱墅', 'C区', '<span style="color:#67e0e3;">100%</span>', '90%', '100%'],
    ['西湖', '<span style="color:#9fe6b8;">D区</span>', '100%', '90%', '100%'],
    ['<span style="color:#ffdb5c;">余杭</span>', 'E区', '90%', '90%', '100%'],
    ['金华', '<span style="color:#ff9f7f;">F区</span>', '100%', '90%', '100%'],
  ],
  columnWidth: [50],
  align: ['center'],
  carousel: 'single',
  waitTime: 1000,
};
const imgUrl = 'https://xsgames.co/randomusers/avatar.php?g=pixel';
// 卡片配置项
export const cardList = [
  {
    id: '1',
    title: '我的资产',
    number: 2868,
    iconUrl: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    icon: <FcPieChart size={40} />,
  },
  {
    id: '2',
    title: '资产总数',
    number: 2868,
    iconUrl: imgUrl,
    icon: <FcStumbleupon size={40} />,
  },
  {
    id: '3',
    title: '处置资产',
    number: 2868,
    iconUrl: imgUrl,
    icon: <FcBrokenLink size={40} />,
  },
  {
    id: '4',
    title: '资产价值（亿元）',
    number: 2868,
    iconUrl: imgUrl,
    icon: <FcPieChart size={40} />,
  },
  {
    id: '5',
    title: '待处理',
    number: 2868,
    iconUrl: imgUrl,
    icon: <FcBiotech size={40} />,
  },
  {
    id: '6',
    title: '可分配',
    number: 2868,
    iconUrl: imgUrl,
    icon: <FcShipped size={40} />,
  },
];
