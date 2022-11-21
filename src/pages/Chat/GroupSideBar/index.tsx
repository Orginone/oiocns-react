import { SearchOutlined } from '@ant-design/icons';
import { Input, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import { formatDate } from '@/utils/index';
import sideStyle from './index.module.less';
import { chatCtrl } from '@/ts/controller/chat';
import { deepClone } from '@/ts/base/common';
import { IChat } from '@/ts/core/chat/ichat';

/**
 * @description: 会话列表、通讯录
 * @return {*}
 */
interface MousePosition {
  left: number; // 右键弹窗离左侧的位置
  top: number; // 右键弹窗离上面的位置
  isShowContext: boolean; // 控制右键弹窗是否显示
  selectedItem: ImMsgChildType; // 被选中的某一项
  selectMenu?: MenuItemType[]; // 选择菜单
}

interface MenuItemType {
  value: number;
  label: string;
}

const GroupSideBar = () => {
  const [index, setIndex] = useState('1');
  const [chats, setChats] = useState(chatCtrl.chats);
  const [groups, setGroups] = useState(chatCtrl.groups);
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索值
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    left: 0,
    top: 0,
    isShowContext: false,
    selectedItem: {} as ImMsgChildType,
  });
  const [menuList, setMenuList] = useState<any>([
    { value: 1, label: '置顶会话' },
    { value: 2, label: '清空信息' },
    { value: 3, label: '取消置顶' },
  ]);

  /** 会话过滤功能 */
  const filterChats = (chats: IChat[]): IChat[] => {
    return chats.filter((item) => {
      return (
        item.target.name.includes(searchValue) ||
        item.target.typeName.includes(searchValue) ||
        item.spaceName.includes(searchValue) ||
        (item.lastMessage && item.lastMessage.msgBody.includes(searchValue))
      );
    });
  };

  /**
   * @description: 时间处理
   * @param {string} timeStr
   * @return {*}
   */
  const handleFormatDate = (timeStr: string) => {
    const nowTime = new Date().getTime();
    const showTime = new Date(timeStr).getTime();
    // 超过一天 展示 月/日
    if (nowTime - showTime > 3600 * 24 * 1000) {
      return formatDate(timeStr, 'M月d日');
    }
    // 不超过一天 展示 时/分
    return formatDate(timeStr, 'H:mm');
  };

  /**
   * @description: 鼠标右键事件
   * @param {MouseEvent} e
   * @param {ImMsgChildType} item
   * @return {*}
   */
  const handleContextClick = (e: MouseEvent, item: ImMsgChildType) => {
    if (!item) {
      return;
    }
    setMousePosition({
      left: e.pageX + 6,
      top: e.pageY + 6,
      isShowContext: true,
      selectedItem: item,
      selectMenu: item.isTop ? menuList.slice(1, 3) : menuList.slice(0, 2),
    });
  };

  /**
   * @description: 右键菜单点击
   * @param {MenuItemType} item
   * @return {*}
   */
  const handleContextChange = (item: MenuItemType) => {
    switch (item.value) {
      case 1:
        // chat.setToppingSession(mousePosition.selectedItem, true);
        break;
      case 2:
        // props.clearHistoryMsg()
        break;
      case 3:
        // chat.setToppingSession(mousePosition.selectedItem, false);
        break;

      default:
        break;
    }
  };

  /**
   * @description: 关闭右侧点击出现的弹框
   * @param {any} event
   * @return {*}
   */
  const _handleClick = (event: any) => {
    setMousePosition({
      isShowContext: false,
      left: 0,
      top: 0,
      selectedItem: {} as ImMsgChildType,
    });
  };

  /**
   * @description: 刷新页面
   * @return {*}
   */
  const refreshUI = () => {
    setIndex(chatCtrl.tabIndex);
    setChats(deepClone(chatCtrl.chats));
    setGroups(deepClone(chatCtrl.groups));
  };

  /**
   * @description: 监听点击事件，关闭弹窗
   * @return {*}
   */
  useEffect(() => {
    const id = chatCtrl.subscribe(refreshUI);
    document.addEventListener('click', _handleClick);
    return () => {
      chatCtrl.unsubscribe(id);
      document.removeEventListener('click', _handleClick);
    };
  }, []);

  return (
    <div className={sideStyle.chart_side_wrap}>
      <div className={sideStyle.group_side_bar_search}>
        <Input
          placeholder="搜索"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <Tabs
        activeKey={index}
        onTabClick={(k) => {
          setIndex(k);
        }}>
        <Tabs.TabPane tab="会话" key="1">
          <div className={sideStyle.group_side_bar_wrap}>
            {filterChats(chats).map((child) => {
              return (
                <div
                  className={`${sideStyle.con_body_session} ${
                    chatCtrl.isCurrent(child) ? sideStyle.active : ''
                  }`}
                  key={child.fullId}>
                  <HeadImg name={child.target.name} label={child.target.label} />
                  {child.noReadCount > 0 ? (
                    <div className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                      <span>{child.noReadCount}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  <div
                    className={sideStyle.group_con_show}
                    onClick={() => {
                      chatCtrl.setCurrent(child);
                    }}>
                    <div className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                      <div
                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                        {child.target.name}
                      </div>
                      <div
                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                        {handleFormatDate(
                          child.lastMessage?.createTime || child.target.msgTime,
                        )}
                      </div>
                    </div>
                    <div className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                      {child.lastMessage?.msgBody}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="通讯录" key="2">
          <div
            className={sideStyle.group_side_bar_wrap}
            onContextMenu={(e) => {
              e.preventDefault();
            }}>
            {groups.map((item) => {
              return (
                <div key={item.spaceId}>
                  <div className={`${sideStyle.group_con} ${sideStyle.item}`}>
                    {/* 分组标题 */}
                    <div
                      className={`${sideStyle.con_title} ${sideStyle.flex} ${
                        item.isOpened ? sideStyle.active : ''
                      }`}
                      onClick={() => {
                        chatCtrl.setGroupActive(item);
                      }}>
                      <span>
                        {item.spaceName}({filterChats(item.chats).length})
                      </span>
                    </div>
                    {/* 展开的分组下的人员 */}
                    {item.isOpened ? (
                      <>
                        {filterChats(item.chats).map((child) => {
                          return (
                            <div
                              className={`${sideStyle.con_body} ${
                                chatCtrl.isCurrent(child) ? sideStyle.active : ''
                              }`}
                              key={child.fullId}
                              onContextMenu={(e: any) =>
                                handleContextClick(e, child.target)
                              }>
                              <HeadImg
                                name={child.target.name}
                                label={child.target.label}
                              />
                              {child.noReadCount > 0 ? (
                                <div
                                  className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                                  <span>{child.noReadCount}</span>
                                </div>
                              ) : (
                                ''
                              )}
                              <div
                                className={sideStyle.group_con_show}
                                onClick={() => {
                                  chatCtrl.setCurrent(child);
                                }}>
                                <div
                                  className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                                  <div
                                    className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                                    {child.target.name}
                                  </div>
                                  <div
                                    className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                                    {handleFormatDate(
                                      child.lastMessage?.createTime ||
                                        child.target.msgTime,
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                                  {child.lastMessage?.msgBody}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      ''
                    )}
                    {/* 如果该分组没有被打开 但是有未读消息 则把未读消息会话显示出来 */}
                    <>
                      {!item.isOpened ? (
                        <>
                          {filterChats(item.chats)
                            .filter((v) => v.noReadCount > 0)
                            .map((child) => {
                              return (
                                <div
                                  key={child.spaceId + child.chatId}
                                  className={`${sideStyle.con_body} ${sideStyle.open_item}`}>
                                  <HeadImg
                                    name={child.target.name}
                                    label={child.target.label}
                                  />
                                  {child.noReadCount > 0 ? (
                                    <div
                                      className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                                      <span>{child.noReadCount}</span>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                  <div
                                    className={`${sideStyle.group_con_show}`}
                                    onClick={() => {
                                      chatCtrl.setCurrent(child);
                                    }}>
                                    <div
                                      className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                                      <div
                                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                                        {child.target.name}
                                      </div>
                                      <div
                                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                                        {handleFormatDate(
                                          child.lastMessage?.createTime ||
                                            child.target.msgTime,
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                                      {child.lastMessage?.msgBody}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      ) : (
                        ''
                      )}
                    </>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.TabPane>
      </Tabs>
      {/* 鼠标右键 */}
      {mousePosition.isShowContext ? (
        <div
          className={sideStyle.context_text_wrap}
          style={{ left: `${mousePosition.left}px`, top: `${mousePosition.top}px` }}>
          {mousePosition.selectMenu?.map((item) => {
            return (
              <div
                key={item.value}
                className={sideStyle.context_menu_item}
                onClick={() => {
                  handleContextChange(item);
                }}>
                {item.label}
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default GroupSideBar;
