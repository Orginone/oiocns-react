import './index.less';

import { Carousel } from 'antd';
import React from 'react';

interface imgItem {
  url: string; // banner 地址
}
interface BannerType {
  imgList: imgItem[];
}

// banner
const BannerCom: React.FC<BannerType> = ({ imgList }) => {
  // 根据传入数据 渲染图片
  const renderImg = (urlList: imgItem[]) => {
    return urlList.map((item: imgItem) => {
      return <img className="img-con" src={item.url} key={item.url} alt="" />;
    });
  };
  // 最终渲染内容
  return (
    <Carousel className="banner-wrap" autoplay>
      {renderImg(imgList)}
    </Carousel>
  );
};
export default BannerCom;
