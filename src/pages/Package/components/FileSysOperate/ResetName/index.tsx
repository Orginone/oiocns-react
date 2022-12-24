import React, { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Input, message } from 'antd';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { IFileSystemItem } from '@/ts/core';

const ResetNameModal = (props: {
  open: boolean;
  title: string; // 弹出框名称
  value: string; // 需要修改的值
  currentTaget: IFileSystemItem | undefined; // 需要操作的文件
  onChange: (val: boolean) => void;
}) => {
  const { open, title, onChange, currentTaget, value } = props;
  const [createFileName, setCreateFileName] = useState<string>('新建文件夹');
  useEffect(() => {
    setCreateFileName(value || '');
  }, [value]);
  return (
    <Modal
      destroyOnClose
      title={title}
      open={open}
      onOk={async () => {
        if (createFileName != '') {
          if (title === '重命名' && currentTaget) {
            if (await currentTaget.rename(createFileName)) {
              docsCtrl.changCallback();
            } else {
              message.error('更新失败，请稍后重试');
            }
          } else {
            if (currentTaget) {
              if (await currentTaget.create(createFileName)) {
                docsCtrl.changCallback();
              } else {
                message.error('更新失败，请稍后重试');
              }
            }
          }
        }
        setCreateFileName('');
        onChange(false);
      }}
      onCancel={() => {
        // setCreateFileName('');
        onChange(false);
      }}>
      <Input
        defaultValue={createFileName}
        onChange={(e: any) => {
          setCreateFileName(e.target.value);
        }}
        placeholder={title}
      />
    </Modal>
  );
};
export default ResetNameModal;
