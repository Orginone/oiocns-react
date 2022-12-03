import * as imIcon from 'react-icons/im';
import { Input, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import sideStyle from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import { IChat } from '@/ts/core/chat/ichat';
import ContentMenu from '@/components/ContentMenu';
import { handleFormatDate } from '@/utils/tools';
import { MessageType, TargetType } from '@/ts/core/enum';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';

/**
 * @description: 右键菜单信息
 * @return {*}
 */
interface MousePosition {
  left?: number; // 右键弹窗离左侧的位置
  top?: number; // 右键弹窗离上面的位置
  isShowContext: boolean; // 控制右键弹窗是否显示
  selectedItem?: IChat; // 被选中的某一项
  selectMenu?: MenuItemType[]; // 选择菜单
}

interface MenuItemType {
  value: number;
  label: string;
}

const GroupSideBar: React.FC = () => {
  const [key] = useCtrlUpdate(chatCtrl);
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索值
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    isShowContext: false,
  });

  /** 会话过滤功能 */
  const filterChats = (chats: IChat[], noreadOnly: boolean = false): IChat[] => {
    const sortNumber = (c: IChat) => {
      let sum = 0;
      if (c.isToping) {
        sum += 10;
      }
      if (c.lastMessage) {
        sum += 2;
      }
      return sum;
    };
    return chats
      .filter((item) => {
        return (
          (!noreadOnly || item.noReadCount > 0) &&
          (item.target.name.includes(searchValue) ||
            item.target.typeName.includes(searchValue) ||
            item.spaceName.includes(searchValue) ||
            (item.lastMessage && item.lastMessage.msgBody.includes(searchValue)))
        );
      })
      .sort((a, b) => {
        const num = sortNumber(b) - sortNumber(a);
        if (num === 0) {
          const atime = new Date(a.lastMessage?.createTime || a.target.msgTime);
          const btime = new Date(b.lastMessage?.createTime || b.target.msgTime);
          return btime > atime ? 1 : -1;
        }
        return num;
      });
  };

  /**
   * @description: 鼠标右键事件
   * @param {MouseEvent} e
   * @param {IChat} item
   */
  const handleContextClick = (e: MouseEvent, item: IChat) => {
    if (!item) {
      return;
    }
    setMousePosition({
      left: e.pageX + 6,
      top: e.pageY - 60,
      isShowContext: true,
      selectedItem: item,
      selectMenu: [
        { value: 1, label: item.isToping ? '取消置顶' : '置顶会话' },
        { value: 2, label: '清空信息' },
        { value: 3, label: '删除会话' },
      ],
    });
  };

  /**
   * @description: 右键菜单点击
   * @param {MenuItemType} item
   * @return {*}
   */
  const handleContextChange = async (item: MenuItemType) => {
    if (mousePosition.selectedItem) {
      switch (item.value) {
        case 1:
          chatCtrl.setToping(mousePosition.selectedItem);
          break;
        case 2:
          if (mousePosition.selectedItem) {
            await mousePosition.selectedItem.clearMessage();
            chatCtrl.changCallback();
          }
          break;
        case 3:
          chatCtrl.deleteChat(mousePosition.selectedItem);
          break;
      }
    }
  };

  /**
   * @description: 关闭右侧点击出现的弹框
   */
  const _handleClick = () => {
    setMousePosition({
      isShowContext: false,
    });
  };

  /**
   * @description: 监听点击事件，关闭弹窗
   * @return {*}
   */
  useEffect(() => {
    document.addEventListener('click', _handleClick);
    return () => {
      document.removeEventListener('click', _handleClick);
    };
  }, []);

  /** 渲染会话 */
  const loadChats = (chats: IChat[]) => {
    const getBarTxt = (c: IChat) => {
      if (c.lastMessage) {
        switch (c.lastMessage.msgType) {
          case MessageType.Image:
            return '[图片]';
          case MessageType.Video:
            return '[视频]';
          case MessageType.Voice:
            return '[语音]';
          default:
            return c.lastMessage.showTxt;
        }
      }
      return '';
    };
    return chats.map((child) => {
      const msgTime = child.lastMessage?.createTime || child.target.msgTime;
      return (
        <div
          key={child.fullId}
          className={`${sideStyle.con_body_session} ${
            chatCtrl.isCurrent(child) ? sideStyle.active : ''
          } ${child.isToping ? sideStyle.session_toping : ''}`}
          onContextMenu={(e: any) => handleContextClick(e, child)}>
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
                {child.target.typeName != TargetType.Person ? (
                  <imIcon.ImBubbles color="#aaa" />
                ) : (
                  ''
                )}
              </div>
              <div
                className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                {handleFormatDate(msgTime)}
              </div>
            </div>
            <div className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
              {getBarTxt(child)}
            </div>
          </div>
        </div>
      );
    });
  };

  const items = [
    {
      label: '会话',
      key: '1',
      children: (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          className={sideStyle.group_side_bar_wrap}>
          {loadChats(filterChats(chatCtrl.chats))}
        </div>
      ),
    },
    {
      label: '通讯录',
      key: '2',
      children: (
        <div
          className={sideStyle.group_side_bar_wrap}
          onContextMenu={(e) => {
            e.preventDefault();
          }}>
          {chatCtrl.groups.map((item) => {
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
                  {loadChats(filterChats(item.chats, !item.isOpened))}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];
  return (
    <div key={key} className={sideStyle.chart_side_wrap}>
      <ContentMenu width={300}>
        <div className={sideStyle.group_side_bar_search}>
          <Input
            placeholder="搜索"
            prefix={<imIcon.ImSearch />}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <Tabs
          centered
          activeKey={chatCtrl.tabIndex}
          onTabClick={(k) => {
            chatCtrl.setTabIndex(k);
          }}
          items={items}
        />
      </ContentMenu>

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
