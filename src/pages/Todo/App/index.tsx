// 应用待办
import React, { useEffect, useState } from 'react';
import { Tag } from 'antd';
import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import { ProColumns } from '@ant-design/pro-components';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { applicationTabs, statusMap, tableOperation } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
import { PageRequest } from '@/ts/base/model';

// 根据状态值渲染标签
const renderItemStatus = (record: any) => {
  const status = statusMap[record.status];
  return <Tag color={status.color}>{status.text}</Tag>;
};
const AppTodo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [needReload, setNeedReload] = useState<boolean>(false);
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
    { title: '事项', dataIndex: ['Data', 'content'] },
    {
      title: '状态',
      dataIndex: ['Data', 'status'],
      render: (_, record) => renderItemStatus(record.Data),
    },
    { title: '创建时间', dataIndex: ['Data', 'createTime'], valueType: 'dateTime' },
  ];
  const loadList = async (page: PageRequest) => {
    if (todoCtrl.CurAppTodo) {
      const code = {
        '1': 'getTodoList',
        '2': 'getDoList',
        '3': 'getApplyList',
        '4': 'getNoticeList',
      };
      const list = await todoCtrl.CurAppTodo[code[activeKey]](
        activeKey === '3' ? page : { offect: 0, limit: 10, filter: '' },
      );
      return {
        total: list.length || 0,
        result: list || [],
        offset: 0,
        limit: list.length,
      };
    }
    setNeedReload(false);
  };
  useEffect(() => {
    const id = todoCtrl.subscribePart('CurAppTodo', () => {
      setNeedReload(true);
    });
    return () => {
      return todoCtrl.unsubscribe(id);
    };
  }, []);

  return (
    <PageCard
      tabList={applicationTabs}
      activeTabKey={activeKey}
      onTabChange={(key: string) => {
        setActiveKey(key as string);
      }}>
      <CardOrTableComp<IApprovalItem | IApplyItem>
        dataSource={[]}
        params={{ activeKey, needReload }}
        rowKey={(record) => record?.Data?.id || Math.random() * 10000}
        columns={activeKey === '3' ? applyColumns : columns}
        request={async (params) => await loadList(params)}
        operation={(item: IApplyItem | IApprovalItem) =>
          tableOperation(activeKey, item, setNeedReload)
        }
      />
    </PageCard>
  );
};

export default AppTodo;
