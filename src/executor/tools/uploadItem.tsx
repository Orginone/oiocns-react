import React, { useState } from 'react';
import { model, parseAvatar } from '@/ts/base';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { IDirectory } from '@/ts/core';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';

interface IProps {
  icon: string;
  typeName: string;
  directory: IDirectory;
  readonly?: boolean;
  onChanged: (icon: string) => void;
}

const UploadItem: React.FC<IProps> = ({
  icon,
  typeName,
  directory,
  readonly,
  onChanged,
}) => {
  const [avatar, setAvatar] = useState<model.FileItemShare | undefined>(
    parseAvatar(icon),
  );
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    beforeUpload: (file) => {
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
        if (result) {
          setAvatar(result.shareInfo());
          onChanged(JSON.stringify(result.shareInfo()));
        }
      }
    },
  };
  return (
    <Space>
      <Avatar
        size={100}
        style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
        src={
          avatar ? (
            <Image
              width={100}
              src={avatar.thumbnail}
              preview={{ src: avatar.shareLink }}
            />
          ) : (
            <TypeIcon iconType={typeName} size={64} />
          )
        }
      />
      {!readonly && (
        <Upload {...uploadProps}>
          <Button type="link">上传图标</Button>
        </Upload>
      )}
      {!readonly && avatar ? (
        <Button
          type="link"
          onClick={() => {
            setAvatar(undefined);
            onChanged('');
          }}>
          清除图标
        </Button>
      ) : (
        ''
      )}
    </Space>
  );
};

export default UploadItem;
