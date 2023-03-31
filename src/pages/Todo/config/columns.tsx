import React from 'react';
import { Space, Tag } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { XOrderDetail } from '@/ts/base/schema';
import { ProColumns } from '@ant-design/pro-table';
import { IApplyItem, IApprovalItem, IOrderApplyItem, TargetType } from '@/ts/core';
import thingCtrl from '@/ts/controller/thing';
import { schema } from '@/ts/base';

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

export const OrgColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '说明',
    dataIndex: ['Data', 'remark'],
    render: (_: any, row: any) => {
      if ((row as IApplyItem).cancel) {
        switch (row.Data.team.target.typeName) {
          case TargetType.Person:
            return '请求添加' + row.Data.team.name + '为好友';
          default:
            return '请求加入' + row.Data.team.name;
        }
      } else {
        switch (row.Data.team.target.typeName) {
          case TargetType.Person:
            return row.Data.target.name + '请求添加好友';
          default:
            return row.Data.target.name + '请求加入' + row.Data.team.name;
        }
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
    render: (_: any, record: IApplyItem | IApprovalItem) => {
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

export const MarketColumns = [
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
    render: (name: any, record: any) => {
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
    render: (_: any, record: any) => {
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
    render: (_: any, record: any) => {
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

export const MerchandiseColumns = [
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
    render: (name: any, record: any) => {
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
  // {
  //   title: '应用',
  //   dataIndex: ['Data', 'product', 'name'],
  //   render: (name: any, record: any) => {
  //     return (
  //       <Space>
  //         {name}
  //         <Tag>{record.Data.product?.code}</Tag>
  //       </Space>
  //     );
  //   },
  // },
  {
    title: '价格',
    dataIndex: ['Data', 'price'],
    valueType: 'money',
    render: (_: any, record: any) => record.Data.price || '免费',
  },
  {
    title: '使用期限',
    dataIndex: ['Data', 'days'],
    render: (_: any, record: any) =>
      record.Data.days ? record.Data.days + ' 天' : '永久',
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
    render: (_: any, record: any) => {
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

export const WorkReocrdColumns: ProColumns<schema.XFlowRecord>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '事项',
    dataIndex: ['historyTask', 'instance', 'title'],
  },
  {
    title: '类型',
    dataIndex: ['historyTask', 'node', 'nodeType'],
  },
  {
    title: '审批时间',
    dataIndex: ['createTime'],
    valueType: 'dateTime',
  },
  {
    title: '审批意见',
    dataIndex: 'comment',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, record) => {
      const status = statusMap[record.status];
      if (record.historyTask.node?.nodeType == '抄送') {
        return <Tag color={status.color}>已阅</Tag>;
      }
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
];

export const WorkStartReocrdColumns: ProColumns[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '事项',
    dataIndex: 'title',
  },
  {
    title: '发起时间',
    dataIndex: ['createTime'],
    valueType: 'dateTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, record) => {
      const status = statusMap[record.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
];

export const WorkTodoColumns: ProColumns[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '类别',
    dataIndex: ['instance', 'define', 'speciesId'],
    render: (_, record) => {
      return (
        thingCtrl.speciesList.find((a) => a.id == record.instance?.define?.speciesId)
          ?.name ?? '未知'
      );
    },
  },
  {
    title: '事项',
    dataIndex: ['instance', 'define', 'name'],
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, record) => {
      const status = statusMap[record.status];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '申请人',
    dataIndex: ['instance', 'createUser'],
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.instance.createUser);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '申请时间',
    dataIndex: ['instance', 'createTime'],
    valueType: 'dateTime',
  },
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

export const FlowInstanceColumns: ProColumns<IApprovalItem>[] = [];
