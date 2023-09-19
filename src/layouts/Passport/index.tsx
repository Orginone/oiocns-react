import React, { JSX } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [text, setText] = React.useState<JSX.Element>(
    <div>
      奥集能是面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
    </div>,
  );
  return (
    <div className={cls.contaner}>
      <div className={cls.logo}>
        <img src="/img/logo.jpg" alt="" />
        <div className={cls.text}>
          <div className={cls.title_zh}>奥集能</div>
          <div className={cls.title_en}>Orginone </div>
        </div>
      </div>
      <img className={cls.wave} src="/img/passport_bg.png" alt="" />
      <div className={cls.img}>
        <img src="/img/passport_img.png" alt="" />
        {text}
      </div>
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
      <div className={cls.right}>
        © 2023 资产云开放协同创新中心 主办单位：浙江省财政厅
      </div>
    </div>
  );
};
export default PassportLayout;
