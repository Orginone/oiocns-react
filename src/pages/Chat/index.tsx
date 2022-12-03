import chatCtrl from '@/ts/controller/chat';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import React, { useState } from 'react';
import GroupContent from './GroupContent';
import GroupDetail from './GroupDetail';
import GroupHeader from './GroupHeader';
import GroupInputBox from './GroupInputBox';
import GroupSideBar from './GroupSideBar';
import charsStyle from './index.module.less';

/**
 * @description: 沟通聊天
 * @return {*}
 */

const Chat: React.FC = () => {
  const [key] = useCtrlUpdate(chatCtrl);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false); // 展开关闭详情
  const [writeContent, setWriteContent] = useState<any>(null); // 重新编辑

  /**
   * @description: 展开详情页
   * @return {*}
   */
  const handleViewDetail = () => {
    setIsShowDetail(!isShowDetail);
  };

  /**
   * @description: 重新编辑
   * @param {string} write
   * @return {*}
   */
  const handleReWrites = (write: string) => {
    setWriteContent(write);
  };

  return (
    <div key={key} className={charsStyle.cohort_wrap}>
      {/* 导航栏 */}
      <div className={charsStyle.custom_group_silder_menu}>
        <GroupSideBar />
      </div>
      {/* 主体 */}
      {chatCtrl.chat ? (
        <div className={charsStyle.chart_page}>
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
        </div>
      ) : (
        <div className={charsStyle.chart_page}>
          <div className={charsStyle.chart_empty}>奥集能平台</div>
        </div>
      )}
      {/* 详情 */}
      {isShowDetail ? <GroupDetail /> : ''}
    </div>
  );
};
export default Chat;
