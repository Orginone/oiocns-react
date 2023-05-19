import React from 'react';
import cls from './index.module.less';
import { IAuthority } from '@/ts/core';

interface IProps {
  current: IAuthority;
}
/**
 * 权限设定
 * @returns
 */
const AuthorityStandrad: React.FC<IProps> = ({ current }: IProps) => {
  return <div className={cls[`dept-content-box`]}></div>;
};

export default AuthorityStandrad;
