import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload, UploadProps } from 'antd';
import { IDirectory, ISysFileInfo } from '@/ts/core';
import cls from './index.module.less';
const ImageUploader: React.FC<{
  directory: IDirectory;
  onChange: (fileList: ISysFileInfo[]) => void;
}> = (props) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<ISysFileInfo[]>([]);
  const directory = props.directory;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? '正在上传' : '选择图片'}</div>
    </div>
  );

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      setLoading(true);
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
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
      {fileList.map((item, index) => {
        return (
          <Image
            style={{ width: '104px', height: '104px' }}
            src={item.filedata.thumbnail}
            key={index}></Image>
        );
      })}
      <Upload listType="picture-card" {...uploadProps}>
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
    </div>
  );
};

export default ImageUploader;
