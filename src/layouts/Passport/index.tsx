import React from 'react';
import { renderRoutes } from 'react-router-config';

import passport from '@/assets/img/passport.png';
import type { IRouteConfig } from '@/routes/config';

import cls from './index.module.less';

const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  return (
    <div className={cls.contaner}>
      <img className={cls.bg} src={passport} alt="" />
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
    </div>
  );
};
export default PassportLayout;
