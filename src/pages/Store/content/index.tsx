import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { MenuType } from '../config/menuType';
import FileSystem from './FileSystem';
import ThingIndex from '@/pages/Store/content/Thing';
import Application from './InnerApp';
import TaskListComp from '../components/TaskListComp';
import { Badge, Typography } from 'antd';
import { FaTasks } from 'react-icons/fa';

interface IProps {
  selectMenu: MenuItemType;
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case MenuType.Application:
      return <Application current={props.selectMenu.item} />;
    case MenuType.FileSystemItem:
      return <FileSystem current={props.selectMenu.item} />;
    case MenuType.Species:
      return <ThingIndex species={props.selectMenu.item} />;
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
    case MenuType.FileSystemItem:
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
