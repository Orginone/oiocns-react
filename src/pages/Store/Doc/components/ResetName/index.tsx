import React, { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';

const ResetNameModal = (props: {
  open: boolean;
  title: string; // 弹出框名称
  reNameKey: string; // 需要修改的值的key
  value: string; // 需要修改的值
  onChange: (val: boolean) => void;
}) => {
  const { open, title, reNameKey, onChange, value } = props;
  //   const [reNameKey, setReNameKey] = useState('');
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
          if (title === '重命名') {
            if (await docsCtrl.refItem(reNameKey)?.rename(createFileName)) {
              docsCtrl.changCallback();
            } else {
              message.error('更新失败，请稍后重试');
            }
          } else {
            if (await docsCtrl.current?.create(createFileName)) {
              docsCtrl.changCallback();
            } else {
              message.error('更新失败，请稍后重试');
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
