import React, { useEffect, useState } from 'react';
import { ISysFileInfo } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import ActivityResource from '../ActivityResource';
import { AiOutlinePlus } from '@/icons/ai';
const SelectMultFiles: React.FC<{
  maxCount: number;
  types: string[];
  currentKey?: string;
  onChange: (fileList: ISysFileInfo[]) => void;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<ISysFileInfo[]>([]);
  const uploadButton = (
    <div className="selectFileBtn" onClick={() => setOpen(true)}>
      <AiOutlinePlus size={30} />
      <div style={{ marginTop: 8 }}>选择文件</div>
    </div>
  );

  useEffect(() => {
    props.onChange(fileList);
  }, [fileList]);

  return (
    <div className={'selectMultFiles'}>
      {ActivityResource(
        fileList.map((i) => i.shareInfo()),
        200,
        1,
      )}
      {open && (
        <OpenFileDialog
          multiple
          rootKey={'disk'}
          currentKey={props.currentKey}
          maxCount={props.maxCount}
          accepts={props.types}
          allowInherited
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

export default SelectMultFiles;
