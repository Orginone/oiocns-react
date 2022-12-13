import CardOrTableComp from '@/components/CardOrTableComp';
import TableHeaderOptions from '@/components/TableHeaderOptions';
import PageCard from '@/components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import React, { useState, useEffect } from 'react';
import { SettingFilled } from '@ant-design/icons';
import { statusList, tableOperation, statusMap } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { XRelation } from '@/ts/base/schema';
import { TargetType } from '@/ts/core/enum';
import { PageRequest } from '@/ts/base/model';

// 生成说明数据
const remarkText = (activeKey: string, item: XRelation) => {
  return activeKey === '3'
    ? '请求添加' + item?.team?.name + '为好友'
    : item?.target?.name + '请求添加好友';
};

// 根据状态值渲染标签
const renderItemStatus = (record: XRelation) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};

// 卡片渲染
type TodoCommonTableProps = {};
/**
 * 办事-好友申请
 * @returns
 */
const TodoFriend: React.FC<TodoCommonTableProps> = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [openHeaderSetting, setOpenHeaderSetting] = useState<boolean>(false);
  const [newColumns, setNColumns] = useState<ProColumns<IApplyItem | IApprovalItem>[]>();
  const columns: ProColumns<IApplyItem | IApprovalItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '说明',
      dataIndex: ['Data', 'remark'],
      render: (_, row) => {
        return remarkText(activeKey, row.Data);
      },
    },
    {
      title: '事项',
      dataIndex: ['Data', 'team', 'target', 'typeName'],
      render: () => {
        return <Tag color="#5BD8A6">好友</Tag>;
      },
    },
    {
      title: '申请人',
      dataIndex: ['Data', 'target', 'name'],
    },
    {
      title: '状态',
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
    const data = await todoCtrl.OrgTodo[listStatusCode[activeKey]](
      activeKey === '1' ? needReload : null,
    );
    const list = data.filter(
      (n: IApprovalItem | IApplyItem) =>
        n.Data.team.target.typeName === TargetType.Person,
    );
    setNeedReload(false);
    return {
      total: list.length || 0,
      result: list || [],
      offset: 0,
      limit: list.length,
    };
  };
  useEffect(() => {
    setNColumns(columns);
  }, [needReload]);
  const handleOk = (data: any[]) => {
    setNColumns([...data]);
  };
  return (
    <PageCard
      tabList={statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}
      tabBarExtraContent={
        <Space>
          <SettingFilled
            onClick={() => {
              setOpenHeaderSetting(true);
            }}
          />
        </Space>
      }>
      <TableHeaderOptions<IApplyItem | IApprovalItem>
        plainOptions={columns}
        open={openHeaderSetting}
        handleOk={(data) => handleOk(data)}
        onCancel={() => setOpenHeaderSetting(false)}
      />
      <CardOrTableComp<IApplyItem | IApprovalItem>
        rowKey={(record: IApplyItem | IApprovalItem) => record.Data?.id}
        dataSource={[]}
        columns={newColumns}
        params={{ activeKey, needReload }}
        request={async (page) => await loadList(page)}
        operation={(item: IApplyItem | IApprovalItem) =>
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<IApplyItem | IApprovalItem>
            data={arr}
            statusType={(item) => renderItemStatus(item.Data)}
            targetOrTeam="target"
            operation={(item) => tableOperation(activeKey, item, setNeedReload)}
          />
        )}
      />
    </PageCard>
  );
};

export default TodoFriend;
