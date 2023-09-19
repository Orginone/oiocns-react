import React, { JSX } from 'react';
import { renderRoutes } from 'react-router-config';

import type { IRouteConfig } from 'typings/globelType';

import cls from './index.module.less';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const [text, setText] = React.useState<JSX.Element>(
    <div>
      这是一段示例文字
      <br />
      这是一段示例文字
      <br />
      这是一段示例文字
      <br />
      这是一段示例文字
      <br />
      这是一段示例文字
    </div>,
  );
  return (
    <div className={cls.contaner}>
      <img className={cls.wave} src="/img/passport_bg.png" alt="" />
      <div className={cls.img}>
        <img src="/img/passport_img.png" alt="" />
        {text}
      </div>
      <div className={cls.box}>
        <div>{renderRoutes(route.routes)}</div>
      </div>
    </div>
  );
};
export default PassportLayout;
