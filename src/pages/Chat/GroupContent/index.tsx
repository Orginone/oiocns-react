/* eslint-disable no-unused-vars */
import { Button, Popover, Image } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import HeadImg from '@/components/headImg/headImg';
import css from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import { showChatTime } from '@/utils/tools';
import { deepClone } from '@/ts/base/common';
import { XImMsg } from '@/ts/base/schema';
import { MessageType } from '@/ts/core/enum';
import { FileItemShare } from '@/ts/base/model';

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
  /**
   * 显示消息
   * @param msg 消息
   */
  const viewMsg = (item: XImMsg) => {
    switch (item.msgType) {
      case MessageType.Image:
        // eslint-disable-next-line no-case-declarations
        const img: FileItemShare = JSON.parse(item.showTxt);
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            <div className={`${css.con_content_txt} ${css.con_content_img}`}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            <div
              className={`${css.con_content_txt}`}
              dangerouslySetInnerHTML={{ __html: item.showTxt }}></div>
          </>
        );
    }
  };

  return (
    <div className={css.group_content_wrap}>
      {messages.map((item, index: any) => {
        return (
          <React.Fragment key={item.fromId + index}>
            {/* 聊天间隔时间3分钟则 显示时间 */}
            {isShowTime(index) ? (
              <div className={css.chats_space_Time}>
                <span>{showChatTime(item.createTime)}</span>
              </div>
            ) : (
              ''
            )}
            {/* 重新编辑 */}
            {item.msgType === 'recall' ? (
              <div className={`${css.group_content_left} ${css.con} ${css.recall}`}>
                撤回了一条消息
                {item.allowEdit ? (
                  <span
                    className={css.reWrite}
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
              <div className={`${css.group_content_left} ${css.con}`}>
                <Popover
                  trigger="hover"
                  overlayClassName={css.targerBoxClass}
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
                      className={css.con_body}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectId(item.id);
                      }}>
                      <HeadImg
                        name={chatCtrl.getName(item.fromId)}
                        label={''}
                        isSquare={false}
                      />
                      <div className={`${css.con_content}`}>{viewMsg(item)}</div>
                    </div>
                  )}
                </Popover>
              </div>
            ) : (
              <>
                {/* 右侧聊天内容显示 */}
                <div className={`${css.group_content_right} ${css.con}`}>
                  <Popover
                    trigger="hover"
                    overlayClassName={css.targerBoxClass}
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
                        className={css.con_body}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectId(item.id);
                        }}>
                        <div className={`${css.con_content}`}>{viewMsg(item)}</div>
                        <HeadImg name={chatCtrl.getName(item.fromId)} isSquare={false} />
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
