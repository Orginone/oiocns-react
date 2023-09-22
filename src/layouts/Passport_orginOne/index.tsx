import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
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
      <div className={cls.logo}>
        <img src="/img/logo/logo3.jpg" alt="" />
        <div className={cls.logoTitle}>
          <div className={cls.logoTitleZh}>奥集能</div>
          <div className={cls.logoTitleEn}>Orginone </div>
        </div>
      </div>
      <div className={cls.slider}>
        <div className={cls.sliderSlides} style={{ marginLeft: slidesMargin }}>
          <div className={cls.sliderSlidesItem}>
            <img
              className={`${cls.sliderSlidesItemImg} ${cls.higher_img} `}
              src="/img/passport/orginOne/passport_img1.png"
              alt=""
            />
            <div className={`${cls.sliderSlidesItemTitle} ${cls.higher_text}`}>门户</div>
            <div className={`${cls.sliderSlidesItemContent}  ${cls.higher_text}`}>
              这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img2.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>沟通</div>
            <div className={cls.sliderSlidesItemContent}>
              这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img3.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>办事</div>
            <div className={cls.sliderSlidesItemContent}>
              这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img4.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>存储</div>
            <div className={cls.sliderSlidesItemContent}>
              这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne/passport_img5.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemTitle}>设置</div>
            <div className={cls.sliderSlidesItemContent}>
              这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍这里是文字介绍
            </div>
          </div>
        </div>
      </div>
      <img className={cls.wave} src="/img/passport/orginOne/passport_bg.png" alt="" />
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
      <div className={cls.copyright}>
        © 2023 资产云开放协同创新中心 主办单位：浙江省财政厅
      </div>

      {/*轮播图按钮*/}
      <input id="btn1" className={cls.btn1} type="radio" onClick={choosePic} />
      <input id="btn2" className={cls.btn2} type="radio" onClick={choosePic} />
      <input id="btn3" className={cls.btn3} type="radio" onClick={choosePic} />
      <input id="btn4" className={cls.btn4} type="radio" onClick={choosePic} />
      <input id="btn5" className={cls.btn5} type="radio" onClick={choosePic} />
      <div className={cls.count}>
        <ul>
          <li>
            <label
              style={{
                background: index === 1 ? '#5e99ff' : '#e6edfe',
                width: index === 1 ? '50px' : '',
              }}
              htmlFor="btn1"></label>
          </li>
          <li>
            <label
              className={cls.btn_2}
              style={{
                background: index === 2 ? '#5e99ff' : '#e6edfe',
                width: index === 2 ? '50px' : '',
                marginLeft: index <= 1 ? '36px' : '0px',
              }}
              htmlFor="btn2"></label>
          </li>
          <li>
            <label
              className={cls.btn_3}
              style={{
                background: index === 3 ? '#5e99ff' : '#e6edfe',
                width: index === 3 ? '50px' : '',
                marginLeft: index <= 2 ? '36px' : '0px',
              }}
              htmlFor="btn3"></label>
          </li>
          <li>
            <label
              className={cls.btn_4}
              style={{
                background: index === 4 ? '#5e99ff' : '#e6edfe',
                width: index === 4 ? '50px' : '',
                marginLeft: index <= 3 ? '36px' : '0px',
              }}
              htmlFor="btn4"></label>
          </li>
          <li>
            <label
              className={cls.btn_5}
              style={{
                background: index === 5 ? '#5e99ff' : '#e6edfe',
                width: index === 5 ? '50px' : '',
                marginLeft: index <= 4 ? '36px' : '0px',
              }}
              htmlFor="btn5"></label>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PassportLayout;
