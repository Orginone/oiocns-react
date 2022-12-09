// 应用待办
import React, { useEffect, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import { ProColumns } from '@ant-design/pro-components';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { applicationTabs, statusMap, tableOperation } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { resetParams } from '@/utils/tools';
import { Tag } from 'antd';

// 根据状态值渲染标签
const renderItemStatus = (record: any) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
const AppTodo: React.FC = () => {
  const [pageData, setpageData] = useState<IApprovalItem[] | IApplyItem[]>();
  const [activeKey, setActiveKey] = useState<string>('1');
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const columns: ProColumns<IApprovalItem>[] = [
    { title: '序号', valueType: 'index', width: 60 },
    { title: '当前流程', dataIndex: ['Data', 'flowInstance', 'title'] },
    { title: '申请人', dataIndex: ['Data', 'createUser'] },
    { title: '事项', dataIndex: ['Data', 'flowInstance', 'content'] },
    {
      title: '状态',
      dataIndex: ['Data', 'status'],
      render: (_, record) => renderItemStatus(record.Data),
    },
    { title: '创建时间', dataIndex: ['Data', 'createTime'], valueType: 'dateTime' },
  ];
  const applyColumns: ProColumns<IApplyItem>[] = [
    { title: '序号', valueType: 'index', width: 60 },
    { title: '标题', dataIndex: ['Data', 'title'] },
    // { title: '审核人', dataIndex: ['Data', 'title'] },
    { title: '事项', dataIndex: ['Data', 'content'] },
    {
      title: '状态',
      dataIndex: ['Data', 'status'],
      render: (_, record) => renderItemStatus(record.Data),
    },
    { title: '创建时间', dataIndex: ['Data', 'createTime'], valueType: 'dateTime' },
  ];
  const loadList = async (page: number, pageSize: number) => {
    if (todoCtrl.CurAppTodo) {
      const code = {
        '1': 'getTodoList',
        '2': 'getDoList',
        '3': 'getApplyList',
        '4': 'getNoticeList',
      };
      const list = await todoCtrl.CurAppTodo[code[activeKey]](
        activeKey === '3' ? resetParams({ page, pageSize }) : null,
      );
      console.log(code[activeKey], list);
      setpageData(list);
      setTotal(list.length);
    } else {
      setpageData([]);
    }
    setNeedReload(false);
  };
  useEffect(() => {
    loadList(1, 10); //监听
    const id = todoCtrl.subscribePart('CurAppTodo', () => {
      loadList(1, 10); //监听
    });
    return () => {
      return todoCtrl.unsubscribe(id);
    };
  }, [activeKey, needReload, location.pathname]);

  return (
    <PageCard
      tabList={applicationTabs}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      {pageData && (
        <CardOrTableComp<IApprovalItem | IApplyItem>
          dataSource={pageData}
          rowKey={(record) => record?.Data?.id || Math.random() * 10000}
          columns={activeKey === '3' ? applyColumns : columns}
          total={total}
          onChange={loadList}
          operation={(item: IApplyItem | IApprovalItem) =>
            tableOperation(activeKey, item, setNeedReload)
          }
        />
      )}
    </PageCard>
  );
};

export default AppTodo;
