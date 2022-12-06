import CardOrTableComp from '@/components/CardOrTableComp';
import { Dropdown, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import PageCard from '@/components/PageCard';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { EllipsisOutlined } from '@ant-design/icons';

import { IApprovalItem, IOrderApplyItem } from '@/ts/core/todo/itodo';
import { orderOperation, orderTabs, statusMap } from '../components';
import todoCtrl from '@/ts/controller/todo/todoCtrl';

// 根据状态值渲染标签
const renderItemStatus = (record: { status: number }) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
/**采购订单详情表格 */
const expandedRowRender = (
  activeKey: string,
  record: IOrderApplyItem,
  setNeedReload: Function,
) => {
  return (
    <ProTable
      columns={[
        { title: '商品名称', dataIndex: 'caption' },
        { title: '购买权属', dataIndex: 'sellAuth' },
        {
          title: '使用期限',
          dataIndex: 'days',
          render: (_, record) => (record.days ? _ : '无期限'),
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
          dataIndex: 'sellerId',
          // valueType: 'radio',
          // valueEnum: chat.nameMap,
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (_, _record) => renderItemStatus(_record),
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
        {
          title: '操作',
          dataIndex: 'status',
          key: 'operation',
          valueType: 'option',
          render: (_, _record) => {
            console.log(record);
            const menuItems = orderOperation(activeKey, record, setNeedReload, _record);
            console.log(menuItems);
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
      rowKey={(record) => record.id}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={record?.Data?.details}
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
  const [pageData, setPageData] = useState<IOrderApplyItem[] | IApprovalItem[]>();
  const [total, setPageTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const buyColumns: ProColumns<IOrderApplyItem>[] = [
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
      title: '应用名称',
      dataIndex: ['Data', 'name'],
    },
    {
      title: '订单总价',
      dataIndex: ['Data', 'price'],
      valueType: 'money',
    },
    {
      title: '下单时间',
      dataIndex: ['Data', 'createTime'],
      valueType: 'dateTime',
    },
  ];
  const saleColumns: ProColumns<IApprovalItem>[] = [
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
      title: '应用名称',
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
      dataIndex: ['Data', 'order', 'belongId'],
      // valueType: 'radio',
      // valueEnum: chat.nameMap,
    },
    {
      title: '售卖权属',
      dataIndex: ['Data', 'sellAuth'],
    },
    {
      title: '使用期限',
      dataIndex: ['Data', 'days'],
      render: (_, record) => (record.Data.days ? _ : '无期限'),
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
      render: (_, record) => renderItemStatus(record.Data),
    },
    {
      title: '下单时间',
      dataIndex: ['Data', 'createTime'],
      valueType: 'dateTime',
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
  ];
  // 获取订单列表;
  const loadList = async (current: number, pageSize: number) => {
    const code = { '6': 'getApplyList', '5': 'getTodoList' };
    const currentList = await todoCtrl.OrderTodo[code[activeKey]](needReload);
    setCurrentPage(current);
    const list = currentList.slice((current - 1) * pageSize, pageSize * current);
    setPageData(list);
    setPageTotal(currentList.length);
    setNeedReload(false);
  };

  useEffect(() => {
    loadList(1, 10);
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={orderTabs}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      {pageData && (
        <CardOrTableComp<IOrderApplyItem | IApprovalItem>
          showChangeBtn={false}
          rowKey={(record) => record?.Data?.id}
          columns={activeKey == '5' ? saleColumns : buyColumns}
          dataSource={pageData}
          expandable={
            activeKey == '6'
              ? {
                  // defaultExpandAllRows: true,
                  indentSize: 0,
                  expandedRowRender: (record: IOrderApplyItem) =>
                    expandedRowRender(activeKey, record, setNeedReload),
                }
              : ''
          }
          page={currentPage}
          total={total}
          onChange={loadList}
          operation={(item) => orderOperation(activeKey, item, setNeedReload)}
        />
      )}
    </PageCard>
  );
};

export default TodoOrg;
