import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { getLoginBars } from '@/config/location';
import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const passportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [index, setIndex] = useState(1);
  const [slidesMargin, setSlidesMargin] = useState('0');
  const loginBars = getLoginBars();
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;
        if (nextIndex === loginBars.sliders.length + 1) {
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
      <div className={cls.logo}>{loginBars.logoName}</div>
      <div className={cls.slider}>
        <div className={cls.sliderSlides} style={{ marginLeft: slidesMargin }}>
          {loginBars.sliders.map((slider, index) => {
            return (
              <div key={`slider${index}`} className={cls.sliderSlidesItem}>
                <img className={cls.sliderSlidesItemImg} src={slider.backImg} alt="" />
                <div className={cls.sliderSlidesItemTitle}>{slider.title}</div>
                <div className={cls.sliderSlidesItemContent}>{slider.context}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cls.background}>
        <img src={loginBars.background} alt=""></img>
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
      {loginBars.sliders.map((_, i) => {
        return (
          <input
            key={`btn${i + 1}`}
            id={`btn${i + 1}`}
            className={cls[`btn${i + 1}`]}
            type="radio"
            onClick={choosePic}
          />
        );
      })}
      <div className={cls.count}>
        {loginBars.sliders.map((_, i) => {
          return (
            <div key={`countItem${i + 1}`} className={cls.countItem}>
              <label
                style={{
                  background: index === i + 1 ? '#ffffff' : '#eff5ff',
                  width: index === i + 1 ? '32px' : '',
                }}
                htmlFor={`btn${i + 1}`}></label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default passportLayout;
