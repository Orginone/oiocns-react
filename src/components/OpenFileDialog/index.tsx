import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import Directory from '../Directory';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';
import FullScreenModal from '../Common/fullScreen';
import { Button, Divider, Space } from 'antd';
import { IFile } from '@/ts/core';

interface IFileDialogProps {
  accepts: string[];
  multiple?: boolean;
  maxCount?: number;
  onOk: (files: IFile[]) => void;
  onCancel: () => void;
}

const OpenFileDialog: React.FC<IFileDialogProps> = (props) => {
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <FullScreenModal
      open
      title={'选择文件'}
      onCancel={() => {
        props.onCancel();
        setSelectedFiles([]);
      }}
      destroyOnClose
      width={'80vw'}
      bodyHeight={'70vh'}
      footer={
        <Space split={<Divider type="vertical" />} wrap size={2}>
          <Button
            type="primary"
            onClick={() => {
              props.onOk(selectedFiles.slice(0, props.maxCount ?? 1000));
              setSelectedFiles([]);
            }}>
            确认
          </Button>
        </Space>
      }>
      <MainLayout
        leftShow
        selectMenu={selectMenu}
        onSelect={(data) => {
          setSelectMenu(data);
        }}
        siderMenuData={rootMenu}>
        <Directory
          key={key}
          accepts={props.accepts}
          current={selectMenu.item}
          selects={selectedFiles}
          onSelected={(files) => setSelectedFiles(files)}
          mode={10}
        />
      </MainLayout>
    </FullScreenModal>
  );
};

export default OpenFileDialog;
