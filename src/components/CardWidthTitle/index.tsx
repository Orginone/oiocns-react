import './index.less';

import { EditOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { ReactNode } from 'react';
interface CardWidthTitleType {
  title: string; //props
  children?: ReactNode;
  className?: string;
  btns?: any;
}
// 带头部 卡片模板
const CardWidthTitle: React.FC<CardWidthTitleType> = ({ title, children, className }) => {
  return (
    <>
      <div className={`CardWidthTitle-wrap ${className}`}>
        <ul className="head flex">
          <li className="head-title">
            <Divider plain className="head-title-con">
              {title}
            </Divider>
          </li>
          <Button className="head-btn" icon={<EditOutlined />} size={'small'}></Button>
        </ul>
        {children}
      </div>
    </>
  );
};

export default CardWidthTitle;
