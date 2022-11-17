/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-17 10:05:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-17 11:15:26
 * @FilePath: /oiocns-react/src/bizcomponents/TreeLeftPage/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import Creategroup from './Creategroup';
import Joingroup from './Joingroup';

import cls from './index.module.less';

const TreeLeftPage: React.FC = () => {
  return (
    <div className={cls.topMes}>
      <Creategroup/>
      <Joingroup/>
    </div>
  );
};

export default TreeLeftPage;