import CardOrTableComp from '@/components/CardOrTableComp';
import TableHeaderOptions from '@/components/TableHeaderOptions';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { TeamApprovalType } from '@/module/todo/typings';
import { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space, Tag } from 'antd';
import friendService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { IdPage } from '@/module/typings';
import { SettingFilled } from '@ant-design/icons';
// import styles from './index.module.less';

// const friendService = new todoService('friend');
/**
 * 批量同意
 * @param ids  React.Key[] 选中的数据id数组
 */
const handleApproveSelect = async (ids: React.Key[]) => {
  if (ids.length > 0) {
    const { success } = await friendService.approve(ids.toString());
    if (success) {
      message.success('添加成功！');
    } else {
      message.error('抱歉，提交失败');
    }
  }
};
// 生成说明数据
const remarkText = (activeKey: string, item: TeamApprovalType) => {
  return activeKey === '2'
    ? '请求添加' + item.team.name + '为好友'
    : item.target.name + '请求添加好友';
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
            friendService.approve(item.id).then(({ success }) => {
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
            friendService.refuse(item.id).then(({ success }) => {
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
            friendService.retractApply(item.id).then(({ success }) => {
              if (success) {
                callback.call(callback, true);
              }
            });
            console.log('同意', 'approve', item);
          },
        },
      ];
};
// 根据状态值渲染标签
const renderItemStatus = (record: TeamApprovalType) => {
  const status = friendService.statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-好友申请
 * @returns
 */
const TodoFriend: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>(friendService.activeStatus);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [openHeaderSetting, setOpenHeaderSetting] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageData, setPageData] = useState<TeamApprovalType[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [newColumns, setNewColumns] = useState<ProColumns<TeamApprovalType>[]>();

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
        return <Tag color="#5BD8A6">加好友</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        return renderItemStatus(record);
      },
    },
    {
      title: '申请人',
      dataIndex: ['target', 'name'],
      // render: (_, row) => {
      //   return row.target.name;
      // },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  // 获取申请/审核列表
  const handlePageChange = async (page: number, pageSize: number) => {
    const { data = [], total } = await friendService.getList<TeamApprovalType, IdPage>({
      id: '0',
      page: page,
      pageSize: pageSize,
    });
    setPageData(data);
    setPageTotal(total);
  };
  useEffect(() => {
    friendService.activeStatus = activeKey as tabStatus;
    handlePageChange(1, 12);
    setSelectedRowKeys([]);
  }, [activeKey, needReload]);
  useEffect(() => {
    setNewColumns(columns);
  }, []);
  const handleOk = (data: any[]) => {
    console.log(data);
    setNewColumns([...data]);
  };
  return (
    <PageCard
      tabList={friendService.statusList}
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
          <Button key="2" onClick={() => {}}>
            拒绝
          </Button>
          <Button key="3">打印</Button>
          <SettingFilled
            onClick={() => {
              setOpenHeaderSetting(true);
            }}
          />
        </Space>
      }>
      <TableHeaderOptions<TeamApprovalType>
        plainOptions={columns}
        open={openHeaderSetting}
        handleOk={(data) => handleOk(data)}
        onCancel={() => setOpenHeaderSetting(false)}
      />
      <CardOrTableComp<TeamApprovalType>
        rowKey={'id'}
        bordered={false}
        columns={newColumns}
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

export default TodoFriend;
