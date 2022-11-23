import CardOrTableComp from '@/components/CardOrTableComp';
import todoService, { tabStatus } from '@/ts/controller/todo';
import { OderDetailType } from '@/module/todo/typings';
import { Dropdown, Menu, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';

import { ProColumns, ProTable } from '@ant-design/pro-components';
import { StatusPage } from '@/module/typings';
import { EllipsisOutlined } from '@ant-design/icons';
// import { chat } from '@/module/chat/orgchat';

const orderTypeTabs = [
  { tab: '销售订单', key: '5' },
  { tab: '采购订单', key: '6' },
];
const statusoptions = {
  1: { text: '待交付', status: 'Processing' },
  //包含第三方监管和卖方的审核状态
  102: { text: '已发货', status: 'Success' },
  //后续可能有物流状态接入
  220: { text: '买方取消订单', status: 'Error' },
  221: { text: '卖方取消订单', status: 'Error' },
  222: { text: '已退货', status: 'Default' },
};
/**采购订单详情表格 */
const expandedRowRender = (
  record: {
    details: readonly Record<string, any>[] | undefined;
  },
  setNeedReload: Function,
) => {
  return (
    <ProTable
      columns={[
        { title: '商品名称', dataIndex: 'caption', key: 'caption' },
        { title: '购买权属', dataIndex: 'sellAuth', key: 'sellAuth' },
        { title: '使用期限', dataIndex: 'days', key: 'days' },
        { title: '价格', dataIndex: 'price', key: 'price', valueType: 'money' },
        {
          title: '市场名称',
          dataIndex: ['merchandise', 'marketId'],
          key: 'marketId',
          // valueType: 'radio',
          // valueEnum: chat.nameMap,
        },
        {
          title: '卖家',
          dataIndex: 'sellerId',
          key: 'sellerId',
          // valueType: 'radio',
          // valueEnum: chat.nameMap,
        },
        { title: '状态', dataIndex: 'status', key: 'status', valueEnum: statusoptions },
        {
          title: '下单时间',
          dataIndex: 'createTime',
          valueType: 'dateTime',
          key: 'createTime',
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
        {
          title: '操作',
          dataIndex: 'status',
          key: 'operation',
          valueType: 'option',
          render: (_, _record) => {
            // console.log(record);
            const menuItems = tableOperation('2', _record, setNeedReload);
            if (menuItems.length > 0) {
              return (
                <Dropdown overlay={<Menu items={menuItems} />}>
                  <EllipsisOutlined />
                </Dropdown>
              );
            }
            return '';
          },
        },
      ]}
      rowKey="id"
      headerTitle={false}
      search={false}
      options={false}
      dataSource={record.details}
      pagination={false}
    />
  );
};
// 生成说明数据
const tableOperation = (activeKey: string, item: OderDetailType, callback: Function) => {
  // 是否是待发货的订单状态
  const allowToCancel =
    activeKey == `6` && item.details
      ? item.details.find((n: OderDetailType) => n.status < 102)
      : item.status < 102;
  const menu = [];
  if (allowToCancel) {
    menu.push({
      key: 'retractApply',
      label: '取消订单',
      onClick: () => {
        todoService
          .retractApply(
            item.details
              ? (item.details.map((n: any) => n.id) || []).toString()
              : item.id,
            activeKey == '5' ? 221 : 220,
          )
          .then(({ success }) => {
            if (success) {
              callback.call(callback, true);
            }
          });
      },
    });
    if (activeKey == `1`) {
      menu.push({
        key: 'approve',
        label: '确认交付',
        onClick: () => {
          todoService.approve(item.id, 102).then(({ success }) => {
            if (success) {
              callback.call(callback, true);
            }
          });
        },
      });
    }
  } else if (item.status == 102 && activeKey == `2`) {
    menu.push({
      key: 'refuse',
      label: '退货退款',
      onClick: () => {
        todoService.refuse(item.id, 222).then(({ success }) => {
          if (success) {
            callback.call(callback, true);
          }
        });
      },
    });
  }
  return menu;
};

/**
 * 办事-订单
 * @returns
 */
const TodoOrg: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('5');
  const [pageData, setPageData] = useState<Record<string, OderDetailType[]>>({
    '5': [],
    '6': [],
  });
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const buyColumns: ProColumns<OderDetailType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '订单号',
      dataIndex: 'code',
    },

    {
      title: '应用名称',
      dataIndex: 'name',
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  const saleColumns: ProColumns<OderDetailType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '订单号',
      dataIndex: ['order', 'code'],
    },
    {
      title: '应用名称',
      dataIndex: 'caption',
    },
    {
      title: '市场名称',
      dataIndex: ['merchandise', 'marketId'],
      // valueType: 'radio',
      // valueEnum: chat.nameMap,
    },
    {
      title: '买家',
      dataIndex: ['order', 'belongId'],
      // valueType: 'radio',
      // valueEnum: chat.nameMap,
    },
    {
      title: '售卖权属',
      dataIndex: 'sellAuth',
    },
    {
      title: '使用期限',
      dataIndex: 'days',
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusoptions,
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
        return record.merchandise ? <Tag>在售</Tag> : <Tag color="danger">已下架</Tag>;
      },
    },
  ];
  // 获取申请 / 审核列表;
  const handlePageChange = async (page: number, pageSize: number) => {
    if (!pageData || !pageData[activeKey] || needReload) {
      // 如果已经加载过
      const { data = [], total = 0 } = await todoService.getList<
        OderDetailType,
        StatusPage
      >({
        filter: '',
        status: 0, //后续改成-1
        page: page,
        pageSize: pageSize,
      });
      setPageData({ ...pageData, [activeKey]: data });
      setPageTotal(total);
      setNeedReload(false);
    } else {
      setPageTotal(pageData[activeKey].length);
    }
  };

  useEffect(() => {
    setPageData({ ...pageData, [activeKey]: [] });
    todoService.activeStatus = activeKey as tabStatus;
    handlePageChange(1, 12);
  }, ['', activeKey, needReload]);

  return (
    <PageCard
      tabList={orderTypeTabs}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      {pageData && pageData[activeKey] && (
        <CardOrTableComp
          showChangeBtn={false}
          rowKey={'id'}
          bordered={false}
          columns={activeKey == '5' ? saleColumns : buyColumns}
          dataSource={pageData[activeKey]}
          expandable={
            activeKey == '6'
              ? {
                  expandedRowRender: (record: any) =>
                    expandedRowRender(record, setNeedReload),
                }
              : ''
          }
          total={total}
          onChange={handlePageChange}
          operation={(item: OderDetailType) =>
            tableOperation(activeKey, item, setNeedReload)
          }
        />
      )}
    </PageCard>
  );
};

export default TodoOrg;
