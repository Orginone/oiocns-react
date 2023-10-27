import React from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
import './index.less';
import { Carousel } from 'antd';

export interface eachSlider {
  title: string;
  content: string;
}
interface IProps {
  route: IRouteConfig;
  imgDir: String; // 图片地址，比如 /img/passport/orginOne/
  sliders: eachSlider[];
  logo: React.ReactNode;
  loginLabel: React.ReactNode;
  background: React.ReactNode;
  textColor?: 'dark' | 'light';
}
const BasicLayout: React.FC<IProps> = ({
  route,
  imgDir,
  sliders,
  logo,
  loginLabel,
  background,
  textColor = 'dark',
}) => {
  return (
    <div className={cls.container}>
      <div className={cls.logo}>{logo}</div>
      <div className={cls.slider}>
        <Carousel
          autoplay
          autoplaySpeed={4000}
          className={cls.sliderSlides}
          dots={{ className: 'passportDots' }}>
          {sliders.map((eachSlider, index) => {
            return (
              <div key={index} className={cls.sliderSlidesItem}>
                <img
                  className={cls.sliderSlidesItemImg}
                  src={imgDir + 'passport_img' + (index + 1).toString() + '.png'}
                  alt=""
                />
                <div
                  className={
                    textColor === 'dark'
                      ? `${cls.sliderSlidesItemTitle} ${cls.dark}`
                      : `${cls.sliderSlidesItemTitle} ${cls.light}`
                  }>
                  {eachSlider.title}
                </div>
                <div
                  className={
                    textColor === 'dark'
                      ? `${cls.sliderSlidesItemContent} ${cls.dark}`
                      : `${cls.sliderSlidesItemContent} ${cls.light}`
                  }>
                  {eachSlider.content}
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className={cls.background}>{background}</div>
      <div className={cls.box}>
        {loginLabel}
        <div>{renderRoutes(route.routes)}</div>
      </div>
      <div className={cls.copyright}>
        <div className={cls.copyrightEn}>
          <a
            href="https://orginone.cn"
            target="_blank"
            style={{ color: '#8a8a8a' }}
            rel="noopener noreferrer">
            Powered by Orginone{' '}
          </a>
        </div>
        <div className={cls.copyrightZh}>
          <div>
            主办单位：
            <a
              href="https://czt.zj.gov.cn"
              target="_blank"
              style={{ color: '#8a8a8a' }}
              rel="noopener noreferrer">
              浙江省财政厅
            </a>
          </div>
          &nbsp;
          <div>
            技术支持：
            <a
              href="https://assetcloud.org.cn"
              target="_blank"
              style={{ color: '#8a8a8a' }}
              rel="noopener noreferrer">
              资产云开放协同创新中心
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicLayout;
