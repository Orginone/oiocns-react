import './index.less';
import { AiOutlineEdit } from 'react-icons/ai';
import { Button, Divider } from 'antd';
import React, { ReactNode } from 'react';

interface IProps {
  title?: string; //props
  children?: ReactNode;
  className?: string;
  btns?: any;
}
// 带头部 卡片模板
const CardWidthTitle: React.FC<IProps> = ({ title, children, className }) => {
  return (
    <>
      <div className={`CardWidthTitle-wrap ${className}`}>
        {title && (
          <ul className="head flex">
            <li className="head-title">
              <Divider plain className="head-title-con">
                {title}
              </Divider>
            </li>

            <Button className="head-btn" icon={<AiOutlineEdit />} size={'small'}></Button>
          </ul>
        )}
        {children}
      </div>
    </>
  );
};

export default CardWidthTitle;
