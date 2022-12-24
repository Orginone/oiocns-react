import docsCtrl from '@/ts/controller/store/docsCtrl';
import storeCtrl from '@/ts/controller/store';
import { IFileSystemItem } from '@/ts/core';
import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, Upload, UploadProps } from 'antd';

interface IProps {
  operateKey?: string;
  operateTarget?: IFileSystemItem;
  operateDone: () => void;
}

/** 文件系统操作 */
const FileSysOperate: React.FC<IProps> = (props: IProps) => {
  const [newName, setNewName] = useState<string>('');
  const [modalType, setModalType] = useState<string>('');
  const [target, setTarget] = useState<IFileSystemItem>();
  const uploadRef = useRef<any>();
  useEffect(() => {
    if (props.operateTarget && props.operateKey) {
      executeOperate(props.operateKey, props.operateTarget);
      props.operateDone();
    }
  }, [props]);

  const executeOperate = async (key: string, target: IFileSystemItem) => {
    switch (key) {
      case '刷新':
        await target.loadChildren(true);
        break;
      case '删除':
        await target.delete();
        break;
      case '上传':
        setTarget(target);
        uploadRef.current.upload.uploader.onClick();
        return;
      case '新建':
        setNewName('');
        setModalType(key);
        setTarget(target);
        return;
      case '重命名':
        setModalType(key);
        setTarget(target);
        setNewName(target.name);
        return;
      case '|新建':
        await target.create(newName);
        break;
      case '|重命名':
        await target.rename(newName);
        break;
      case '双击':
        if (target.target.isDirectory) {
          storeCtrl.currentKey = target.key;
          await target.loadChildren();
          docsCtrl.changCallback();
          storeCtrl.changCallback();
        } else {
          console.log('双击了文件', target.name);
        }
        return;
    }
    docsCtrl.changCallback();
    storeCtrl.changCallback();
  };
  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    async customRequest(options) {
      const file = options.file as File;
      if (file && target) {
        docsCtrl.upload(target, file.name, file);
      }
    },
  };
  return (
    <>
      {target && (
        <Modal
          title={modalType + '-[' + target.name + ']'}
          open={['新建', '重命名'].includes(modalType)}
          onCancel={() => setModalType('')}
          onOk={async () => {
            if (newName.length > 0) {
              await executeOperate('|' + modalType, target);
              setModalType('');
            }
          }}>
          <Input
            placeholder="新建文件夹"
            size="large"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </Modal>
      )}
      <Upload {...uploadProps} ref={uploadRef}></Upload>
    </>
  );
};

export default FileSysOperate;
