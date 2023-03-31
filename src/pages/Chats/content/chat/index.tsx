import chatCtrl from '@/ts/controller/chat';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import React, { useState } from 'react';
import GroupContent from './GroupContent';
import GroupInputBox from './GroupInputBox';
import GroupDetail from './GroupDetail';
import charsStyle from './index.module.less';
import { WechatOutlined } from '@ant-design/icons';

/**
 * @description: 沟通聊天
 * @return {*}
 */
const Chat: React.FC<any> = ({ openDetail }: { openDetail: boolean }) => {
  const [key] = useCtrlUpdate(chatCtrl);
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
    <div id={key} className={charsStyle.cohort_wrap}>
      {/* 主体 */}
      {chatCtrl.chat ? (
        <div className={charsStyle.chart_page}>
          {/* 聊天区域 */}
          <GroupContent handleReWrites={handleReWrites} />
          {/* 输入区域 */}
          <div className={charsStyle.chart_input}>
            <GroupInputBox writeContent={writeContent} />
          </div>
        </div>
      ) : (
        <div className={charsStyle.chart_page}>
          <div className={charsStyle.chart_empty}>
            <WechatOutlined style={{ fontSize: 140 }} />
          </div>
        </div>
      )}
      {/**回话详情 */}
      {openDetail && <GroupDetail />}
    </div>
  );
};
export default Chat;
