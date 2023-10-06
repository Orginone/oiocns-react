import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { IFile } from '@/ts/core';
import React from 'react';
import { OperateMenuType } from 'typings/globelType';

/** 加载文件菜单 */
export const loadFileMenus = (file: IFile, mode: number = 0) => {
  return file
    .operates(mode)
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
