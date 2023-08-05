import React from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import orgCtrl from '@/ts/controller';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory } from '@/ts/core';

interface IProps {
  mode: number;
  current: IDirectory | undefined;
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) {
    current = orgCtrl.provider.disk;
  }
  const [key] = useCtrlUpdate(current);
  const [segmented, setSegmented] = useStorage('segmented', 'list');

  return (
    <SegmentContent
      key={key}
      onSegmentChanged={setSegmented}
      description={`${current.content(mode).length}个项目`}
      content={
        <>
          {segmented === 'table' ? (
            <TableMode current={current} mode={mode} />
          ) : segmented === 'icon' ? (
            <IconMode current={current} mode={mode} />
          ) : (
            <ListMode current={current} mode={mode} />
          )}
        </>
      }
    />
  );
};
export default Directory;
