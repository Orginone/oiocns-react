import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { getResouces } from '@/config/location';
import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const passportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [index, setIndex] = useState(1);
  const resources = getResouces();
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;
        if (nextIndex === resources.passport.length + 1) {
          nextIndex = 1;
        }
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const choosePic = (e: React.MouseEvent<HTMLDivElement>) => {
    const chooseIndex = parseInt(e.currentTarget.id.charAt(3));
    setIndex(chooseIndex);
  };
  return (
    <div className={cls.container}>
      <div className={cls.slider}>
        <img
          style={{ height: '100vh' }}
          src={`/img/${resources.location}/passport/page${index}.png`}
          alt=""
        />
        {resources.passport.map((i) => {
          return (
            <input
              key={`btn${i}`}
              id={`btn${i}`}
              className={cls[`btn${i}`]}
              type="radio"
              onClick={choosePic}
            />
          );
        })}
        <div className={cls.count}>
          {resources.passport.map((i) => {
            return (
              <div key={`countItem${i}`} className={cls.countItem}>
                <label
                  style={{
                    background: index === i ? '#ffffff' : '#eff5ff',
                    width: index === i ? '32px' : '',
                  }}
                  htmlFor={`btn${i}`}></label>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cls.content}>
        <div></div>
        <div style={{ width: 350 }}>{renderRoutes(route.routes)}</div>
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
        </div>
      </div>
    </div>
  );
};
export default passportLayout;
