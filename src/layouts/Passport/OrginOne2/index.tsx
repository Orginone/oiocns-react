import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const OrginOneLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
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
              className={`${cls.sliderSlidesItemImg} ${cls.higher_img}`}
              src="/img/passport/orginOne2/passport_img1.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemText}>
              <div className={cls.sliderSlidesItemTextTitle}>门户</div>
              <div className={cls.sliderSlidesItemTextContent}>
                汇聚各类动态信息，新闻资讯，交易商城，监控大屏，驾驶舱。用户可以按权限自由定义，千人千面。{' '}
              </div>
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne2/passport_img2.png"
              alt=""
            />{' '}
            <div className={cls.sliderSlidesItemText}>
              <div className={cls.sliderSlidesItemTextTitle}>沟通</div>
              <div className={cls.sliderSlidesItemTextContent}>
                为个人和组织提供可靠、安全、私密的即时沟通工具，个人会话隐私保护优先，组织会话单位数据权利归属优先。{' '}
              </div>
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne2/passport_img3.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemText}>
              <div className={cls.sliderSlidesItemTextTitle}>办事</div>
              <div className={cls.sliderSlidesItemTextContent}>
                满足各类组织和跨组织协同办公，适应各类业务场景，支持发起、待办、已办、已完结等不同状态流程类业务审核审批查阅。
              </div>
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne2/passport_img4.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemText}>
              <div className={cls.sliderSlidesItemTextTitle}>存储</div>
              <div className={cls.sliderSlidesItemTextContent}>
                提供各类文件、数据、应用的存储空间。具有操作系统级文件和资源管理器功能。{' '}
              </div>
            </div>
          </div>
          <div className={cls.sliderSlidesItem}>
            <img
              className={cls.sliderSlidesItemImg}
              src="/img/passport/orginOne2/passport_img5.png"
              alt=""
            />
            <div className={cls.sliderSlidesItemText}>
              <div className={cls.sliderSlidesItemTextTitle}>设置</div>
              <div className={cls.sliderSlidesItemTextContent}>
                进行个人和组织的关系设置，数据标准、办事和应用的定义和管理。无代码自定义表单、规则，灵活的流程配置。支持各类资源注册和管理。{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cls.background}>
        <img src="/img/passport/orginOne2/passport_bg.png"></img>
      </div>
      <div className={cls.cover}></div>
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
      <div className={cls.copyright}>
        <div>© 2023 资产云开放协同创新中心 主办单位：浙江省财政厅</div>
        <div>Powered by Orginone </div>
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
              background: index === 1 ? '#5E99FF' : '#CCDAFD',
              width: index === 1 ? '64px' : '',
            }}
            htmlFor="btn1"></label>
        </div>
        <div className={cls.countItem}>
          <label
            className={cls.btn_2}
            style={{
              background: index === 2 ? '#5E99FF' : '#CCDAFD',
              width: index === 2 ? '64px' : '',
            }}
            htmlFor="btn2"></label>
        </div>
        <div className={cls.countItem}>
          <label
            className={cls.btn_3}
            style={{
              background: index === 3 ? '#5E99FF' : '#CCDAFD',
              width: index === 3 ? '64px' : '',
            }}
            htmlFor="btn3"></label>
        </div>
        <div className={cls.countItem}>
          <label
            className={cls.btn_4}
            style={{
              background: index === 4 ? '#5E99FF' : '#CCDAFD',
              width: index === 4 ? '64px' : '',
            }}
            htmlFor="btn4"></label>
        </div>
        <div className={cls.countItem}>
          <label
            className={cls.btn_5}
            style={{
              background: index === 5 ? '#5E99FF' : '#CCDAFD',
              width: index === 5 ? '64px' : '',
            }}
            htmlFor="btn5"></label>
        </div>
      </div>
    </div>
  );
};
export default OrginOneLayout;
