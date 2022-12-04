import CardOrTableComp from '@/components/CardOrTableComp';
import { Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';
import TableItemCard from '../components/TableItemCard';
import { ProColumns } from '@ant-design/pro-components';
import { TargetType } from '@/ts/core/enum';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { XRelation } from '@/ts/base/schema';
import { statusList, statusMap, tableOperation } from '../components';

// 生成说明数据
const remarkText = (activeKey: string, item: XRelation) => {
  return activeKey === '3'
    ? '请求加入' + item?.team?.name
    : item?.target?.name + '请求加入' + item?.team?.name;
};

// 根据状态值渲染标签
const renderItemStatus = (record: XRelation) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
/**
 * 办事-单位审核
 * @returns
 */
const TodoOrg: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [pageData, setPageData] = useState<IApplyItem[] | IApprovalItem[]>([]);
  const [total, setPageTotal] = useState<number>(0);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<IApplyItem | IApprovalItem>[] = [
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
        return remarkText(activeKey, row.Data);
      },
    },
    {
      title: '事项',
      dataIndex: ['Data', 'team', 'target', 'typeName'],
      render: (_) => {
        return <Tag color="#5BD8A6">{_}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: ['Data', 'status'],
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
  const loadList = async (page: number, pageSize: number) => {
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
        n.Data.team.target.typeName !== TargetType.Person,
    );
    setPageData(list);
    setPageTotal(list.length);
    setNeedReload(false);
  };
  useEffect(() => {
    setPageData([]);
    setPageTotal(0);
    loadList(1, 10);
  }, [activeKey, needReload]);
  return (
    <PageCard
      tabList={statusList}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      <CardOrTableComp<IApplyItem | IApprovalItem>
        rowKey={(record: IApplyItem | IApprovalItem) => record.Data?.id}
        bordered={false}
        columns={columns}
        dataSource={pageData}
        total={total}
        onChange={loadList}
        operation={(item: IApplyItem | IApprovalItem) =>
          tableOperation(activeKey, item, setNeedReload)
        }
        renderCardContent={(arr) => (
          <TableItemCard<IApplyItem | IApprovalItem>
            data={arr}
            statusType={(item) => renderItemStatus(item.Data)}
            targetOrTeam="target"
            operation={(item: IApplyItem | IApprovalItem) =>
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
