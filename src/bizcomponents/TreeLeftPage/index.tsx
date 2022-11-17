/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-17 10:05:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-17 16:07:15
 * @FilePath: /oiocns-react/src/bizcomponents/TreeLeftPage/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import Creategroup from './Creategroup';
import Joingroup from './Joingroup';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';

type TreeLeftPageProps = {
  onSelect?: () => void;
}

const TreeLeftPage: React.FC<TreeLeftPageProps> = ({ 
 
}) => {
  const history = useHistory();
  return (
    <div className={cls.topMes}>
      <Creategroup onSelect={(e) => {
        history.push(`/setting/group/${e}`)
       }} />
      <Joingroup/>
    </div>
  );
};

export default TreeLeftPage;