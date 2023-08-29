import ShareShowComp from '@/components/Common/ShareShowComp';
import CustomTree from '@/components/CustomTree';
import { XEntity, XFileInfo } from '@/ts/base/schema';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import { IBaseFileInfo, ILink } from '@/ts/core/thing/config';
import { ConfigColl } from '@/ts/core/thing/directory';
import { Button, Input, Modal, Space, TreeProps } from 'antd';
import React, { Key, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import cls from './index.module.css';
import { linkCmd } from '@/ts/base/common/command';

interface IProps {
  current: ILink;
}

export const NodeTools = ({ current }: IProps) => {
  const onClick = (collName: ConfigColl) => {
    let selected: IEntity<XEntity>[] = [];
    Modal.confirm({
      icon: <></>,
      width: 800,
      content: (
        <Selector
          current={current.directory.target as IBelong}
          onChange={(files) => (selected = files)}
          loadItems={async (current: IDirectory) => {
            return current.loadConfigs(collName);
          }}
        />
      ),
      onOk: () => {
        switch (collName) {
          case ConfigColl.Requests:
          case ConfigColl.Mappings:
            linkCmd.emitter('main', 'insertRequest', selected);
            break;
          case ConfigColl.Scripts:
            linkCmd.emitter('main', 'insertScript', selected);
            break;
        }
      },
    });
  };
  return (
    <Space>
      <Button onClick={() => onClick(ConfigColl.Requests)}>插入 Request</Button>
      <Button onClick={() => onClick(ConfigColl.Scripts)}>插入 Script</Button>
      <Button onClick={() => onClick(ConfigColl.Mappings)}>插入 Mapping</Button>
    </Space>
  );
};

interface IExtends<X extends XEntity> {
  current: IBelong;
  multiple?: boolean;
  onChange: (files: IEntity<X>[]) => void;
  onOk?: () => void;
  loadItems: (current: IDirectory) => Promise<IEntity<XEntity>[]>;
}

export const Selector = ({
  multiple = true,
  current,
  onChange,
  loadItems,
}: IExtends<XEntity>) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);
  const [selected, setSelected] = useState<IEntity<XEntity>[]>([]);

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    let configs = await loadItems(directory);
    setCenterTreeData(
      configs.map((item) => {
        return {
          key: item.id,
          title: item.name,
          value: item.id,
          item: item,
          children: [],
        };
      }),
    );
  };

  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    if (Array.isArray(checkedKeys)) {
      setCenterCheckedKeys(checkedKeys);
    }
    const request: IEntity<XEntity> = (info.node as any).item;
    if (info.checked) {
      selected.push(request);
      setSelected(selected);
      onChange(selected);
    } else {
      let ans = [...selected.filter((i) => i.id != request.id)];
      setSelected(ans);
      onChange(ans);
    }
  };

  const buildWorkThingTree = (directory: IDirectory[]): any[] => {
    const result: any[] = [];
    for (const item of directory) {
      result.push({
        key: item.id,
        title: item.name,
        value: item.id,
        item: item,
        children: buildWorkThingTree(item.children),
      });
    }
    return result;
  };

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    let ans = selected.filter((i) => i.id != id);
    setSelected(ans);
    onChange(ans);
  };

  return (
    <>
      <div className={cls.layout}>
        <div className={cls.content}>
          <div style={{ width: '33%' }} className={cls.left}>
            <Input
              className={cls.leftInput}
              prefix={<AiOutlineSearch />}
              placeholder="请设置关键字"
            />
            <div className={cls.leftContent}>
              <CustomTree
                checkable={false}
                autoExpandParent={true}
                onSelect={onSelect}
                treeData={buildWorkThingTree([current.directory])}
              />
            </div>
          </div>

          <div className={cls.center}>
            <Input
              className={cls.centerInput}
              prefix={<AiOutlineSearch />}
              placeholder="搜索"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
            <div className={cls.centerContent}>
              <CustomTree
                multiple={multiple}
                checkable
                checkedKeys={centerCheckedKeys}
                autoExpandParent={true}
                onCheck={onCheck}
                treeData={centerTreeData.filter((i: any) => i.title.includes(filter))}
              />
            </div>
          </div>
          {multiple && (
            <div style={{ width: '33%' }} className={cls.right}>
              <ShareShowComp departData={selected} deleteFuc={handelDel}></ShareShowComp>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Selector;
