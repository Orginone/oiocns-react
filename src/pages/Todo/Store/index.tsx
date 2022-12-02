import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tag, Typography } from 'antd';
import storeService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { DataType } from 'typings/globelType';
// import styles from './index.module.less';
storeService.currentModel = 'store';
/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  // if (ids.length > 0) {
  //   const { success } = await storeService.approve(ids.toString());
  //   if (success) {
  //     message.success('添加成功！');
  //   } else {
  //     message.error('抱歉，提交失败');
  //   }
  // }
};

// 根据状态值渲染标签
const renderItemStatus = (record: MarketApprovalType) => {
  const status = storeService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};

// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-加入市场审批
 * @returns
 */
const TodoStore: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>(storeService.activeStatus);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageData, setPageData] = useState<MarketApprovalType[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<MarketApprovalType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '市场名称',
      dataIndex: 'market.name',
      render: (_, row) => {
        return row?.market.name;
      },
    },
    {
      title: '市场编码',
      dataIndex: 'code',
      render: (_, row) => {
        return (
          <Typography.Paragraph copyable={{ text: row?.market.code }}>
            {row?.market.code}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: '状态 ',
      dataIndex: 'status',
      valueType: 'select',
      render: (_, record) => {
        return renderItemStatus(record);
      },
    },
    {
      title: '申请人',
      dataIndex: '',
      hideInTable: activeKey === '2',
      render: (_, row) => {
        return row.target ? row.target.name : '本人';
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];

  // 获取申请/审核列表
  const handlePageChange = async () => {
    setPageData([...storeService.currentList]);
    setPageTotal(storeService.currentList.length);
    setNeedReload(false);
  };
  useEffect(() => {
    storeService.activeStatus = activeKey as tabStatus;
    handlePageChange();
    setSelectedRowKeys([]);
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={storeService.statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}
      tabBarExtraContent={
        <Space>
          <Button
            key="approve"
            type="primary"
            onClick={() => handleApproveSelect(selectedRowKeys)}>
            同意
          </Button>
          <Button key="2">拒绝</Button>
          <Button key="3">打印</Button>
        </Space>
      }>
      <CardOrTableComp
        rowKey={'id'}
        bordered={false}
        columns={columns}
        dataSource={pageData}
        total={total}
        onChange={handlePageChange}
        operation={(item: MarketApprovalType) =>
          storeService.tableOperation(item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<MarketApprovalType>
            data={arr}
            operation={(item: MarketApprovalType) =>
              storeService.tableOperation(item, setNeedReload)
            }
            statusType={(item) => renderItemStatus(item)}
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
