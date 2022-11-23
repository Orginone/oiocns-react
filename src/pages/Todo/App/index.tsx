// 应用待办
import React from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '../components/PageCard';
import { RouteComponentProps } from 'react-router-dom';
import todoService /*, { tabStatus }*/ from '@/ts/controller/todo';

const AppTodo: React.FC<RouteComponentProps> = () => {
  return (
    <PageCard tabList={todoService.statusList}>
      <CardOrTableComp dataSource={[]} rowKey={''} />
    </PageCard>
  );
};

export default AppTodo;
