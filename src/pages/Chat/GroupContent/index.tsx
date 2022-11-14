/* eslint-disable no-unused-vars */
import { Button, Popover } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import HeadImg from '@/components/headImg/headImg';
import { chat } from '@/module/chat/orgchat';
import useChatStore from '@/store/chat';
import contentStyle from './index.module.less';

/* 
  聊天区域
*/

interface Iprops {
  handleReWrites: Function;
}

const GroupContent = (props: Iprops) => {
  const { handleReWrites } = props;
  const ChatStore: any = useChatStore();
  const messageNodeRef = useRef<HTMLDivElement>(null); // dom节点
  const [selectId, setSelectId] = useState<string>('');
  const isShowTime = (index: number) => {
    if (index == 0) return true;
    return (
      moment(ChatStore.curMsgs[index].createTime).diff(
        ChatStore.curMsgs[index - 1].createTime,
        'minute',
      ) > 3
    );
  };
  // 滚动到底部
  const scrollEvent = () => {
    if (messageNodeRef.current) {
      messageNodeRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'start',
      });
    }
  };
  useEffect(() => {
    scrollEvent();
  }, [ChatStore.curMsgs, ChatStore.setCurrent]);

  // 聊天间隔时间
  const showChatTime = (chatDate: moment.MomentInput) => {
    const cdate = moment(chatDate);
    const days = moment().diff(cdate, 'day');
    switch (days) {
      case 0:
        return cdate.format('H:mm');
      case 1:
        return '昨天 ' + cdate.format('H:mm');
      case 2:
        return '前天 ' + cdate.format('H:mm');
    }
    const year = moment().diff(cdate, 'year');
    if (year == 0) {
      return cdate.format('M月D日 H:mm');
    }
    return cdate.format('yy年 M月D日 H:mm');
  };

  // 重新编辑
  const handleReWrite = (txt: string) => {
    handleReWrites(txt);
  };
  // 删除消息
  const deleteMsg = (item: any) => {
    item.edit = false;
    ChatStore.deleteMsg(item);
  };
  const canDelete = (item: any) => {
    if (item.chatId) {
      return true;
    }
    return item.spaceId === chat.userId;
  };
  // 消息撤回
  const recallMsg = (item: any) => {
    item.edit = false;
    if (item.chatId) {
      item.id = item.chatId;
      delete item.chatId;
      delete item.sessionId;
    }
    ChatStore.recallMsgs(item);
    // ChatStore.recallMsgs(item).then((res: ResultType) => {
    //   if (res.data != 1) {
    //     message.warning('只能撤回2分钟内发送的消息');
    //   }
    // });
  };

  return (
    <div className={contentStyle.group_content_wrap}>
      {ChatStore?.curMsgs.map((item: any, index: any) => {
        return (
          <React.Fragment key={item.fromId + index}>
            {/* 聊天间隔时间3分钟则 显示时间 */}
            {isShowTime(index) ? (
              <div className={contentStyle.chats_space_Time}>
                <span>{showChatTime(item.createTime)}</span>
              </div>
            ) : (
              ''
            )}
            {/* 重新编辑 */}
            {item.msgType === 'recall' ? (
              <div
                className={`${contentStyle.group_content_left} ${contentStyle.con} ${contentStyle.recall}`}>
                {item.showTxt}
                {item.allowEdit ? (
                  <span
                    className={contentStyle.reWrite}
                    onClick={() => {
                      handleReWrite(item.msgBody);
                    }}>
                    重新编辑
                  </span>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            {/* 左侧聊天内容显示 */}
            {item.fromId !== chat.userId ? (
              <div className={`${contentStyle.group_content_left} ${contentStyle.con}`}>
                <Popover
                  trigger="hover"
                  overlayClassName={contentStyle.targerBoxClass}
                  open={selectId == item.id}
                  key={item.chatId}
                  placement="bottom"
                  onOpenChange={() => {
                    setSelectId('');
                  }}
                  content={
                    canDelete(item) ? (
                      <>
                        <CopyToClipboard text={item.msgBody}>
                          <Button type="text" style={{ color: '#3e5ed8' }}>
                            复制
                          </Button>
                        </CopyToClipboard>
                        <Button
                          type="text"
                          danger
                          onClick={() => {
                            deleteMsg(item);
                          }}>
                          删除
                        </Button>
                      </>
                    ) : (
                      ''
                    )
                  }>
                  {item.msgType === 'recall' ? (
                    ''
                  ) : (
                    <div
                      className={contentStyle.con_body}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectId(item.id);
                      }}>
                      <HeadImg name={chat.getName(item.fromId)} label={''} />
                      <div className={`${contentStyle.con_content}`}>
                        {ChatStore?.curChat?.typeName !== '人员' ? (
                          <div
                            className={`${contentStyle.con_content} ${contentStyle.name}`}>
                            {ChatStore.getName(item.fromId) || ''}
                          </div>
                        ) : (
                          ''
                        )}
                        <div
                          className={`${contentStyle.con_content} ${contentStyle.txt}`}
                          dangerouslySetInnerHTML={{ __html: item.msgBody }}></div>
                      </div>
                    </div>
                  )}
                </Popover>
              </div>
            ) : (
              <>
                {/* 右侧聊天内容显示 */}
                <div
                  className={`${contentStyle.group_content_right} ${contentStyle.con}`}>
                  <Popover
                    trigger="hover"
                    overlayClassName={contentStyle.targerBoxClass}
                    open={selectId == item.id}
                    key={item.id}
                    placement="bottom"
                    onOpenChange={() => {
                      setSelectId('');
                    }}
                    content={
                      <>
                        <CopyToClipboard text={item.msgBody}>
                          <Button type="text" style={{ color: '#3e5ed8' }}>
                            复制
                          </Button>
                        </CopyToClipboard>
                        <Button type="text" style={{ color: '#3e5ed8' }}>
                          转发
                        </Button>
                        <Button
                          type="text"
                          style={{ color: '#3e5ed8' }}
                          onClick={() => {
                            recallMsg(item);
                          }}>
                          撤回
                        </Button>
                        {canDelete(item) ? (
                          <Button
                            type="text"
                            danger
                            onClick={() => {
                              deleteMsg(item);
                            }}>
                            删除
                          </Button>
                        ) : (
                          ''
                        )}
                      </>
                    }>
                    {item.msgType === 'recall' ? (
                      ''
                    ) : (
                      <div
                        className={contentStyle.con_body}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectId(item.id);
                        }}>
                        <div className={contentStyle.con_content}>
                          <div
                            className={`${contentStyle.con_content} ${contentStyle.txt}`}
                            dangerouslySetInnerHTML={{ __html: item.msgBody }}></div>
                        </div>
                        <HeadImg name={chat.getName(item.fromId)} />
                      </div>
                    )}
                  </Popover>
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}
      <div
        ref={messageNodeRef}
        style={{
          clear: 'both',
          width: '100%',
        }}></div>
    </div>
  );
};
export default GroupContent;
