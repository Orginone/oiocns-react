import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Upload } from 'antd';
import cls from './index.module.less';

/* 
 头像上传
*/

const UploadAvatar = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  return (
    <div className={cls[`upload-avatar`]}>
      <ImgCrop rotate>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          onChange={onChange}>
          {fileList.length < 2 && '上传修改'}
        </Upload>
      </ImgCrop>
    </div>
  );
};
export default UploadAvatar;
