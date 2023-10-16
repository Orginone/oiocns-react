import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { ISysFileInfo } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { FileItemShare } from '@/ts/base/model';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { command } from '@/ts/base';
import { ellipsisText } from '@/utils';
import { Button, TextArea } from 'devextreme-react';
import { ITextBoxOptions } from 'devextreme-react/text-box';

const SelectFilesItem: React.FC<ITextBoxOptions> = (props) => {
  const initFiles: FileItemShare[] = [];
  if (props.defaultValue && props.defaultValue.length > 0) {
    try {
      var temps = JSON.parse(props.defaultValue);
      if (temps && Array.isArray(temps) && temps.length > 0) {
        initFiles.push(...temps);
      }
    } catch {
      /* empty */
    }
  }
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<FileItemShare[]>(initFiles);
  useEffect(() => {
    props.onValueChanged?.apply(this, [
      {
        value: JSON.stringify(fileList),
      } as any,
    ]);
  }, [fileList]);

  return (
    <TextArea {...props} height={130} width={'100%'} defaultValue="" value="">
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
        <Button
          text="上传文件"
          type="default"
          stylingMode="text"
          icon="upload"
          height={80}
          onClick={React.useCallback(() => {
            setOpen(true);
          }, [])}
          visible={props.readOnly != true}
        />
      </div>
      {open && (
        <OpenFileDialog
          multiple
          rootKey={'disk'}
          accepts={['文件']}
          allowInherited
          maxCount={(props.maxLength ?? 100) as number}
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
    </TextArea>
  );
};

export default SelectFilesItem;
