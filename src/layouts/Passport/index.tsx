import React from 'react';
import { renderRoutes } from 'react-router-config';
import { getResouces } from '@/config/location';
import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
import { Carousel } from 'antd';
const passportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const resources = getResouces();
  return (
    <div className={cls.container}>
      <div className={cls.slider}>
        <Carousel autoplay autoplaySpeed={4000} dots={{ className: 'passportDots' }}>
          {resources.passport.map((index) => {
            return (
              <div key={index}>
                <img
                  key={index}
                  className={cls.sliderImg}
                  src={`/img/${resources.location}/passport/page${index}.png`}
                  alt=""
                />
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className={cls.background}>
        <img alt={''} src={`/img/${resources.location}/passport/background.png`} />
      </div>
      <div className={cls.login}>
        <div className={cls.loginBox}>{renderRoutes(route.routes)}</div>
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
            {resources.unitName !== '' ? '主办单位：' : ''}
            <a
              href={resources.unitPage}
              target="_blank"
              style={{ color: '#8a8a8a' }}
              rel="noopener noreferrer">
              {resources.unitName}
            </a>
            &nbsp;
          </div>
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
export default passportLayout;
