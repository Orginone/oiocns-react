import { IApplication, IDirectory } from '@/ts/core';
import React from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import Directory from '@/components/Directory';
// 卡片渲染
interface IProps {
  current: IDirectory | IApplication;
  finished?: () => void;
}

/** 目录预览 */
const OpenDirectory: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={current.name}
      footer={[]}
      onCancel={finished}>
      <Directory key={current.key} root={current} />
    </FullScreenModal>
  );
};

export default OpenDirectory;
