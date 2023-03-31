/* eslint-disable no-unused-vars */
import { Button, Popover, Image, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import css from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import { showChatTime } from '@/utils/tools';
import { XImMsg } from '@/ts/base/schema';
import { MessageType } from '@/ts/core/enum';
import { FileItemShare } from '@/ts/base/model';
import userCtrl from '@/ts/controller/setting';
import { parseAvatar } from '@/ts/base';

/**
 * @description: 聊天区域
 * @return {*}
 */

interface Iprops {
  handleReWrites: Function;
}

const GroupContent = (props: Iprops) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<XImMsg[]>([]);
  const { handleReWrites } = props;
  const [selectId, setSelectId] = useState<string>('');
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);

  useEffect(() => {
    if (chatCtrl.chat) {
      setMessages([...chatCtrl.chat.messages]);
      chatCtrl.chat.onMessage((ms) => {
        setMessages([...ms]);
      });
    }
  }, []);

  useEffect(() => {
    if (body && body.current) {
      if (loading) {
        setLoading(false);
        body.current.scrollTop = body.current.scrollHeight - beforescrollHeight;
      } else {
        body.current.scrollTop = body.current.scrollHeight;
      }
    }
  }, [messages]);

  const isShowTime = (curDate: string, beforeDate: string) => {
    if (beforeDate === '') return true;
    return moment(curDate).diff(beforeDate, 'minute') > 3;
  };
  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && chatCtrl.chat && body.current.scrollTop < 10) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
      if ((await chatCtrl.chat.moreMessage('')) < 1) {
        setLoading(false);
      }
    }
  };
  /**
   * 显示消息
   * @param msg 消息
   */
  const parseMsg = (item: XImMsg) => {
    switch (item.msgType) {
      case MessageType.Image:
        // eslint-disable-next-line no-case-declarations
        const img: FileItemShare = parseAvatar(item.showTxt);
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

  const viewMsg = (item: XImMsg, right: boolean = false) => {
    if (right) {
      return (
        <>
          <div className={`${css.con_content}`}>{parseMsg(item)}</div>
          <div style={{ color: '#888', paddingLeft: 10 }}>
            <TeamIcon share={userCtrl.user.shareInfo} preview size={36} fontSize={32} />
          </div>
        </>
      );
    } else {
      const share = userCtrl.findTeamInfoById(item.fromId);
      return (
        <>
          <div style={{ color: '#888', paddingRight: 10 }}>
            <TeamIcon preview share={share} size={36} fontSize={32} />
          </div>
          <div className={`${css.con_content}`}>
            <div className={`${css.name}`}>{share.name}</div>
            {parseMsg(item)}
          </div>
        </>
      );
    }
  };

  return (
    <div className={css.chart_content} ref={body} onScroll={onScroll}>
      <Spin tip="加载中..." spinning={loading}>
        <div className={css.group_content_wrap}>
          {messages.map((item, index: any) => {
            return (
              <React.Fragment key={item.fromId + index}>
                {/* 聊天间隔时间3分钟则 显示时间 */}
                {isShowTime(
                  item.createTime,
                  index > 0 ? messages[index - 1].createTime : '',
                ) ? (
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
                          handleReWrites(item.msgBody);
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
                                await chatCtrl.chat?.deleteMessage(item.id);
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
                          {viewMsg(item)}
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
                                  await chatCtrl.chat?.deleteMessage(item.id);
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
                            {viewMsg(item, true)}
                          </div>
                        )}
                      </Popover>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Spin>
    </div>
  );
};
export default GroupContent;
