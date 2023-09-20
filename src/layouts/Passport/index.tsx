import React, { JSX, useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [index, setIndex] = useState(1);
  const [slidesMargin, setSlidesMargin] = useState('0');

  // 每隔一段时间更改图片
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
        <div className={cls.slides} style={{ marginLeft: slidesMargin }}>
          <div className={cls.slide}>
            <img src="/img/passport_img1.png" alt="" />
            <div>
              奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </div>
          <div className={cls.slide}>
            <img src="/img/passport_img2.png" alt="" />
            <div>
              奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </div>
          <div className={cls.slide}>
            <img src="/img/passport_img3.png" alt="" />
            <div>
              奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </div>
          <div className={cls.slide}>
            <img src="/img/passport_img4.png" alt="" />
            <div>
              奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </div>
          <div className={cls.slide}>
            <img src="/img/passport_img5.png" alt="" />
            <div>
              奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </div>
        </div>
      </div>
      <img className={cls.wave} src="/img/passport_bg.png" alt="" />
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
          <li className={cls.current}>
            <label
              style={{ background: index === 1 ? 'white' : '#5e99ff' }}
              htmlFor="btn1"></label>
          </li>
          <li>
            <label
              className={cls.btn_2}
              style={{ background: index === 2 ? 'white' : '#5e99ff' }}
              htmlFor="btn2"></label>
          </li>
          <li>
            <label
              className={cls.btn_3}
              style={{ background: index === 3 ? 'white' : '#5e99ff' }}
              htmlFor="btn3"></label>
          </li>
          <li>
            <label
              className={cls.btn_4}
              style={{ background: index === 4 ? 'white' : '#5e99ff' }}
              htmlFor="btn4"></label>
          </li>
          <li>
            <label
              className={cls.btn_5}
              style={{ background: index === 5 ? 'white' : '#5e99ff' }}
              htmlFor="btn5"></label>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PassportLayout;
