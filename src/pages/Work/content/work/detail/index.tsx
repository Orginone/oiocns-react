import { ITodo, WorkTodo } from '@/ts/core/work/todo';
import FlowDetail from './flowDetail';
import React from 'react';
import orgCtrl from '@/ts/controller';
import { ISpeciesItem } from '@/ts/core';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';

interface IProps {
  todo: ITodo;
  species?: ISpeciesItem;
  onBack: (succcess: boolean) => void;
}

const ContentIndex = ({ todo, onBack, species }: IProps) => {
  let space =
    orgCtrl.user.companys.find((a) => a.metadata.id == todo.belongId) || orgCtrl.user;
  /** 加载内容区 */
  switch (todo.typeName) {
    case '事项':
      return (
        <FlowDetail
          todo={todo as WorkTodo}
          species={species as IWorkItem}
          space={space}
          onBack={onBack}
        />
      );
    default:
      return <></>;
  }
};

export default ContentIndex;
