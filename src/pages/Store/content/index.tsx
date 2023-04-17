import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import FileSystem from './FileSystem';
import ThingIndex from '@/pages/Store/content/Thing';
import Application from './App/innerApp';
import TaskListComp from '../components/TaskListComp';
import { Badge, Typography } from 'antd';
import { FaTasks } from 'react-icons/fa';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  if (props.checkedList && props.checkedList.length) {
    return (
      <ThingIndex
        key={props.checkedList?.length}
        species={props.selectMenu.item}
        checkedList={props.checkedList}
        selectable={false}
      />
    );
  }
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case GroupMenuType.Application:
      return <Application />;
    case GroupMenuType.FileSystemItem:
      return <FileSystem current={props.selectMenu.item} />;
    case GroupMenuType.Thing:
    case GroupMenuType.Wel:
      return (
        <ThingIndex
          species={props.selectMenu.item}
          checkedList={props.checkedList}
          selectable={false}
        />
      );
    default:
      return <></>;
  }
};

/** 工具区 */
export const TopBarExtra = ({ selectMenu }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskNum, setTaskNum] = useState(0);
  /** 加载工具区 */
  switch (selectMenu.itemType) {
    case GroupMenuType.FileSystemItem:
      return (
        <>
          <Badge count={taskNum}>
            <Typography.Link
              title="上传列表"
              onClick={() => {
                setIsOpen(true);
              }}>
              <FaTasks fontSize={18}></FaTasks>
            </Typography.Link>
          </Badge>
          <TaskListComp
            isOpen={isOpen}
            target={selectMenu.item}
            onClose={() => setIsOpen(false)}
            onProcess={(p) => {
              setTaskNum(p);
            }}
          />
        </>
      );
    default:
      return <></>;
  }
};

export default ContentIndex;
