import './index.less';

import appCtrl from '@/ts/controller/store/appCtrl';
// import { Card } from 'antd';
import React, { useEffect, useState } from 'react';

import BannerCom from './components/BannerCom';
import Charts from './components/Charts';
import SelfAppCom from './components/SelfAppCom';
import Shortcuts from './components/ShortcutsCom';
import { XProduct } from '@/ts/base/schema';

//TODO: 临时获取本地banner
let imgList: any[] = [];

/**
 * @desc: 获取图片列表资源
 * @return  {url:string} 图片信息
 */
function getImgAssets() {
  for (let i = 1; i < 5; i++) {
    imgList.push({
      url: `/img/banner/${i}.png`,
    });
  }
}
getImgAssets();

/**
 * @desc: 项目首页
 */
const Home: React.FC = () => {
  const [products, setProducts] = useState<XProduct[]>([]);
  useEffect(() => {
    if (appCtrl.products.length > 0) {
      setProducts(appCtrl.products.map((item) => item.prod));
    } else {
      getShowApps();
    }
  }, []);
  const getShowApps = async () => {
    let arr: XProduct[] = (await appCtrl.getOwnProducts()).map((item) => item.prod) || [];
    setProducts([...arr]);
  };

  return (
    <div className="work-home">
      {/* 顶部图片 */}
      <BannerCom imgList={imgList} />
      {/* 快捷入口及应用 */}
      <div className=" flex">
        <Shortcuts props={[]} /> <SelfAppCom apps={products} />
      </div>
      {/* 底部区域 //TODO:临时*/}
      <Charts />
    </div>
  );
};
export default Home;
