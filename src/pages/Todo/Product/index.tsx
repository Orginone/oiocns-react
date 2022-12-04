import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { statusList, statusMap, tableOperation } from '../components';
import { XRelation } from '@/ts/base/schema';
import todoCtrl from '@/ts/controller/todo/todoCtrl';

// 根据状态值渲染标签
const renderItemStatus = (record: XRelation) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};

// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-应用上架审批
 * @returns
 */
const TodoStore: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [pageData, setPageData] = useState<IApplyItem[] | IApprovalItem[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<IApplyItem | IApprovalItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '市场名称',
      dataIndex: ['Data', 'market', 'name'],
    },
    {
      title: '应用名称',
      dataIndex: ['Data', 'product', 'name'],
      render: (_, record) => {
        return (
          <Space>
            {_}
            <Tag color="#5BD8A6">{record.Data.product?.source}</Tag>
          </Space>
        );
      },
    },
    {
      title: '应用编号',
      dataIndex: ['Data', 'product', 'code'],
    },
    {
      title: '价格/使用期限',
      dataIndex: ['Data'],
      render: (_, record) => {
        return (
          <Space>
            {record?.Data?.price || '0.00'}
            <Tag>使用期：{record.Data.days} 天</Tag>
          </Space>
        );
      },
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
        return renderItemStatus(record.Data);
      },
    },
    {
      title: '申请时间',
      dataIndex: ['Data', 'createTime'],
      valueType: 'dateTime',
    },
  ];
  // 获取申请/审核列表
  const loadList = async (page: number, pageSize: number) => {
    const listStatusCode = {
      '1': 'getTodoList',
      '2': 'getDoList',
      '3': 'getApplyList',
    };

    const data = await todoCtrl.PublishTodo[listStatusCode[activeKey]](needReload);
    console.log(data);
    setPageData(data);
    setPageTotal(data.length);
    setNeedReload(false);
  };

  useEffect(() => {
    setPageData([]);
    setPageTotal(0);
    loadList(1, 10);
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}
      tabBarExtraContent={''}>
      <CardOrTableComp<IApplyItem | IApprovalItem>
        rowKey={(record) => record?.Data?.id}
        columns={columns}
        dataSource={pageData}
        total={total}
        onChange={loadList}
        operation={(item: IApplyItem | IApprovalItem) =>
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<IApplyItem | IApprovalItem>
            data={arr}
            statusType={(item) => renderItemStatus(item.Data)}
            targetOrTeam="product"
            operation={(item) => tableOperation(activeKey, item, setNeedReload)}
          />
        )}
      />
    </PageCard>
  );
};

export default TodoStore;
