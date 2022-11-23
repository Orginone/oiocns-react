import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { MarketApprovalType } from '@/module/todo/typings';
import { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space, Tag, Typography } from 'antd';
import storeService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { Page } from '@/module/typings';
import { DataType } from 'typings/globelType';
// import styles from './index.module.less';

/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  if (ids.length > 0) {
    const { success } = await storeService.approve(ids.toString());
    if (success) {
      message.success('添加成功！');
    } else {
      message.error('抱歉，提交失败');
    }
  }
};

// 生成说明数据
const tableOperation = (
  activeKey: string,
  item: MarketApprovalType,
  callback: Function,
) => {
  const handleFunction = (fn: Promise<{ msg: any; success: any }>) => {
    fn.then(({ success }) => {
      if (success) {
        callback(true);
      }
    });
  };
  return activeKey == '1'
    ? [
        {
          key: 'approve',
          label: '同意',
          onClick: () => {
            handleFunction(storeService.approve(item.id, 100)); // 0-100 待批 //100-200 已批 200 以上是拒绝
            console.log('同意', 'approve', item);
          },
        },
        {
          key: 'refuse',
          label: '拒绝',
          onClick: () => {
            handleFunction(storeService.refuse(item.id, 201));
            console.log('拒绝', 'back', item);
          },
        },
      ]
    : [
        {
          key: 'retractApply',
          label: '取消申请',
          onClick: () => {
            handleFunction(storeService.retractApply(item.id));
            console.log('同意', 'approve', item);
          },
        },
      ];
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
  console.log('store');
  // 获取申请/审核列表
  const handlePageChange = async (page: number, pageSize: number) => {
    const { data = [], total } = await storeService.getList<MarketApprovalType, Page>({
      filter: '',
      page: page,
      pageSize: pageSize,
    });
    setPageData(data);
    setPageTotal(total);
  };
  useEffect(() => {
    storeService.activeStatus = activeKey as tabStatus;
    handlePageChange(1, 12);
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
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<MarketApprovalType>
            data={arr}
            operation={(item: MarketApprovalType) =>
              tableOperation(activeKey, item, setNeedReload)
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
