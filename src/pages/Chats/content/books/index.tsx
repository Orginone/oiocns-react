import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  selectMenu: MenuItemType;
}

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<IProps> = (props) => {
  // const [key] = useCtrlUpdate(chatCtrl);
  // const loadData = () => {};
  // return (
  //   <div id={key} className={charsStyle.cohort_wrap}>
  //     {/* 主体 */}
  //     {chatCtrl.chat ? (
  //       <div className={charsStyle.chart_page}>
  //         {/* 头部 */}
  //         <GroupHeader handleViewDetail={handleViewDetail} />
  //         {/* 聊天区域 */}
  //         <GroupContent handleReWrites={handleReWrites} />
  //         {/* 输入区域 */}
  //         <div className={charsStyle.chart_input}>
  //           <GroupInputBox writeContent={writeContent} />
  //         </div>
  //       </div>
  //     ) : (
  //       <div className={charsStyle.chart_page}>
  //         <div className={charsStyle.chart_empty}>
  //           <WechatOutlined style={{ fontSize: 140 }} />
  //         </div>
  //       </div>
  //     )}
  //     {/* 详情 */}
  //     {isShowDetail ? <GroupDetail /> : ''}
  //   </div>
  // );

  return <></>;
};
export default Book;
