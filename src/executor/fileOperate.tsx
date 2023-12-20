import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { OperateModel } from '@/ts/base/model';
import { IFile } from '@/ts/core';
import { IDEntity, entityOperates } from '@/ts/core/public';
import React from 'react';
import { OperateMenuType } from 'typings/globelType';

/** 加载文件菜单 */
export const loadFileMenus = (file?: IDEntity | IFile) => {
  if (file) {
    const operates: OperateModel[] = [];
    if (file.groupTags.includes('已删除') && 'directory' in file) {
      if (file.directory.target.hasRelationAuth()) {
        operates.push(entityOperates.Restore, entityOperates.HardDelete);
      }
      operates.push(entityOperates.Remark);
    } else {
      operates.push(...file.operates());
    }
    return operatesToMenus(operates, file);
  }
};

/** 将操作转为菜单 */
export const operatesToMenus = (operates: OperateModel[], file: IDEntity) => {
  const parseLabel = (label: string) => {
    const toName = 'filedata' in file ? '文件' : file.typeName;
    return label.replace('{0}', toName);
  };
  if (operates.length > 0) {
    return operates
      .sort((a, b) => a.sort - b.sort)
      .map((o) => {
        return {
          key: o.cmd,
          label: parseLabel(o.label),
          model: o.model ?? 'inside',
          icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={18} />,
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
                icon: <TypeIcon iconType={s.iconType} size={18} />,
                beforeLoad: async () => {
                  command.emitter('executor', s.cmd, file);
                  return true;
                },
              };
            }),
        } as OperateMenuType;
      });
  }
};
