import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { ISysFileInfo } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { FileItemShare } from '@/ts/base/model';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { ellipsisText } from '@/utils';
const SelectMultFiles: React.FC<{
  name: string;
  disabled?: boolean;
  values: string;
  onFieldChange?: (key: string, value: any) => void;
}> = (props) => {
  const initFiles: FileItemShare[] = [];
  if (props.values && props.values.length > 0) {
    try {
      var temps = JSON.parse(props.values);
      if (temps && Array.isArray(temps) && temps.length > 0) {
        initFiles.push(...temps);
      }
    } catch {
      /* empty */
    }
  }
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<FileItemShare[]>(initFiles);
  const uploadButton = (
    <div className={cls.selectFileBtn} onClick={() => setOpen(true)}>
      <PlusOutlined style={{ fontSize: 20 }} />
      <div style={{ marginTop: 8 }}>选择文件</div>
    </div>
  );

  useEffect(() => {
    if (props.onFieldChange) {
      props.onFieldChange(props.name, JSON.stringify(fileList));
    }
  }, [fileList]);

  return (
    <div className={cls.imageUploader}>
      {fileList.map((i, x) => {
        return (
          <div
            className={cls.fileItem}
            key={i.name + x}
            title={i.name}
            onClick={() => {
              command.emitter('executor', 'open', i, 'preview');
            }}>
            <TypeIcon iconType={i.contentType ?? '文件'} size={50} />
            <span>{ellipsisText(i.name, 10)}</span>
          </div>
        );
      })}
      {open && (
        <OpenFileDialog
          multiple
          rootKey={'disk'}
          accepts={['文件']}
          allowInherited
          onCancel={() => setOpen(false)}
          onOk={(files) => {
            if (files.length > 0) {
              setFileList([
                ...fileList,
                ...files.map((i) => (i as ISysFileInfo).shareInfo()),
              ]);
            }
            setOpen(false);
          }}
        />
      )}
      {props.disabled != true && uploadButton}
    </div>
  );
};

export default SelectMultFiles;
