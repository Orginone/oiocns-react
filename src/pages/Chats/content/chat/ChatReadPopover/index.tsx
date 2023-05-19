import React, { ReactNode } from 'react';
import { Popover } from 'antd';
import ReadCss from './index.module.less';

interface Iprops {
  children: ReactNode;
  content: ReactNode;
}

const ChatReadPopover: React.FC<Iprops> = ({ children, content }) => {
  return (
    <Popover
      className={ReadCss.description}
      placement="leftTop"
      title={'消息接收人列表'}
      content={content}
      trigger="click">
      {children}
    </Popover>
  );
};

export default ChatReadPopover;
