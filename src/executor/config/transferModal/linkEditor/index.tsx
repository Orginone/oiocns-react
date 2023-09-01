import FullScreenModal from '@/executor/tools/fullScreen';
import { ILink } from '@/ts/core/thing/config';
import { Space } from 'antd';
import React from 'react';
import LinkEditor from './widgets/editor';
import { NodeTools } from '../selector';

interface IProps {
  current: ILink;
  finished: () => void;
}

const LinkModal: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'链接配置'}
      onCancel={() => finished()}>
      <LinkEditor current={current} children={<ToolBar current={current} />} />
    </FullScreenModal>
  );
};

const ToolBar: React.FC<{ current: ILink }> = ({ current }) => {
  return (
    <Space style={{ position: 'absolute', left: 10, top: 10 }}>
      <NodeTools current={current}></NodeTools>
    </Space>
  );
};

export default LinkModal;
