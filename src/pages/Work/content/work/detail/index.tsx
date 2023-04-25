import ITodo from '@/ts/core/target/work/todo';
import FlowDetail from './flowDetail';
import React from 'react';
import orgCtrl from '@/ts/controller';

interface IProps {
  todo: ITodo;
  onBack: (succcess: boolean) => void;
}

const ContentIndex = ({ todo, onBack }: IProps) => {
  let space =
    orgCtrl.user.joinedCompany.find((a) => a.id == todo.spaceId) || orgCtrl.user;
  /** 加载内容区 */
  switch (todo.type) {
    case '事项':
      return <FlowDetail todo={todo} space={space} onBack={onBack} />;
    default:
      return <></>;
  }
};

export default ContentIndex;
