import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tag } from 'antd';
import appService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { DataType } from 'typings/globelType';
import { schema } from '@/ts/base';

appService.currentModel = 'product';

/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  // if (ids.length > 0) {
  //   const { success } = await appService.approve(ids.toString());
  //   if (success) {
  //     message.success('添加成功！');
  //   } else {
  //     message.error('抱歉，提交失败');
  //   }
  // }
};
// 根据状态值渲染标签
const renderItemStatus = (record: schema.XMerchandise) => {
  const status = appService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
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
  const [pageData, setPageData] = useState<schema.XMerchandise[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<schema.XMerchandise>[] = [
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
        return record.market?.name;
      },
    },
    {
      title: '应用名称',
      dataIndex: 'code',
      render: (_, record) => {
        return (
          <Space>
            {record.product?.name}
            <Tag color="#5BD8A6">{record.product?.source}</Tag>
          </Space>
        );
      },
    },
    {
      title: '应用编号',
      dataIndex: 'code',
      render: (_, record) => {
        return record.product?.code;
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
        return record.product?.authority;
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
  const LoadList = () => {
    setPageData([...appService.currentList]);
    setPageTotal(appService.currentList.length);
    setNeedReload(false);
  };

  useEffect(() => {
    appService.activeStatus = activeKey as tabStatus;
    LoadList();
    setSelectedRowKeys([]);
  }, [activeKey, needReload]);

  return (
    <PageCard
      tabList={appService.statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}
      tabBarExtraContent={''}>
      <CardOrTableComp
        rowKey={'id'}
        columns={columns}
        dataSource={pageData}
        total={total}
        onChange={LoadList}
        operation={(item: schema.XMerchandise) =>
          appService.tableOperation(item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<schema.XMerchandise>
            data={arr}
            statusType={(item) => renderItemStatus(item)}
            targetOrTeam="product"
            operation={(item) => appService.tableOperation(item, setNeedReload)}
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
