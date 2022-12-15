import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import React, { useState } from 'react';
import { DataType } from 'typings/globelType';
import { statusList, statusMap, tableOperation } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { XRelation } from '@/ts/base/schema';
import { nanoid } from '@ant-design/pro-utils';
import { PageRequest } from '@/ts/base/model';

/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  // if (ids.length > 0) {
  //   const { success } = await approve(ids.toString());
  //   if (success) {
  //     message.success('添加成功！');
  //   } else {
  //     message.error('抱歉，提交失败');
  //   }
  // }
};

// 根据状态值渲染标签
const renderItemStatus = (record: XRelation) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};

// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-加入市场审批
 * @returns
 */
const TodoStore: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
      title: '申请组织',
      dataIndex: '',
      render: (_, row) => {
        return row.Data.target ? row.Data.target.name : '本人';
      },
    },
    {
      title: '状态 ',
      dataIndex: 'status',
      valueType: 'select',
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
    const list = await todoCtrl.MarketTodo[listStatusCode[activeKey]](needReload);
    setNeedReload(false);
    return {
      total: list.length || 0,
      result: list || [],
      offset: 0,
      limit: list.length,
    };
  };

  return (
    <PageCard
      tabList={statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      <CardOrTableComp<IApplyItem | IApprovalItem>
        rowKey={(record) => record?.Data?.id || nanoid()}
        bordered={false}
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
            operation={(item: IApplyItem | IApprovalItem) =>
              tableOperation(activeKey, item, setNeedReload)
            }
            statusType={(item) => renderItemStatus(item.Data)}
            targetOrTeam="market"
          />
        )}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              'selectedRows: ',
              selectedRows,
            );
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={() => handleApproveSelect(selectedRowKeys)}>批量同意</a>
              <a>批量拒绝</a>
            </Space>
          );
        }}
      />
    </PageCard>
  );
};

export default TodoStore;
