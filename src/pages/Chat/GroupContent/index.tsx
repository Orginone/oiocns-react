/* eslint-disable no-unused-vars */
import { Button, Popover } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import HeadImg from '@/components/headImg/headImg';
import contentStyle from './index.module.less';
import { chatCtrl } from '@/ts/controller/chat';
import { showChatTime } from '@/utils/tools';
import { deepClone } from '@/ts/base/common';

/**
 * @description: 聊天区域
 * @return {*}
 */

interface Iprops {
  handleReWrites: Function;
}

const GroupContent = (props: Iprops) => {
  const [messages, setMessages] = useState(chatCtrl.chat?.messages ?? []);
  const { handleReWrites } = props;
  const messageNodeRef = useRef<HTMLDivElement>(null); // dom节点
  const [selectId, setSelectId] = useState<string>('');
  const refreshUI = async () => {
    setMessages(deepClone(chatCtrl.chat?.messages ?? []));
  };

  /**
   * @description: 滚动到底部
   * @return {*}
   */
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
  }, [messages]);

  useEffect(() => {
    const id = chatCtrl.subscribe(refreshUI);
    return () => {
      chatCtrl.unsubscribe(id);
    };
  }, []);

  const isShowTime = (index: number) => {
    if (index == 0 && messages) return true;
    return (
      moment(messages[index].createTime).diff(messages[index - 1].createTime, 'minute') >
      3
    );
  };

  /**
   * @description: 重新编辑
   * @param {string} txt
   * @return {*}
   */
  const handleReWrite = (txt: string) => {
    handleReWrites(txt);
  };

  return (
    <div className={contentStyle.group_content_wrap}>
      {messages.map((item, index: any) => {
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
            {item.fromId !== chatCtrl.userId ? (
              <div className={`${contentStyle.group_content_left} ${contentStyle.con}`}>
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
                    chatCtrl.chat?.spaceId === item.spaceId ? (
                      <>
                        <CopyToClipboard text={item.showTxt}>
                          <Button type="text" style={{ color: '#3e5ed8' }}>
                            复制
                          </Button>
                        </CopyToClipboard>
                        <Button
                          type="text"
                          danger
                          onClick={async () => {
                            if (await chatCtrl.chat?.deleteMessage(item.id)) {
                              refreshUI();
                            }
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
                      <HeadImg name={chatCtrl.getName(item.fromId)} label={''} />
                      <div className={`${contentStyle.con_content}`}>
                        {chatCtrl.chat?.target.typeName !== '人员' ? (
                          <div
                            className={`${contentStyle.con_content} ${contentStyle.name}`}>
                            {chatCtrl.getName(item.fromId) || ''}
                          </div>
                        ) : (
                          ''
                        )}
                        <div
                          className={`${contentStyle.con_content} ${contentStyle.txt}`}
                          dangerouslySetInnerHTML={{ __html: item.showTxt }}></div>
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
                        <CopyToClipboard text={item.showTxt}>
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
                          onClick={async () => {
                            await chatCtrl.chat?.reCallMessage(item.id);
                          }}>
                          撤回
                        </Button>
                        {item.spaceId === chatCtrl.chat?.spaceId ? (
                          <Button
                            type="text"
                            danger
                            onClick={async () => {
                              if (await chatCtrl.chat?.deleteMessage(item.id)) {
                                refreshUI();
                              }
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
                            dangerouslySetInnerHTML={{ __html: item.showTxt }}></div>
                        </div>
                        <HeadImg name={chatCtrl.getName(item.fromId)} />
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
