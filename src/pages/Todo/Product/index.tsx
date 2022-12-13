import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import React, { useState } from 'react';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { statusList, statusMap, tableOperation } from '../components';
import { XRelation } from '@/ts/base/schema';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { PageRequest } from '@/ts/base/model';

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
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<IApplyItem | IApprovalItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '市场',
      dataIndex: ['Data', 'market', 'name'],
      render: (_, record) => {
        return (
          <Space>
            {_}
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
      render: (_, record) => {
        return (
          <Space>
            {_}
            <Tag>{record.Data.product?.code}</Tag>
          </Space>
        );
      },
    },
    {
      title: '价格',
      dataIndex: ['Data', 'price'],
      valueType: 'money',
      render: (_, record) => (record.Data.price ? _ : '免费'),
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
  const loadList = async (page: PageRequest) => {
    const listStatusCode = {
      '1': 'getTodoList',
      '2': 'getDoList',
      '3': 'getApplyList',
    };
    setNeedReload(false);
    if (activeKey === '3') {
      const list = await todoCtrl.PublishTodo[listStatusCode[activeKey]](page);
      return {
        total: list.length || 0,
        result: list || [],
        offset: 0,
        limit: list.length,
      };
    } else {
      const list = await todoCtrl.PublishTodo[listStatusCode[activeKey]](needReload);
      return {
        total: list.length || 0,
        result: list || [],
        offset: 0,
        limit: list.length,
      };
    }
  };

  return (
    <PageCard
      tabList={statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      <CardOrTableComp<IApplyItem | IApprovalItem>
        rowKey={(record) => record?.Data?.id}
        columns={columns}
        dataSource={[]}
        params={{ activeKey, needReload }}
        request={async (page) => await loadList(page)}
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
