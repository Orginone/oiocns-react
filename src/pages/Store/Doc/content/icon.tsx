import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import passport from '@/assets/icons/default_folder_opened.svg';
import bank from '@/assets/icons/default_file.svg';
import txt from '@/assets/icons/file_type_txt.svg';
import image from '@/assets/icons/file_type_genstat.svg';
import excel from '@/assets/icons/file_type_excel.svg';
import word from '@/assets/icons/file_type_word.svg';

const StoreDoc = (props: any) => {
  const [type, setType] = useState<any>(null);
  const { iconData } = props;
  useEffect(() => {
    let index = iconData.Name.lastIndexOf('.');
    if (index == -1) {
      setType('file');
    } else {
      let str = iconData.Name.substring(index + 1, iconData.Name.length);
      setType(str);
    }
  }, []);
  return (
    <div>
      {type == 'file' ? (
        <img src={passport} className={cls.fileImg} alt="" />
      ) : type == 'txt' ? (
        <img src={txt} className={cls.fileImg} alt="" />
      ) : type == 'png' || type == 'svg' || type == 'jpg' || type == 'jpeg' ? (
        <img src={image} className={cls.fileImg} alt="" />
      ) : type == 'xls' ? (
        <img src={excel} className={cls.fileImg} alt="" />
      ) : type == 'docx' ? (
        <img src={word} className={cls.fileImg} alt="" />
      ) : (
        <img src={bank} className={cls.fileImg} alt="" />
      )}
    </div>
  );
};

export default StoreDoc;
