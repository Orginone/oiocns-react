/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import { chat } from '@/module/chat/orgchat';
import useChatStore from '@/store/chat';
import { formatDate } from '@/utils/index';
import sideStyle from './index.module.less';

/* 
  会话列表、通讯录
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

const GroupSideBar: React.FC = () => {
  const ChatStore: any = useChatStore();
  useEffect(() => {
    ChatStore.getAddressBook();
  }, []);

  const [searchValue, setSearchValue] = useState<string>(''); // 搜索值
  let [openIdArr, setOpenIdArr] = useState<Array<string>>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false); // 是否已加载--判断是否需要默认打开
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

  const onChange = (values: string) => {
    setSearchValue(values);
  };

  //根据搜索条件-输出展示列表
  const showList = (): ImMsgType[] => {
    let topGroup: any = {
      id: 'toping',
      name: '置顶会话',
    };
    topGroup.chats = [];
    let showInfoArr = chat.chats;
    showInfoArr = showInfoArr.map((child: ImMsgType) => {
      let chats = child.chats.filter((item: ImMsgChildType) => {
        let matched =
          !searchValue ||
          item.name?.includes(searchValue) ||
          item.msgBody?.includes(searchValue);
        if (matched && item.isTop) {
          topGroup.chats.push(item);
        }
        return matched && !item.isTop;
      });
      return {
        id: child.id,
        name: child.name,
        chats: chats,
      };
    });
    // 首次进入页面默认打开第一个分组
    if (!isMounted && openIdArr.length === 0 && showInfoArr.length > 0) {
      // // 当从关系-群组 进入会话携带id 则进入对应聊天室
      // if (routerParams.defaultOpenID) {
      //   openIdArr.push(routerParams.spaceId as string);
      //   const aimItem = showInfoArr
      //     .find((item) => item.id == routerParams.spaceId)
      //     ?.chats.find((item) => item.id == routerParams.defaultOpenID);
      //   aimItem && openChanged(aimItem);
      // } else {
      if (topGroup.chats.length < 1) {
        openIdArr.push(showInfoArr[0].id);
      } else {
        openIdArr.push('toping');
      }
      // }
      setIsMounted(true);
    }
    if (topGroup.chats.length > 0) {
      return [topGroup, ...showInfoArr];
    }
    return showInfoArr;
  };
  const openChangeds = async (child: ImMsgChildType) => {
    await ChatStore.setCurrent(child);
  };

  useEffect(() => {
    showList();
  }, []);
  const handleOpenSpace = (selectedID: string) => {
    const isOpen = openIdArr.includes(selectedID);
    if (isOpen) {
      openIdArr = openIdArr.filter((item: string) => item !== selectedID);
      setOpenIdArr(openIdArr);
    } else {
      openIdArr = [...openIdArr, selectedID];
      setOpenIdArr(openIdArr);
    }
  };
  // 时间处理
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

  // 鼠标右键事件
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

  // 右键菜单点击
  const handleContextChange = (item: MenuItemType) => {
    switch (item.value) {
      case 1:
        chat.setToppingSession(mousePosition.selectedItem, true);
        break;
      case 2:
        // props.clearHistoryMsg()
        break;
      case 3:
        chat.setToppingSession(mousePosition.selectedItem, false);
        break;

      default:
        break;
    }
  };
  // 关闭右侧点击出现的弹框;
  const _handleClick = (event: any) => {
    setMousePosition({
      isShowContext: false,
      left: 0,
      top: 0,
      selectedItem: {} as ImMsgChildType,
    });
  };
  useEffect(() => {
    // 监听点击事件，关闭弹窗
    document.addEventListener('click', _handleClick);
    return () => {
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
            onChange(e.target.value);
          }}
        />
      </div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="会话" key="1">
          <div className={sideStyle.group_side_bar_wrap}>
            {ChatStore.sessionChats &&
              ChatStore.sessionChats?.map((child: any) => {
                return (
                  <div className={sideStyle.con_body_session} key={child.id}>
                    <HeadImg name={child.name} label={child.label} />
                    {child.noRead > 0 ? (
                      <div className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                        <span>{child.noRead}</span>
                      </div>
                    ) : (
                      ''
                    )}
                    <div
                      className={sideStyle.group_con_show}
                      onClick={() => {
                        openChangeds(child);
                      }}>
                      <div className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                        <div
                          className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                          {child.name}
                        </div>
                        <div
                          className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                          {handleFormatDate(child.msgTime)}
                        </div>
                      </div>
                      <div className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                        {child.showTxt}
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
            {ChatStore.chats.map((item: any) => {
              return (
                <div key={item.id}>
                  <div className={`${sideStyle.group_con} ${sideStyle.item}`}>
                    {/* 分组标题 */}
                    <div
                      className={`${sideStyle.con_title} ${sideStyle.flex} ${
                        openIdArr.includes(item.id) ? sideStyle.active : ''
                      }`}
                      onClick={() => {
                        handleOpenSpace(item.id);
                      }}>
                      <span>
                        {item.name}({item?.chats?.length ?? 0})
                      </span>
                    </div>
                    {/* 展开的分组下的人员 */}
                    {openIdArr?.includes(item.id) ? (
                      <>
                        {item.chats.map((child: any) => {
                          return (
                            <div
                              className={`${sideStyle.con_body} ${
                                ChatStore.curChat?.spaceId === item.id &&
                                ChatStore.curChat?.id === child.id
                                  ? sideStyle.active
                                  : ''
                              }`}
                              key={child.id}
                              onContextMenu={(e: any) => handleContextClick(e, child)}>
                              <HeadImg name={child.name} label={child.label} />
                              {child.noRead > 0 ? (
                                <div
                                  className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                                  <span>{child.noRead}</span>
                                </div>
                              ) : (
                                ''
                              )}
                              <div
                                className={sideStyle.group_con_show}
                                onClick={() => {
                                  openChangeds(child);
                                }}>
                                <div
                                  className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                                  <div
                                    className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                                    {child.name}
                                  </div>
                                  <div
                                    className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                                    {handleFormatDate(child.msgTime)}
                                  </div>
                                </div>
                                <div
                                  className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                                  {child.showTxt}
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
                      {!openIdArr?.includes(item.id) ? (
                        <>
                          {item.chats
                            .filter((v: any) => v.noRead > 0)
                            .map((child: any) => {
                              return (
                                <div
                                  key={child.id + child.name}
                                  className={`${sideStyle.con_body} ${sideStyle.open_item}`}>
                                  <HeadImg name={child.name} label={child.label} />
                                  {child.noRead > 0 ? (
                                    <div
                                      className={`${sideStyle.group_con} ${sideStyle.dot}`}>
                                      <span>{child.noRead}</span>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                  <div
                                    className={`${sideStyle.group_con_show}`}
                                    onClick={() => {
                                      openChangeds(child);
                                    }}>
                                    <div
                                      className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
                                      <div
                                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
                                        {child.name}
                                      </div>
                                      <div
                                        className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
                                        {handleFormatDate(child.msgTime)}
                                      </div>
                                    </div>
                                    <div
                                      className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
                                      {child.showTxt}
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
