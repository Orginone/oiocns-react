/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:53:53
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/UploadAvatar/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Upload, message } from 'antd';
import cls from './index.module.less';
import { getUuid } from '@/utils/tools';
import docsCtrl from '@/ts/controller/store/docsCtrl';

/**自定义的头像对象返回，根目录返回文件 预览的时候用shareLink处理  */
export interface avatarUpload extends UploadFile {
  shareLink?: string;
  contentType?: string;
  extension?: string;
  key?: string;
}

interface PostsProps {
  // eslint-disable-next-line no-unused-vars
  fileList: avatarUpload[];
  setFileList: (ff: avatarUpload[]) => void;
  [key: string]: any;
}

/* 
 头像上传
*/
const UploadAvatar: React.FC<PostsProps> = (props) => {
  /** 文件上传参数 */
  const uploadProps: UploadProps = {
    multiple: false,
    listType: 'picture-card',
    fileList: props.fileList,
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
        const uuid = getUuid();
        const result = docsCtrl.upload(uuid, file.name, file);
        console.log(result);
        // if (result && result.target && result!.target.thumbnail!.length > 0) {
        //   const uploadFile: avatarUpload = {
        //     uid: uuid,
        //     name: file.name,
        //     status: 'done',
        //     url: result!.target.thumbnail,
        //     size: result!.target.size,
        //     shareLink: result!.target.shareLink,
        //     contentType: result!.target.contentType,
        //     extension: result!.target.extension,
        //     key: result!.target.key,
        //   };
        //   props.setFileList([uploadFile]);
        // }
      }
    },
  };
  return (
    <div className={cls[`upload-avatar`]}>
      头像:
      <Upload {...uploadProps}>{props.fileList.length < 2 && '上传修改'}</Upload>
    </div>
  );
};
export default UploadAvatar;
