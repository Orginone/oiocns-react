import TypeIcon from '@/bizcomponents/GlobalComps/typeIcon';
import { command, schema } from '@/ts/base';
import { IFileInfo } from '@/ts/core';
import React from 'react';
import { OperateMenuType } from 'typings/globelType';

/** 加载文件菜单 */
export const loadFileMenus = (file: IFileInfo<schema.XEntity>, mode: number = 0) => {
  return file
    .operates(mode)
    .sort((a, b) => a.sort - b.sort)
    .map((o) => {
      return {
        key: o.cmd,
        label: o.label,
        icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={16} />,
        beforeLoad: async () => {
          if (o.cmd === 'open') {
            await file.loadContent();
          }
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
                if (o.cmd === 'open') {
                  await file.loadContent();
                }
                command.emitter('config', o.cmd, file);
                return true;
              },
            };
          }),
      } as OperateMenuType;
    });
};
