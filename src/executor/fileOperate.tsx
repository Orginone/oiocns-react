import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { OperateModel } from '@/ts/base/model';
import { IFile } from '@/ts/core';
import { entityOperates } from '@/ts/core/public';
import React from 'react';
import { OperateMenuType } from 'typings/globelType';

/** 加载文件菜单 */
export const loadFileMenus = (file: IFile, mode: number = 0) => {
  const operates: OperateModel[] = [];
  if (file.groupTags.includes('已删除')) {
    if (file.directory.target.hasRelationAuth()) {
      operates.push(entityOperates.Restore, entityOperates.HardDelete);
    }
    operates.push(entityOperates.Remark);
  } else {
    operates.push(...file.operates(mode));
  }
  return operates
    .sort((a, b) => a.sort - b.sort)
    .map((o) => {
      return {
        key: o.cmd,
        label: o.label,
        model: o.model ?? 'inside',
        icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={16} />,
        beforeLoad: async () => {
          command.emitter('config', o.cmd, file);
          return true;
        },
        children: o.menus
          ?.sort((a, b) => a.sort - b.sort)
          .map((s) => {
            return {
              key: s.cmd,
              label: s.label,
              icon: <TypeIcon iconType={s.iconType} size={16} />,
              beforeLoad: async () => {
                command.emitter('config', s.cmd, file);
                return true;
              },
            };
          }),
      } as OperateMenuType;
    });
};
