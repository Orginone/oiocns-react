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
          {resources.unitName !== '' && (
            <div className={cls.copyrightZh}>
              主办单位：
              <a
                href={resources.unitPage}
                target="_blank"
                style={{ color: '#8a8a8a' }}
                rel="noopener noreferrer">
                {resources.unitName}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default authPage;
