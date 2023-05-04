import React, { useState } from 'react';
import GroupContent from './GroupContent';
import GroupInputBox from './GroupInputBox';
import GroupDetail from './GroupDetail';
import charsStyle from './index.module.less';
import { IMsgChat } from '@/ts/core';

/**
 * @description: 沟通聊天
 * @return {*}
 */
const Chat: React.FC<any> = ({
  openDetail,
  chat,
  filter,
}: {
  openDetail: boolean;
  chat: IMsgChat;
  filter: string;
}) => {
  const [writeContent, setWriteContent] = useState<any>(null); // 重新编辑

  /**
   * @description: 重新编辑
   * @param {string} write
   * @return {*}
   */
  const handleReWrites = (write: string) => {
    setWriteContent(write);
  };

  return (
    <div className={charsStyle.cohort_wrap}>
      {/* 主体 */}
      <div className={charsStyle.chart_page}>
        {/* 聊天区域 */}
        <GroupContent chat={chat} handleReWrites={handleReWrites} filter={filter} />
        {/* 输入区域 */}
        <div className={charsStyle.chart_input}>
          <GroupInputBox chat={chat} writeContent={writeContent} />
        </div>
      </div>
      {/**回话详情 */}
      {openDetail && <GroupDetail chat={chat} />}
    </div>
  );
};
export default Chat;
