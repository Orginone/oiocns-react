import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProductApprovalType } from '@/module/todo/typings';
import { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space, Tag } from 'antd';
import appService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
// import { Page } from '@/module/typings';

// import styles from './index.module.less';
// appService.currentModel = 'app';

/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  if (ids.length > 0) {
    const { success } = await appService.approve(ids.toString());
    if (success) {
      message.success('添加成功！');
    } else {
      message.error('抱歉，提交失败');
    }
  }
};
// 根据状态值渲染标签
const renderItemStatus = (record: ProductApprovalType) => {
  const status = appService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};

// 生成说明数据
const tableOperation = (
  activeKey: string,
  item: ProductApprovalType,
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
            handleFunction(appService.approve(item.id, 100)); // 0-100 待批 //100-200 已批 200 以上是拒绝
            console.log('同意', 'approve', item);
          },
        },
        {
          key: 'refuse',
          label: '拒绝',
          onClick: () => {
            handleFunction(appService.refuse(item.id, 201));
            console.log('拒绝', 'back', item);
          },
        },
      ]
    : [
        {
          key: 'retractApply',
          label: '取消申请',
          onClick: () => {
            handleFunction(appService.retractApply(item.id));

            console.log('同意', 'approve', item);
          },
        },
      ];
};

// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-应用上架审批
 * @returns
 */
const TodoStore: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>(appService.activeStatus);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageData, setPageData] = useState<ProductApprovalType[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<ProductApprovalType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '市场名称',
      dataIndex: 'name',
      render: (_, record) => {
        return record.market.name;
      },
    },
    {
      title: '应用名称',
      dataIndex: 'code',
      render: (_, record) => {
        return (
          <Space>
            {record.product.name}
            <Tag color="#5BD8A6">{record.product.source}</Tag>
          </Space>
        );
      },
    },
    {
      title: '应用编号',
      dataIndex: 'code',
      render: (_, record) => {
        return record.product.code;
      },
    },
    {
      title: '价格/使用期限',
      dataIndex: 'code',
      render: (_, record) => {
        return (
          <Space>
            {record?.price || '0.00'}
            <Tag>使用期：{record.days} 天</Tag>
          </Space>
        );
      },
    },
    {
      title: '应用类型',
      dataIndex: 'code',
      render: (_, record) => {
        return record.product?.typeName;
      },
    },
    {
      title: '应用权限',
      dataIndex: 'sellAuth',
      render: (_, record) => {
        return record.product.authority;
      },
    },
    // {
    //   title: '申请人',
    //   dataIndex: '',
    //   render: (_, row) => {
    //     return row.target.name;
    //   },
    // },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  // 获取申请/审核列表
  const handlePageChange = async (page: number, pageSize: number) => {
    const { data = [], total } = await appService.getList<
      ProductApprovalType,
      PageParams
    >({
      filter: '',
      page: page,
      pageSize: pageSize,
    });
    setPageData(data);
    setPageTotal(total);
  };
  useEffect(() => {
    appService.activeStatus = activeKey as tabStatus;
    handlePageChange(1, 12);
    setSelectedRowKeys([]);
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={appService.statusList}
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
        operation={(item: ProductApprovalType) =>
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<ProductApprovalType>
            data={arr}
            statusType={(item) => renderItemStatus(item)}
            targetOrTeam="product"
            operation={(item) => tableOperation(activeKey, item, setNeedReload)}
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
              <a>批量同意</a>
              <a>批量拒绝</a>
            </Space>
          );
        }}
      />
    </PageCard>
  );
};

export default TodoStore;
