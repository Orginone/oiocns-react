import React from 'react';
import cls from './index.module.less';

const StoreDoc = (props: any) => {
  const type = props.iconData;
  const getImgSrc = (type: string) => {
    let prifex = '/icons/';
    switch (type) {
      case '':
        prifex += 'default_folder';
        break;
      case 'file':
        prifex += 'default_file';
        break;
      default:
        prifex += 'file_type_' + type;
        break;
    }
    return prifex + '.svg';
  };
  return (
    <div>
      <img src={getImgSrc(type)} className={cls.fileImg}></img>
      {/* {type == 'file' ? (
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
      )} */}
    </div>
  );
};

export default StoreDoc;
