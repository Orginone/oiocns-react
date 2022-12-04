// 应用待办
import React, { useEffect, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import { RouteComponentProps } from 'react-router-dom';
import { ProColumns } from '@ant-design/pro-components';

import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { applicationTabs, tableOperation } from '../components';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';

type RouterParams = {
  id: string;
};
const AppTodo: React.FC<RouteComponentProps<RouterParams>> = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const [pageData, setpageData] = useState<IApprovalItem[] | IApplyItem[]>();
  const [activeKey, setActiveKey] = useState<string>('1');
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const columns: ProColumns<IApprovalItem | IApplyItem>[] = [
    { title: '序号', valueType: 'index', width: 60 },
    { title: '当前流程', dataIndex: ['Data', 'flowInstance', 'title'] },
    { title: '申请人', dataIndex: ['Data', 'createUser'] },
    { title: '事项', dataIndex: ['Data', 'flowInstance', 'content'] },
    { title: '状态', dataIndex: ['Data', 'status'] },
    { title: '流程状态', dataIndex: ['Data', 'flowInstance', 'status'] },
    { title: '更新时间', dataIndex: 'updateTime', valueType: 'dateTime' },
  ];
  const loadList = async () => {
    if (id) {
      const currentTodo = todoCtrl.currentAppTodo(id);
      if (!currentTodo) {
        setpageData([]);
        return;
      }
      const code = {
        '1': 'getTodoList',
        '2': 'getDoList',
        '3': 'getApplyList',
        '4': 'getNoticeList',
      };
      const list = await currentTodo[code[activeKey]]();
      console.log(code[activeKey], list);
      setpageData(list);
      setTotal(list.length);
    }
    setNeedReload(false);
  };
  useEffect(() => {
    const id = todoCtrl.subscribe(loadList);
    return () => todoCtrl.unsubscribe(id);
  }, []);
  useEffect(() => {
    loadList();
  }, [activeKey, needReload]);

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
          rowKey={(record) => record.Data.id}
          columns={columns}
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
