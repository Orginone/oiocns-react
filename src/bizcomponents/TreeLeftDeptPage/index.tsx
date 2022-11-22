/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-17 10:05:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-19 17:27:48
 * @FilePath: /oiocns-react/src/bizcomponents/TreeLeftPage/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import Creategroup from './Creategroup';
import settingStore from '@/store/setting';


import cls from './index.module.less';

type TreeLeftPageProps = {
  onSelect?: () => void;
  createTitle?: string,
  isJoingroup?: boolean;
  isCreategroup?: boolean;
  onClick: ()=> void;
}

const TreeLeftPage: React.FC<TreeLeftPageProps> = ({ 
  isCreategroup = true,
  createTitle = "添加岗位",
  onClick,
}) => {
  const { setSelectId } = settingStore((state) => ({ ...state}))
  return (
    <div className={cls.topMes}>
      {isCreategroup && <Creategroup onClick={onClick} createTitle={createTitle } onSelect={(e) => {
        if (e[0]) {
          setSelectId(e[0])
        }
      }} /> }
    </div>
  );
};

export default TreeLeftPage;