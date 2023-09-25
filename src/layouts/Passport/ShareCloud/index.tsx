import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const ShareCloudLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [index, setIndex] = useState(1);
  const [slidesMargin, setSlidesMargin] = useState('0');

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;
        // 如果滚动到最后一张图片，立即跳转到第二张图片
        if (nextIndex === 6) {
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
      <img className={cls.logo} src="/img/passport/shareCloud/logo.png" alt="" />
      <div className={cls.slider}>
        <div className={cls.sliderSlides} style={{ marginLeft: slidesMargin }}>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/shareCloud/passport_img1.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>资产共享云</div>
            <div className={cls.sliderSlidesItemContent}>
              资产共享云利用云原生技术，专注用户价值，秉持“精一”理念，集成各种能力，面向组织用户提供统一应用界面。
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/shareCloud/passport_img2.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>使命和愿景</div>
            <div className={cls.sliderSlidesItemContent}>
              推进领先技术的落地实践，支撑政府、社会、 云原生应用研究院是研究云原生技术，
              经济等各领域各行业组织变革和业务创新需求而发起成立的开放型非营利公共组织负责搭建开放协同创新平台，加速云原生应用平台落地示范以及推广，更好的服务于数字化改革。
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/shareCloud/passport_img3.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>开放协作</div>
            <div className={cls.sliderSlidesItemContent}>
              一起推动社会和政府数字化转型。单位拥有高效便捷的管理手段，
              利于开放共享资源，提高资产绩效。科研机构可以掌握前沿技术和行业领先动态，促进产学研结合。
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/shareCloud/passport_img4.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>Code for China</div>
            <div className={cls.sliderSlidesItemContent}>
              基于用户需求场景，打破技术、产品和服务的边界，更好的帮助客服实现数字化转型。
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/shareCloud/passport_img5.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>高效连接</div>
            <div className={cls.sliderSlidesItemContent}>
              社会组织可以高效连接和服务行业发展。开发商对接需求，提高效率，加速应用部署和交付。运维服务商可以降低成本，提升服务质量。
            </div>
          </div>
        </div>
      </div>
      <div className={cls.background}>
        <img src="/img/passport/shareCloud/passport_bg.png"></img>
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
      </div>
    </div>
  );
};
export default ShareCloudLayout;
