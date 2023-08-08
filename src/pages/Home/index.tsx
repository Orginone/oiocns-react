import './index.less';

// import { Card } from 'antd';
import React, { useEffect } from 'react';

import SelfAppCom from './components/SelfAppCom';
import Shortcuts from './components/ShortcutsCom';
import { Tabs } from 'antd';
import Activity from '@/pages/Activity';

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
  useEffect(() => { }, []);
  return (
    <div className="work-home-wrap">
      {/* 顶部图片11111 */}
      {/*<BannerCom imgList={imgList} />*/}
      <div className="home-content">
        <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ alignSelf: 'center' }}>
          <Tabs.TabPane tab="动态" key="1">
            <iframe
              id="iframeContain"
              name="iframeContain"
              seamless
              src="http://localhost:8081/">
              您当前的浏览器不支持页面上的功能，请升级您当前的浏览器版本或使用谷歌浏览器访问当前页面
            </iframe>
          </Tabs.TabPane>
          <Tabs.TabPane tab="常用" key="2">
            {/* 快捷入口及应用 */}
            <Shortcuts props={[]} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="应用" key="3">
            {/* 快捷入口及应用 */}
            <SelfAppCom props={[]} />
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* 底部区域 //TODO:临时*/}
      {/*<Charts />*/}
    </div>
  );
};
export default Home;
