import CardOrTableComp from '@/components/CardOrTableComp';
import { TeamApprovalType } from '@/module/todo/typings';
import { Button, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';

import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-components';
import todoService, { tabStatus } from '@/ts/controller/todo';
// import { IdPage } from '@/module/typings';

// todoService.currentModel = `org`;

// 生成说明数据
const remarkText = (activeKey: string, item: TeamApprovalType) => {
  return activeKey === '2'
    ? '请求加入' + item.team.name + '单位'
    : item.target.name + '请求加入单位';
};
// 生成说明数据
const tableOperation = (
  activeKey: string,
  item: TeamApprovalType,
  callback: Function,
) => {
  return activeKey == '1'
    ? [
        {
          key: 'approve',
          label: '同意',
          onClick: () => {
            todoService.approve(item.id).then(({ success }) => {
              if (success) {
                callback.call(callback, true);
              }
            });
            console.log('同意', 'approve', item);
          },
        },
        {
          key: 'refuse',
          label: '拒绝',
          onClick: () => {
            todoService.refuse(item.id).then(({ success }) => {
              if (success) {
                callback.call(callback, true);
              }
            });
            console.log('拒绝', 'back', item);
          },
        },
      ]
    : [
        {
          key: 'retractApply',
          label: '取消申请',
          onClick: () => {
            todoService.retractApply(item.id).then(({ success }) => {
              if (success) {
                callback.call(callback, true);
              }
            });
            console.log('取消申请', 'approve', item);
          },
        },
      ];
};

// 根据状态值渲染标签
const renderItemStatus = (record: TeamApprovalType) => {
  const status = todoService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
/**
 * 办事-单位审核
 * @returns
 */
const TodoOrg: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [pageData, setPageData] = useState<TeamApprovalType[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<TeamApprovalType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '说明',
      dataIndex: 'remark',
      render: (_, row) => {
        return remarkText(activeKey, row);
      },
    },
    {
      title: '事项',
      dataIndex: 'name',
      render: () => {
        return <Tag color="#5BD8A6">加单位</Tag>;
      },
    },
    {
      title: '申请人',
      dataIndex: '',
      render: (_, row) => {
        return row.target.name;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  // 获取申请/审核列表
  const handlePageChange = async (page: number, pageSize: number) => {
    const { data = [], total = 0 } = await todoService.getList<TeamApprovalType, IdPage>({
      id: '0',
      page: page,
      pageSize: pageSize,
    });
    setPageData(data);
    setPageTotal(total);
  };
  useEffect(() => {
    todoService.activeStatus = activeKey as tabStatus;
    handlePageChange(1, 12);
  }, [activeKey, needReload]);
  return (
    <PageCard
      tabList={todoService.statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}
      tabBarExtraContent={
        <Space>
          <Button key="1" type="primary">
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
        operation={(item: TeamApprovalType) =>
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<TeamApprovalType>
            data={arr}
            statusType={(item) => renderItemStatus(item)}
            targetOrTeam="team"
            operation={(item: TeamApprovalType) =>
              tableOperation(activeKey, item, setNeedReload)
            }
          />
        )}
        rowSelection={{}}
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

export default TodoOrg;
