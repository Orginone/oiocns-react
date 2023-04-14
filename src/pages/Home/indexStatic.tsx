import './index.less';

// import { Card } from 'antd';
import React, { useEffect } from 'react';

import BannerCom from './components/BannerCom';
import SelfAppCom from './components/SelfAppCom';
import Shortcuts from './components/ShortcutsCom';

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
  useEffect(() => {}, []);
  return (
    <div className="work-home">
      {/* 顶部图片11111 */}
      <BannerCom imgList={imgList} />
      {/* 快捷入口及应用 */}
      <div className=" flex">
        <Shortcuts props={[]} /> <SelfAppCom props={[]} />
      </div>
      {/* 底部区域 //TODO:临时*/}
    </div>
  );
};
export default Home;
