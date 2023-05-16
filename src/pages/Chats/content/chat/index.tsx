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
  const [citeText, setCiteText] = useState<string>(''); // 引用值
  const [enterCiteMsg, setEnterCiteMsg] = useState<string | any>(); // 回车赋值

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
        <GroupContent
          chat={chat}
          handleReWrites={handleReWrites}
          filter={filter}
          citeText={(text: any) => setCiteText(text)}
          enterCiteMsg={enterCiteMsg}
        />
        {/* 输入区域 */}
        <div className={charsStyle.chart_input}>
          <GroupInputBox
            chat={chat}
            writeContent={writeContent}
            citeText={citeText} // 传递引用的值给聊天框组件
            closeCite={(e: string) => setCiteText(e)} // 设置关闭引用下的值
            enterCiteMsg={(e: any) => setEnterCiteMsg(e)} // 设置回车时把所引用的值赋值
          />
        </div>
      </div>
      {/**会话详情 */}
      {openDetail && <GroupDetail chat={chat} filter={filter} />}
    </div>
  );
};
export default Chat;
