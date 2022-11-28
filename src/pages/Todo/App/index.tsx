// 应用待办
import React, { useEffect, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import { RouteComponentProps } from 'react-router-dom';
import todoService, { tabStatus } from '@/ts/controller/todo';
import sidebar from '@/ts/controller/todo/sidebar';
import { ProColumns } from '@ant-design/pro-components';
import {
  XFlowInstanceItem,
  XFlowTaskHistoryItem,
  XFlowTaskItem,
} from '@/ts/core/todo/interface';

todoService.currentModel = 'application';
type RouterParams = {
  id: string;
};
const AppTodo: React.FC<RouteComponentProps<RouterParams>> = (props) => {
  const {
    location,
    match: {
      params: { id },
    },
  } = props;
  const [pageData, setpageData] = useState<any>();
  const [activeKey, setActiveKey] = useState<string>('1');
  const [needReload, setNeedReload] = useState<boolean>(false);
  const columns: ProColumns<XFlowTaskItem | XFlowTaskHistoryItem | XFlowInstanceItem>[] =
    [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 60,
      },
      {
        title: '申请人',
        dataIndex: '1',
      },
      {
        title: '事项',
        dataIndex: '2',
      },
      {
        title: '申请时间',
        dataIndex: '3',
        valueType: 'dateTime',
      },
    ];
  const loadList = async () => {
    if (todoService.applicationInstance) {
      const list = await todoService.applicationList();
      console.log(location.pathname, list);
      setpageData(list);
    }
    setNeedReload(false);
  };
  useEffect(() => {
    todoService.activeStatus = activeKey as tabStatus;
    sidebar.currentMenuId = id;
    loadList();
  }, [activeKey, needReload]);

  return (
    <PageCard tabList={todoService.applicationTabs}>
      {pageData && (
        <CardOrTableComp
          dataSource={pageData}
          rowKey={'id'}
          columns={columns}
          activeTabKey={activeKey}
          onTabChange={(key: string) => {
            setActiveKey(key as string);
          }}
        />
      )}
    </PageCard>
  );
};

export default AppTodo;
