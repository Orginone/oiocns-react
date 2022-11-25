import CardOrTableComp from '@/components/CardOrTableComp';
import todoService, { tabStatus } from '@/ts/controller/todo';
import { Dropdown, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { EllipsisOutlined } from '@ant-design/icons';
import { XOrder, XOrderDetail } from '@/ts/base/schema';
// import { chatCtrl as chat } from '@/ts/controller/chat';
todoService.currentModel = 'order';

// 根据状态值渲染标签
const renderItemStatus = (record: { status: number }) => {
  const status = todoService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
/**采购订单详情表格 */
const expandedRowRender = (
  record: {
    details: readonly XOrderDetail[] | undefined;
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
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (_, record) => renderItemStatus(record),
        },
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
              <Tag>已下架</Tag>
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
            const menuItems = todoService.orderOperation(_record, setNeedReload);
            if (menuItems.length > 0) {
              return (
                <Dropdown menu={{ items: menuItems }}>
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

/**
 * 办事-订单
 * @returns
 */
const TodoOrg: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('5');
  const [pageData, setPageData] = useState<XOrder[] | XOrderDetail[]>();
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const buyColumns: ProColumns<XOrder>[] = [
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
      title: '订单总价',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  const saleColumns: ProColumns<XOrderDetail>[] = [
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
      // valueEnum: chat.getName,
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
      render: (_, record) => renderItemStatus(record),
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
  // 获取订单列表;
  const loadList = () => {
    console.log(todoService.currentList);
    setPageData([...todoService.currentList]);
    setPageTotal(todoService.currentList.length);
    setNeedReload(false);
  };

  useEffect(() => {
    todoService.activeStatus = activeKey as tabStatus;
    loadList();
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={todoService.orderTabs}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      {pageData && (
        <CardOrTableComp<XOrder | XOrderDetail>
          showChangeBtn={false}
          rowKey={'id'}
          columns={activeKey == '5' ? saleColumns : buyColumns}
          dataSource={pageData}
          expandable={
            activeKey == '6'
              ? {
                  defaultExpandAllRows: true,
                  indentSize: 0,
                  expandedRowRender: (record: any) =>
                    expandedRowRender(record, setNeedReload),
                }
              : ''
          }
          total={total}
          onChange={loadList}
          operation={(item: XOrder | XOrderDetail) =>
            todoService.orderOperation(item, setNeedReload)
          }
        />
      )}
    </PageCard>
  );
};

export default TodoOrg;
