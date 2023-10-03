import React, { useState } from 'react';
import cls from './index.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { ISysFileInfo } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import ActivityResource from '@/components/Activity/ActivityResource';
const ImageUploader: React.FC<{
  maxCount: number;
  types: string[];
  onChange: (fileList: ISysFileInfo[]) => void;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<ISysFileInfo[]>([]);
  const uploadButton = (
    <div className={cls.selectFileBtn} onClick={() => setOpen(true)}>
      <PlusOutlined style={{ fontSize: 30 }} />
      <div style={{ marginTop: 8 }}>选择文件</div>
    </div>
  );

  return (
    <div className={cls.imageUploader}>
      {ActivityResource(
        fileList.map((i) => i.shareInfo()),
        200,
        1,
      )}
      {open && (
        <OpenFileDialog
          maxCount={props.maxCount}
          accepts={props.types}
          onCancel={() => setOpen(false)}
          onOk={(files) => {
            setFileList([...fileList, ...files.map((i) => i as ISysFileInfo)]);
            setOpen(false);
          }}
        />
      )}
      {fileList.length >= props.maxCount ? null : uploadButton}
    </div>
  );
};

export default ImageUploader;
