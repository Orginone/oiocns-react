import CardOrTableComp from '@/components/CardOrTableComp';
import TableHeaderOptions from '@/components/TableHeaderOptions';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
// import friendService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { SettingFilled } from '@ant-design/icons';
import { statusList, tableOperation, statusMap } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { XRelation } from '@/ts/base/schema';
import { TargetType } from '@/ts/core/enum';

// import styles from './index.module.less';
// friendService.currentModel = 'friend';

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
const handleClick = (key: string, item: any) => {
  switch (key) {
    case '1':
      break;
  }
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
  const [pageData, setPageData] = useState<IApplyItem[] | IApprovalItem[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [newColumns, setNewColumns] =
    useState<ProColumns<IApplyItem | IApprovalItem>[]>();
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
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        return renderItemStatus(record.Data);
      },
    },
    {
      title: '申请人',
      dataIndex: ['Data', 'target', 'name'],
    },
    {
      title: '申请时间',
      dataIndex: ['Data', 'createTime'],
      valueType: 'dateTime',
    },
  ];
  // 获取申请/审核列表
  const loadList = async (params: { page: number; pageSize: number }) => {
    const listStatusCode = {
      '2': 'getDoList',
      '3': 'getApplyList',
    };
    if (activeKey === '1') {
      const data = await todoCtrl.OrgTodo.getTodoList(needReload);
      setPageData(data.filter((n) => n.Data.team.target.typeName === TargetType.Person));
      setPageTotal(data.length);
    } else {
      const data = await todoCtrl.OrgTodo[listStatusCode[activeKey]](needReload);
      setPageData(data.filter((n) => n.Data.team.target.typeName === TargetType.Person));
      setPageTotal(data.length);
    }

    setNeedReload(false);
  };
  useEffect(() => {
    loadList({ page: 1, pageSize: 10 });
  }, [activeKey, needReload]);
  useEffect(() => {
    setNewColumns(columns);
  }, [activeKey]);
  const handleOk = (data: any[]) => {
    console.log(data);
    setNewColumns([...data]);
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
      <TableHeaderOptions<IApplyItem>
        plainOptions={columns}
        open={openHeaderSetting}
        handleOk={(data) => handleOk(data)}
        onCancel={() => setOpenHeaderSetting(false)}
      />
      <CardOrTableComp<IApplyItem>
        rowKey={(record) => record?.Data?.id}
        // bordered={false}
        columns={newColumns}
        dataSource={pageData}
        total={total}
        onChange={loadList}
        operation={(item: IApplyItem) => tableOperation(activeKey, item, handleClick)}
        renderCardContent={(arr) => (
          <TableItemCard<IApplyItem>
            data={arr}
            statusType={(item) => renderItemStatus(item)}
            targetOrTeam="target"
            operation={(item) => tableOperation(activeKey, item, handleClick)}
          />
        )}
      />
    </PageCard>
  );
};

export default TodoFriend;
