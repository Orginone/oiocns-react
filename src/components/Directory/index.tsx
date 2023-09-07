import React, { useState } from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFileInfo } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command, schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';

interface IProps {
  mode: number;
  current: IDirectory | undefined | 'disk';
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) return <></>;
  const [dircetory] = useState<IDirectory>(
    current === 'disk' ? orgCtrl.user.directory : current,
  );
  const [key] = useCtrlUpdate(dircetory);
  const cmdType = mode === 1 ? 'data' : 'config';
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const contextMenu = (file?: IFileInfo<schema.XEntity>, clicked?: Function) => {
    var entity = file || dircetory;
    if ('resource' in entity) {
      entity = entity.directory;
    }
    return {
      items: loadFileMenus(entity, mode),
      onClick: ({ key }: { key: string }) => {
        command.emitter(cmdType, key, file || dircetory, dircetory.key);
        clicked?.apply(this, []);
      },
    };
  };
  const fileOpen = async (file: IFileInfo<schema.XEntity>) => {
    await file.loadContent();
    command.emitter(cmdType, 'open', file);
  };
  const content = () => {
    if (current === 'disk') {
      return [orgCtrl.user, ...orgCtrl.user.companys];
    }
    return current.content(mode);
  };

  return (
    <SegmentContent
      key={key}
      onSegmentChanged={setSegmented}
      description={`${content.length}个项目`}
      content={
        segmented === 'table' ? (
          <TableMode content={content()} fileOpen={fileOpen} contextMenu={contextMenu} />
        ) : segmented === 'icon' ? (
          <IconMode content={content()} fileOpen={fileOpen} contextMenu={contextMenu} />
        ) : (
          <ListMode content={content()} fileOpen={fileOpen} contextMenu={contextMenu} />
        )
      }
    />
  );
};
export default Directory;
