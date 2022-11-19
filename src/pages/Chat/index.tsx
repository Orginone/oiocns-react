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
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false); // 展开关闭详情
  const [writeContent, setWriteContent] = useState<any>(null); // 重新编辑
  const [curChats, setCurChats] = useState<any>(null); // 设置当前对话框
  const [HistoryMesagesList, setHistoryMesagesList] = useState<any>([]); // 当前对话框的历史消息

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

  /**
   * @description: 设置当前对话框
   * @param {ImMsgChildType} curs
   * @return {*}
   */
  const setCurrent = (curs: ImMsgChildType) => {
    setCurChats(curs);
  };

  /**
   * @description: 查询当前对话框历史消息的回调
   * @param {any} megs
   * @return {*}
   */
  const getHistoryMesages = (megs: any) => {
    setHistoryMesagesList(megs);
  };

  /**
   * @description: 删除消息的回调
   * @return {*}
   */
  const deleteMsgCallback = (delMegs: any) => {
    setHistoryMesagesList(delMegs);
  };

  /**
   * @description: 清空聊天记录的回调
   * @param {any} clearMsgs
   * @return {*}
   */
  const clearMsgCallback = (clearMsgs: any) => {
    setHistoryMesagesList(clearMsgs);
  };

  return (
    <div className={charsStyle.cohort_wrap}>
      {/* 导航栏 */}
      <div className={charsStyle.custom_group_silder_menu}>
        <GroupSideBar setCurrent={setCurrent} getHistoryMesages={getHistoryMesages} />
      </div>
      {/* 主体 */}
      <div className={charsStyle.chart_page}>
        {curChats !== null ? (
          <>
            {/* 头部 */}
            <GroupHeader handleViewDetail={handleViewDetail} />
            {/* 聊天区域 */}
            <div className={charsStyle.chart_content}>
              <GroupContent
                handleReWrites={handleReWrites}
                historyMesagesList={HistoryMesagesList}
                deleteMsgCallback={deleteMsgCallback}
              />
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
      {isShowDetail === true ? <GroupDetail clearMsgCallback={clearMsgCallback} /> : ''}
    </div>
  );
};
export default Chat;
