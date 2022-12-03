import CardOrTableComp from '@/components/CardOrTableComp';
import TableHeaderOptions from '@/components/TableHeaderOptions';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag } from 'antd';
import friendService, { tabStatus } from '@/ts/controller/todo';
import React, { useState, useEffect } from 'react';
import { SettingFilled } from '@ant-design/icons';
import { XRelation } from '@/ts/base/schema';

// import styles from './index.module.less';
friendService.currentModel = 'friend';

// 生成说明数据
const remarkText = (activeKey: string, item: XRelation) => {
  return activeKey === '2'
    ? '请求添加' + item?.team?.name + '为好友'
    : item?.target?.name + '请求添加好友';
};

// 根据状态值渲染标签
const renderItemStatus = (record: XRelation) => {
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
  const [pageData, setPageData] = useState<XRelation[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [newColumns, setNewColumns] = useState<ProColumns<XRelation>[]>();
  const columns: ProColumns<XRelation>[] = [
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
        return remarkText(friendService.activeStatus, row);
      },
    },
    {
      title: '事项',
      dataIndex: ['team', 'target', 'typeName'],
      render: () => {
        return <Tag color="#5BD8A6">好友</Tag>;
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
  const loadList = async () => {
    setPageData([...friendService.currentList]);
    setPageTotal(friendService.currentList ? friendService.currentList.length : 0);
    setNeedReload(false);
  };
  useEffect(() => {
    friendService.activeStatus = activeKey as tabStatus;
    loadList();
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
          <SettingFilled
            onClick={() => {
              setOpenHeaderSetting(true);
            }}
          />
        </Space>
      }>
      <TableHeaderOptions<XRelation>
        plainOptions={columns}
        open={openHeaderSetting}
        handleOk={(data) => handleOk(data)}
        onCancel={() => setOpenHeaderSetting(false)}
      />
      <CardOrTableComp<XRelation>
        rowKey={'id'}
        // bordered={false}
        columns={newColumns}
        dataSource={pageData}
        total={total}
        onChange={loadList}
        operation={(item: XRelation) => friendService.tableOperation(item, setNeedReload)}
        renderCardContent={(arr) => (
          <TableItemCard<XRelation>
            data={arr}
            statusType={(item) => renderItemStatus(item)}
            targetOrTeam="target"
            operation={(item) => friendService.tableOperation(item, setNeedReload)}
          />
        )}
      />
    </PageCard>
  );
};

export default TodoFriend;
