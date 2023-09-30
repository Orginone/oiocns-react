import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload, UploadProps } from 'antd';
import { IDirectory, ISysFileInfo } from '@/ts/core';
import cls from './index.module.less';
import { shareOpenLink } from '@/utils/tools';
const ImageUploader: React.FC<{
  maxCount: number;
  types: string[];
  directory: IDirectory;
  onChange: (fileList: ISysFileInfo[]) => void;
}> = (props) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<ISysFileInfo[]>([]);
  const directory = props.directory;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? '正在上传' : '选择文件'}</div>
    </div>
  );

  const uploadProps: UploadProps = {
    multiple: true,
    maxCount: props.maxCount,
    showUploadList: false,
    beforeUpload: (file) => {
      setLoading(true);
      if (!props.types.some((i) => file.type.startsWith(i))) {
        message.error(`${file.name} 是不支持的格式`);
        return false;
      }
      return true;
    },
    async customRequest(options) {
      const file = options.file as File;
      if (file) {
        const result = await directory.createFile(file);
        result && fileList.push(result);
        setFileList(fileList);
        props.onChange(fileList);
      }
      setLoading(false);
    },
  };
  return (
    <div className={cls.imageUploader}>
      {fileList.map((item) => {
        return (
          <Image
            style={{ width: '200px', height: '200px' }}
            src={shareOpenLink(item.filedata.shareLink)}
            key={item.key}
            preview={{
              src: shareOpenLink(item.filedata.shareLink),
            }}></Image>
        );
      })}
      <Upload listType="picture-card" {...uploadProps}>
        {fileList.length >= props.maxCount ? null : uploadButton}
      </Upload>
    </div>
  );
};

export default ImageUploader;
