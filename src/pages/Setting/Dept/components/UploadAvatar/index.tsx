/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:53:53
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/UploadAvatar/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Upload } from 'antd';
import cls from './index.module.less';

/* 
 头像上传
*/

const UploadAvatar = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
