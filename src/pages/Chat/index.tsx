import React, { useState } from 'react';
import useChatStore from '@/store/chat';
import GroupContent from './GroupContent';
import GroupDetail from './GroupDetail';
import GroupHeader from './GroupHeader';
import GroupInputBox from './GroupInputBox';
import GroupSideBar from './GroupSideBar';
import charsStyle from './index.module.less';

/* 
  沟通聊天
*/
const Chat: React.FC = () => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [writeContent, setWriteContent] = useState<any>(null);
  const ChatStore: any = useChatStore();
  // 展开详情页
  const handleViewDetail = () => {
    setIsShowDetail(!isShowDetail);
  };
  // 重新编辑
  const handleReWrites = (write: string) => {
    setWriteContent(write);
  };

  return (
    <div className={charsStyle.cohort_wrap}>
      {/* 导航栏 */}
      <div className={charsStyle.custom_group_silder_menu}>
        <GroupSideBar />
      </div>
      {/* 主体 */}
      <div className={charsStyle.chart_page}>
        {ChatStore.curChat !== null ? (
          <>
            {/* 头部 */}
            <GroupHeader handleViewDetail={handleViewDetail} />
            {/* 聊天区域 */}
            <div className={charsStyle.chart_content}>
              <GroupContent handleReWrites={handleReWrites} />
            </div>
            {/* 输入区域 */}
            <div className={charsStyle.chart_input}>
              <GroupInputBox writeContent={writeContent} />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      {/* 详情 */}
      {isShowDetail === true ? <GroupDetail /> : ''}
    </div>
  );
};
export default Chat;
