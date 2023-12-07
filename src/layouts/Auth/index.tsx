import React from 'react';
import cls from './index.module.less';
import { getResouces } from '@/config/location';
import AuthContent from './content';

import { Carousel } from 'antd';
const authPage: React.FC = () => {
  const resources = getResouces();
  return (
    <div className={cls.auth_body}>
      <div
        className={cls.slider}
        style={{
          backgroundImage: `url(/img/${resources.location}/passport/background.png)`,
        }}>
        <Carousel
          autoplay
          draggable
          autoplaySpeed={4000}
          style={{ height: 'calc(100vh - 30px)', cursor: 'pointer' }}
          dots={{ className: 'carousel' }}>
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
      <div className={cls.content}>
        <div className={cls.auth}>
          <AuthContent />
        </div>
        <div className={cls.copyright}>
          <div className={cls.copyrightEn}>
            <a
              href="https://orginone.cn"
              target="_blank"
              style={{ color: '#8a8a8a' }}
              rel="noopener noreferrer">
              Powered by Orginone
            </a>
          </div>
          {resources.unitName.length && (
            <div className={`${cls.copyrightZh} ${cls[resources.display || 'block']}`}>
              主办单位：
              {resources.unitPage.map((item, idx) => (
                <a
                  key={idx}
                  href={item}
                  target="_blank"
                  style={{ color: '#8a8a8a', marginRight: '8px' }}
                  rel="noopener noreferrer">
                  {resources.unitName[idx]}
                </a>
              ))}
            </div>
          )}
          <div className={`${cls.copyrightZh} ${cls[resources.display || 'block']}`}>
            技术支持：
            <a
              href="https://assetcloud.orginone.cn/#/"
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
export default authPage;
