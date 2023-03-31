import { XFlowTaskHistory } from '@/ts/base/schema';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import Approve from './Approve';
import CarbonCopy from './CarbonCopy';
import Done from './Done';
import TaskList from './TaskList';

interface IProps {
  reflashMenu: () => void;
  selectMenu: MenuItemType;
}
/**
 * 事--待办
 * @returns
 */
const WorkTodo: React.FC<IProps> = ({ selectMenu, reflashMenu }) => {
  const [pageKey, setPageKey] = useState(0);
  const [tabKey, setTabKey] = useState('1');
  const [flowTask, setFlowTask] = useState<XFlowTaskHistory>();

  useEffect(() => {
    setPageKey(0);
  }, [selectMenu]);

  switch (pageKey) {
    case 0:
      return (
        <TaskList
          selectMenu={selectMenu}
          setPageKey={setPageKey}
          setFlowTask={setFlowTask}
          pageKey={pageKey}
          tabKey={tabKey}
          setTabKey={setTabKey}
        />
      );
    case 1:
      return (
        <Approve selectMenu={selectMenu} flowTask={flowTask} setPageKey={setPageKey} />
      );
    case 2:
      return (
        <CarbonCopy selectMenu={selectMenu} flowTask={flowTask} setPageKey={setPageKey} />
      );
    case 3:
      return (
        <Done
          selectMenu={selectMenu}
          instanceId={flowTask?.instanceId}
          setPageKey={setPageKey}
        />
      );
    default:
      return <div></div>;
  }
};

export default WorkTodo;
