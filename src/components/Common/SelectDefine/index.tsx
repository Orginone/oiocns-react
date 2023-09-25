/* eslint-disable no-unused-vars */
import { TreeProps } from 'antd';
import CustomTree from '@/components/CustomTree';
import React, { useState } from 'react';
import cls from './index.module.less';
import { IApplication, IBelong, ITarget, IDirectory } from '@/ts/core';
import { XWorkDefine } from '@/ts/base/schema';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
interface Iprops {
  belong: IBelong;
  excludeIds: string[];
  onChecked: (select: XWorkDefine) => void;
}
const SelectDefine = (props: Iprops) => {
  const [apps, setApps] = useState<any[]>([]);
  const [directorys, setDirectorys] = useState<any[]>([]);
  const [defines, setDefines] = useState<any[]>([]);

  const loadTargetMenu = (targets: ITarget[]): any[] => {
    return targets.map((a) => {
      return {
        key: a.id,
        title: a.name,
        item: a,
        icon: <EntityIcon entityId={a.id} typeName={a.typeName} size={18} />,
        children: loadTargetMenu(a.subTarget),
      };
    });
  };

  const loadDircetoryMenu = (dircetory: IDirectory[]): any[] => {
    return dircetory.map((a) => {
      return {
        key: a.id,
        title: a.name,
        item: a,
        icon: <EntityIcon entityId={a.id} typeName={a.typeName} size={18} />,
        children: loadDircetoryMenu(a.children),
      };
    });
  };

  const loadApplicationMenu = (dircetory: IApplication[]): any[] => {
    return dircetory.map((a) => {
      return {
        key: a.id,
        title: a.name,
        item: a,
        icon: <EntityIcon entityId={a.id} typeName={a.typeName} size={18} />,
        children: loadApplicationMenu(a.children),
      };
    });
  };

  const onSelectTarget: TreeProps['onSelect'] = async (_, info: any) => {
    setDirectorys(loadDircetoryMenu([(info.node.item as ITarget).directory]));
  };

  const onSelectDirectory: TreeProps['onSelect'] = async (_, info: any) => {
    setApps(loadApplicationMenu((info.node.item as IDirectory).applications));
  };

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const app: IApplication = info.node.item;
    if (app) {
      const res = await app.loadWorks();
      setDefines(
        res
          .filter((s: any) => !props.excludeIds.includes(s.id))
          .map((s: any) => {
            return {
              key: s.id,
              title: s.name,
              item: s.metadata,
              icon: <EntityIcon entityId={s.id} typeName={s.typeName} size={18} />,
              children: [],
            };
          }),
      );
    }
  };

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div className={`${cls.newLeftContent}`}>
          <CustomTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={loadTargetMenu(props.belong.shareTarget)}
            onSelect={onSelectTarget}
          />
        </div>
        <div className={`${cls.newLeftContent}`}>
          <CustomTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={directorys}
            onSelect={onSelectDirectory}
          />
        </div>
        <div className={`${cls.newLeftContent}`}>
          <CustomTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={apps}
            onSelect={onSelect}
          />
        </div>
        <div className={`${cls.newCenter}`}>
          <CustomTree
            className={cls.docTree}
            searchable
            showIcon
            autoExpandParent={true}
            onSelect={(_: any, info: any) => {
              props.onChecked.apply(this, [info.node.item]);
            }}
            treeData={defines}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectDefine;
