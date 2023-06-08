/* eslint-disable no-unused-vars */
import { TreeProps } from 'antd';
import CustomTree from '@/components/CustomTree';
import React, { useState } from 'react';
import cls from './index.module.less';
import { IApplication, IBelong, SpeciesType } from '@/ts/core';
import { XWorkDefine } from '@/ts/base/schema';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
interface Iprops {
  belong: IBelong;
  exclude: XWorkDefine;
  onChecked: (select: XWorkDefine) => void;
}
const SelectDefine = (props: Iprops) => {
  const [defines, setDefines] = useState<any[]>([]);
  const apps: any[] = [];

  props.belong.targets.forEach((t) => {
    t.species.forEach((s) => {
      if (s.typeName === SpeciesType.Application) {
        apps.push({
          key: s.id,
          title: s.name,
          item: s,
          icon: <EntityIcon entityId={s.id} typeName={s.typeName} size={18} />,
          children: [],
        });
      }
    });
  });

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const app: IApplication = info.node.item;
    if (app) {
      const res = await app.loadWorkDefines();
      setDefines(
        res
          .filter((s) => s.id != props.exclude.id)
          .map((s) => {
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
              console.log(info.node.item);
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
