import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import * as im from '@/icons/im';
import { MenuItemType } from '../../../../../../typings/globelType';
import { Command } from '../../../../../ts/base';
import { IDirectory } from '../../../../../ts/core';
import RequestForm from '../../../entityForm/requestForm';
import RequestLayout from './main';
import { loadEntity } from '../..';

interface IProps {
  cmd: Command;
  dir: IDirectory;
}

const Top: React.FC<IProps> = ({ cmd, dir }) => {
  // 状态
  const [tabs, setTabs] = useState<MenuItemType[]>([]);
  const [curTab, setCurTab] = useState<MenuItemType | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [curDir, setCurDir] = useState<IDirectory>(dir);

  // 监听
  useEffect(() => {
    const id = cmd.subscribe((_type: string, cmd: string, args: any) => {
      if (cmd == 'onSelect') {
        const menu = args as MenuItemType;
        if (menu.itemType == '请求') {
          setCurTab(menu);
          updateTabs(menu);
        } else {
          setCurDir(menu.item);
        }
      }
    });
    return () => {
      cmd.unsubscribe(id);
    };
  });

  const remove = (key: any) => {
    // 设置当前菜单项
    let index = tabs?.findIndex((item) => item.key == key);
    let temp = tabs?.filter((_, item) => item != index);
    setTabs(temp);

    // 设置当前 Tab
    if (temp.length > 0) {
      setCurTab(temp[0]);
    } else {
      setCurTab(undefined);
    }
  };

  const updateTabs = (tab: MenuItemType) => {
    let index = tabs.findIndex((item) => item.key == tab.key);
    if (index == -1) {
      setTabs([...tabs, tab]);
    }
  };

  const onEdit = (key: any, action: string) => {
    if (action == 'remove') {
      remove(key);
    } else if (action == 'add') {
      setOpen(true);
    }
  };
  return (
    <>
      <Tabs
        type="editable-card"
        activeKey={curTab?.key}
        style={{ marginLeft: 10 }}
        items={tabs.map((tab) => {
          return {
            key: tab.key,
            label: tab.label,
          };
        })}
        addIcon={
          <div
            style={{
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <im.ImPlus />
          </div>
        }
        onChange={(key) => {
          let tab = tabs.find((item) => item.key == key);
          if (tab) {
            cmd.emitter('', 'onTabSelected', tab);
          }
        }}
        onEdit={onEdit}
      />
      {curTab && <RequestLayout current={curTab.item} />}
      {open && (
        <RequestForm
          current={curDir}
          cancel={() => setOpen(false)}
          finished={(request) => {
            setOpen(false);
            cmd.emitter('', 'onAdd', loadEntity(request));
          }}
        />
      )}
    </>
  );
};

export default Top;
