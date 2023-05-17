import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { MenuType } from '../config/menuType';
import FileSystem from './FileSystem';
import ThingIndex from '@/pages/Store/content/Thing';
import TaskListComp from '../components/TaskListComp';
import { Badge, Typography } from 'antd';
import { FaTasks } from 'react-icons/fa';
import { IForm, IPropClass, ISpeciesItem, SpeciesType } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case MenuType.FileSystemItem:
      return <FileSystem current={props.selectMenu.item} />;
    case MenuType.Species:
      {
        const species = props.selectMenu.item as ISpeciesItem;
        switch (species.metadata.typeName) {
          case SpeciesType.Store: {
            const propClass = props.selectMenu.item as IPropClass;
            return (
              <ThingIndex
                belongId={propClass.belongId}
                labels={[`S${propClass.id}`]}
                forms={[]}
                propertys={propClass.propertys}
              />
            );
          }
        }
      }
      return <></>;
    case MenuType.Form: {
      const form = props.selectMenu.item as IForm;
      const propertys = [];
      for (const item of form.attributes) {
        if (item.linkPropertys && item.linkPropertys.length > 0) {
          item.linkPropertys[0].name = item.name;
          propertys.push(item.linkPropertys[0]);
        }
      }
      return (
        <ThingIndex
          belongId={form.metadata.belongId}
          labels={[`S${form.id}`]}
          forms={[form]}
          propertys={propertys}
        />
      );
    }
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
