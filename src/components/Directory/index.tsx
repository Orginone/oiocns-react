import React from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFileInfo } from '@/ts/core';
import { Dropdown } from 'antd';
import { loadFileMenus } from '@/executor/fileOperate';
import { command, schema } from '@/ts/base';

interface IProps {
  mode: number;
  current: IDirectory | undefined;
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) return <></>;
  const [key] = useCtrlUpdate(current);
  const cmdType = mode === 1 ? 'data' : 'config';
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const contextMenu = (file: IFileInfo<schema.XEntity>, clicked?: Function) => {
    return {
      items: loadFileMenus(file, mode),
      onClick: ({ key }: { key: string }) => {
        command.emitter(cmdType, key, current, current.key);
        clicked?.apply(this, []);
      },
    };
  };
  const fileOpen = async (file: IFileInfo<schema.XEntity>) => {
    await file.loadContent();
    command.emitter(cmdType, 'open', file);
  };
  const content = () => {
    return current.content(mode);
  };

  return (
    <SegmentContent
      key={key}
      onSegmentChanged={setSegmented}
      description={`${current.content(mode).length}个项目`}
      content={
        <Dropdown menu={contextMenu(current)} trigger={['contextMenu']}>
          <div style={{ width: '100%', height: '100%' }}>
            {segmented === 'table' ? (
              <TableMode
                content={content()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                content={content()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                content={content()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            )}
          </div>
        </Dropdown>
      }
    />
  );
};
export default Directory;
