import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import FileSystem from './FileSystem';
import Thing from '@/pages/Store/content/Thing';
import Application from './App';
import TaskListComp from '../components/TaskListComp';
import { Badge, Typography } from 'antd';
import { FaTasks } from 'react-icons/fa';
import Asset from '@/pages/Welfare/WelfareOrg/Asset';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = ({ selectMenu, checkedList }: IProps) => {
  /** 加载内容区 */
  switch (selectMenu.itemType) {
    case GroupMenuType.Application:
      return <Application />;
    case GroupMenuType.FileSystemItem:
      return <FileSystem current={selectMenu.item} />;
    case GroupMenuType.Asset:
      return <Asset />;
    case GroupMenuType.Thing:
    case GroupMenuType.Wel:
      return <Thing current={selectMenu.item} checkedList={checkedList} />;
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
