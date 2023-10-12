import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { OperateModel } from '@/ts/base/model';
import { IFile } from '@/ts/core';
import { entityOperates } from '@/ts/core/public';
import React from 'react';
import { OperateMenuType } from 'typings/globelType';

/** 加载文件菜单 */
export const loadFileMenus = (file?: IFile) => {
  if (file) {
    const operates: OperateModel[] = [];
    if (file.groupTags.includes('已删除')) {
      if (file.directory.target.hasRelationAuth()) {
        operates.push(entityOperates.Restore, entityOperates.HardDelete);
      }
      operates.push(entityOperates.Remark);
    } else {
      operates.push(...file.operates());
    }
    const parseLabel = (label: string) => {
      if ('filedata' in file) {
        return label.replaceAll('{0}', '文件');
      }
      return label.replaceAll('{0}', file.typeName);
    };
    if (operates.length > 0) {
      return operates
        .sort((a, b) => a.sort - b.sort)
        .map((o) => {
          return {
            key: o.cmd,
            label: parseLabel(o.label),
            model: o.model ?? 'inside',
            icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={16} />,
            beforeLoad: async () => {
              command.emitter('executor', o.cmd, file);
              return true;
            },
            children: o.menus
              ?.sort((a, b) => a.sort - b.sort)
              .map((s) => {
                return {
                  key: s.cmd,
                  label: parseLabel(s.label),
                  icon: <TypeIcon iconType={s.iconType} size={16} />,
                  beforeLoad: async () => {
                    command.emitter('executor', s.cmd, file);
                    return true;
                  },
                };
              }),
          } as OperateMenuType;
        });
    }
  }
};
