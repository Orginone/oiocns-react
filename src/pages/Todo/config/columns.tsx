import React from 'react';
import { Space, Tag } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { XOrderDetail } from '@/ts/base/schema';
import { ProColumns } from '@ant-design/pro-table';
import { IApplyItem, IApprovalItem, IOrderApplyItem } from '@/ts/core';

export const WorkColumns: ProColumns<{ Data: any }>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '说明',
    dataIndex: ['Data', 'remark'],
  },
  {
    title: '事项',
    dataIndex: ['Data', 'team', 'target', 'typeName'],
  },
  {
    title: '申请人',
    dataIndex: ['Data', 'target', 'name'],
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '申请时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const OrgColumns: ProColumns<IApplyItem | IApprovalItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '说明',
    dataIndex: ['Data', 'remark'],
    render: (_, row) => {
      if (row as IApplyItem) {
        return '请求添加' + row.Data?.team?.name + '为好友';
      } else {
        return row.Data?.target?.name + '请求添加好友';
      }
    },
  },
  {
    title: '事项',
    dataIndex: ['Data', 'team', 'target', 'typeName'],
    render: () => <Tag color="#5BD8A6">好友</Tag>,
  },
  {
    title: '申请人',
    dataIndex: ['Data', 'target', 'name'],
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, record: IApplyItem | IApprovalItem) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '申请时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const MarketColumns: ProColumns<IApplyItem | IApprovalItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '市场',
    dataIndex: ['Data', 'market', 'name'],
    width: 300,
    render: (name, record) => {
      return (
        <Space>
          {name}
          <Tag>{record.Data.market?.code}</Tag>
        </Space>
      );
    },
  },
  {
    title: '申请组织',
    dataIndex: '',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      if (record.Data.target) {
        return record.Data.target.name;
      }
      const team = userCtrl.findTeamInfoById(record.Data.targetId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '状态 ',
    dataIndex: 'status',
    valueType: 'select',
    render: (_, record) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '申请时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const MerchandiseColumns: ProColumns<IApplyItem | IApprovalItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '市场',
    dataIndex: ['Data', 'market', 'name'],
    width: 300,
    render: (name, record) => {
      return (
        <Space>
          {name}
          <Tag>{record.Data.market?.code}</Tag>
        </Space>
      );
    },
  },
  {
    title: '商品名称',
    dataIndex: ['Data', 'caption'],
  },
  {
    title: '说明',
    dataIndex: ['Data', 'information'],
  },
  {
    title: '应用',
    dataIndex: ['Data', 'product', 'name'],
    render: (name, record) => {
      return (
        <Space>
          {name}
          <Tag>{record.Data.product?.code}</Tag>
        </Space>
      );
    },
  },
  {
    title: '价格',
    dataIndex: ['Data', 'price'],
    valueType: 'money',
    render: (_, record) => record.Data.price || '免费',
  },
  {
    title: '使用期限',
    dataIndex: ['Data', 'days'],
    render: (_, record) => (record.Data.days ? record.Data.days + ' 天' : '永久'),
  },
  {
    title: '应用类型',
    dataIndex: ['Data', 'product', 'typeName'],
  },
  {
    title: '应用权限',
    dataIndex: ['Data', 'product', 'authority'],
  },
  {
    title: '状态 ',
    dataIndex: 'status',
    render: (_, record) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '申请时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const BuyOrderColumns: ProColumns<IOrderApplyItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '订单号',
    dataIndex: ['Data', 'code'],
  },
  {
    title: '订单名称',
    dataIndex: ['Data', 'name'],
  },
  {
    title: '订单总价',
    dataIndex: ['Data', 'price'],
    valueType: 'money',
    render: (_, record) => (record.Data.price ? _ : '免费'),
  },
  {
    title: '下单时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const BuyOrderItemColumns: ProColumns<XOrderDetail>[] = [
  { title: '商品名称', dataIndex: 'caption' },
  { title: '购买权属', dataIndex: 'sellAuth' },
  {
    title: '使用期限',
    dataIndex: 'days',
    render: (_, record) => (record.days ? _ : '永久'),
  },
  {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
    render: (_, record) => (record.price ? _ : '免费'),
  },
  {
    title: '市场名称',
    dataIndex: ['merchandise', 'marketId'],
    // valueType: 'radio',
    // valueEnum: chat.nameMap,
  },
  {
    title: '卖家',
    // valueType: 'radio',
    // valueEnum: chat.nameMap,
    dataIndex: 'rule',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.sellerId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, _record) => {
      const status = statusMap[_record.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
  },
  {
    title: '商品状态',
    dataIndex: ['merchandise', 'status'],
    render: (_, record) => {
      return record.merchandise ? (
        <Tag color="processing">在售</Tag>
      ) : (
        <Tag color="danger">已下架</Tag>
      );
    },
  },
];

export const SaleColumns: ProColumns<IApprovalItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '订单号',
    dataIndex: ['Data', 'order', 'code'],
  },
  {
    title: '商品名称',
    dataIndex: ['Data', 'caption'],
  },
  {
    title: '市场名称',
    dataIndex: ['Data', 'merchandise', 'marketId'],
    // valueType: 'radio',
    // valueEnum: chat.getName,
  },
  {
    title: '买家',
    // valueType: 'radio',
    // valueEnum: chat.nameMap,
    dataIndex: 'rule',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.Data.order.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '售卖权属',
    dataIndex: ['Data', 'sellAuth'],
  },
  {
    title: '使用期限',
    dataIndex: ['Data', 'days'],
    render: (_, record) => (record.Data.days ? record.Data.days + '天' : '永久'),
  },
  {
    title: '价格',
    dataIndex: ['Data', 'price'],
    valueType: 'money',
    render: (_, record) => (record.Data.price ? _ : '免费'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, record) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '商品状态',
    dataIndex: ['Data', 'merchandise'],
    render: (_, record) => {
      return record?.Data.merchandise ? (
        <Tag color="processing">在售</Tag>
      ) : (
        <Tag color="danger">已下架</Tag>
      );
    },
  },
  {
    title: '下单时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

export const ApplicationColumns: ProColumns<IApprovalItem>[] = [
  { title: '序号', valueType: 'index', width: 60 },
  { title: '当前流程', dataIndex: ['Data', 'flowInstance', 'title'] },
  {
    title: '申请人',
    dataIndex: 'rule',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.Data.createUser);
      if (team) {
        return team.name;
      }
    },
  },
  { title: '事项', dataIndex: ['Data', 'flowInstance', 'content'] },
  {
    title: '状态',
    dataIndex: ['Data', 'status'],
    render: (_, record) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  { title: '创建时间', dataIndex: ['Data', 'createTime'], valueType: 'dateTime' },
];
export const ApplicationApplyColumns: ProColumns<IApplyItem>[] = [
  { title: '序号', valueType: 'index', width: 60 },
  { title: '标题', dataIndex: ['Data', 'title'] },
  { title: '事项', dataIndex: ['Data', 'content'] },
  {
    title: '状态',
    dataIndex: ['Data', 'status'],
    render: (_, record) => {
      const status = statusMap[record.Data.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  { title: '创建时间', dataIndex: ['Data', 'createTime'], valueType: 'dateTime' },
];
const statusMap = {
  1: {
    color: 'blue',
    text: '待处理',
  },
  100: {
    color: 'green',
    text: '已同意',
  },
  200: {
    color: 'red',
    text: '已拒绝',
  },
  102: {
    color: 'green',
    text: '已发货',
  },
  220: {
    color: 'gold',
    text: '买方取消订单',
  },
  221: {
    color: 'volcano',
    text: '卖方取消订单',
  },
  222: {
    color: 'default',
    text: '已退货',
  },
};
