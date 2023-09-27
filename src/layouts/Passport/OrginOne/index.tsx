import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const orginOneLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [index, setIndex] = useState(1);
  const [slidesMargin, setSlidesMargin] = useState('0');

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;
        // 如果滚动到最后一张图片，立即跳转到第二张图片
        if (nextIndex === 7) {
          nextIndex = 1;
        }
        setSlidesMargin(`${(nextIndex - 1) * -100}%`);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const choosePic = (e: React.MouseEvent<HTMLDivElement>) => {
    const chooseIndex = parseInt(e.currentTarget.id.charAt(3));
    setIndex(chooseIndex);
    setSlidesMargin(`${(parseInt(e.currentTarget.id.charAt(3)) - 1) * -100}%`);
  };
  return (
    <div className={cls.container}>
      <div className={cls.logo}>OrginOne</div>
      <div className={cls.slider}>
        <div className={cls.sliderSlides} style={{ marginLeft: slidesMargin }}>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img1.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>奥集能 Orginone</div>
            <div className={cls.sliderSlidesItemContent}>
              面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。{' '}
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img2.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>门户</div>
            <div className={cls.sliderSlidesItemContent}>
              汇聚各类动态信息，新闻资讯，交易商城，监控大屏，驾驶舱。用户可以按权限自由定义，千人千面。{' '}
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img3.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>沟通</div>
            <div className={cls.sliderSlidesItemContent}>
              为个人和组织提供可靠、安全、私密的即时沟通工具，个人会话隐私保护优先，组织会话单位数据权利归属优先。
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img4.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>办事</div>
            <div className={cls.sliderSlidesItemContent}>
              满足各类组织和跨组织协同办公，适应各类业务场景，支持发起、待办、已办、已完结等不同状态流程类业务审核审批查阅。{' '}
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img5.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>存储</div>
            <div className={cls.sliderSlidesItemContent}>
              提供各类文件、数据、应用的存储空间。具有操作系统级文件和资源管理器功能。{' '}
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img6.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>设置</div>
            <div className={cls.sliderSlidesItemContent}>
              进行个人和组织的关系设置，数据标准、办事和应用的定义和管理。无代码自定义表单、规则，灵活的流程配置。支持各类资源注册和管理。{' '}
            </div>
          </div>
        </div>
      </div>
      <div className={cls.background}>
        <img src="/img/passport/orginOne/passport_bg.png" alt=""></img>
      </div>
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
      <div className={cls.copyright}>
        <div className={cls.copyrightZh}>
          主办单位：
          <a
            href="https://czt.zj.gov.cn"
            target="_blank"
            style={{ color: '#8a8a8a' }}
            rel="noopener noreferrer">
            浙江省财政厅
          </a>
          &nbsp; 技术支持：
          <a
            href="https://assetcloud.org.cn"
            target="_blank"
            style={{ color: '#8a8a8a' }}
            rel="noopener noreferrer">
            资产云开放协同创新中心
          </a>
        </div>
        <div className={cls.copyrightEn}>
          <a
            href="https://orginone.cn"
            target="_blank"
            style={{ color: '#8a8a8a' }}
            rel="noopener noreferrer">
            Powered by Orginone{' '}
          </a>
        </div>
      </div>

      {/*轮播图按钮*/}
      <input id="btn1" className={cls.btn1} type="radio" onClick={choosePic} />
      <input id="btn2" className={cls.btn2} type="radio" onClick={choosePic} />
      <input id="btn3" className={cls.btn3} type="radio" onClick={choosePic} />
      <input id="btn4" className={cls.btn4} type="radio" onClick={choosePic} />
      <input id="btn5" className={cls.btn5} type="radio" onClick={choosePic} />
      <input id="btn6" className={cls.btn5} type="radio" onClick={choosePic} />

      <div className={cls.count}>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 1 ? '#ffffff' : '#eff5ff',
              width: index === 1 ? '32px' : '',
            }}
            htmlFor="btn1"></label>
        </div>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 2 ? '#ffffff' : '#eff5ff',
              width: index === 2 ? '32px' : '',
            }}
            htmlFor="btn2"></label>
        </div>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 3 ? '#ffffff' : '#eff5ff',
              width: index === 3 ? '32px' : '',
            }}
            htmlFor="btn3"></label>
        </div>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 4 ? '#ffffff' : '#eff5ff',
              width: index === 4 ? '32px' : '',
            }}
            htmlFor="btn4"></label>
        </div>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 5 ? '#ffffff' : '#eff5ff',
              width: index === 5 ? '32px' : '',
            }}
            htmlFor="btn5"></label>
        </div>
        <div className={cls.countItem}>
          <label
            style={{
              background: index === 6 ? '#ffffff' : '#eff5ff',
              width: index === 6 ? '32px' : '',
            }}
            htmlFor="btn6"></label>
        </div>
      </div>
    </div>
  );
};
export default orginOneLayout;
