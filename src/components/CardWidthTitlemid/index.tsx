import './index.less';
import { AiOutlineEdit } from '@/icons/ai';
import { Button, Divider } from 'antd';
import React, { ReactNode } from 'react';

interface IProps {
  title: string; //props
  title2:string;
  children?: ReactNode;
  className?: string;
  btns?: any;
}
// 带头部 卡片模板
const CardWidthTitle: React.FC<IProps> = ({ title, children, className,title2 }) => {
  return (
    <>
      <div className={`CardWidthTitle-wrap ${className}`}>
        <ul className="head flex">
          <li className="head-title">
            <Divider plain className="head-title-con">
              {title}
            </Divider>
          </li>
          <Button className="head-btn" icon={<AiOutlineEdit />} size={'small'}></Button>
        </ul>
        <ul >
          <li className="headmid">
              {title2}
          </li>
        </ul>
        {children}
      </div>
    </>
  );
};

export default CardWidthTitle;
