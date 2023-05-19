/* eslint-disable no-unused-vars */
import { Button, Popover, Image, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import css from './index.module.less';
import { showChatTime } from '@/utils/tools';
import { FileItemShare } from '@/ts/base/model';
import orgCtrl from '@/ts/controller';
import { IMsgChat, MessageType } from '@/ts/core';
import { model, parseAvatar } from '@/ts/base';

/**
 * @description: 聊天区域
 * @return {*}
 */

interface Iprops {
  chat: IMsgChat;
  filter: string;
  handleReWrites: Function;
}

const GroupContent = (props: Iprops) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(props.chat.messages);
  const { handleReWrites } = props;
  const [selectId, setSelectId] = useState<string>('');
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);

  useEffect(() => {
    setMessages([...props.chat.messages]);
    props.chat.onMessage((ms) => {
      setMessages([...ms]);
    });
    return () => {
      props.chat.unMessage();
    };
  }, [props]);

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
    if (!loading && body.current && props.chat && body.current.scrollTop < 10) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
      if ((await props.chat.moreMessage()) < 1) {
        setLoading(false);
      }
    }
  };
  /**
   * 显示消息
   * @param msg 消息
   */
  const parseMsg = (item: model.MsgSaveModel) => {
    switch (item.msgType) {
      case MessageType.Image: {
        const img: FileItemShare = parseAvatar(item.showTxt);
        if (img && img.thumbnail) {
          return (
            <>
              <div className={`${css.con_content_link}`}></div>
              <div className={`${css.con_content_txt} ${css.con_content_img}`}>
                <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
              </div>
            </>
          );
        }
        return <div className={`${css.con_content_txt}`}>消息异常</div>;
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.showTxt);
        if (file && file.thumbnail) {
          return (
            <>
              <div className={`${css.con_content_link}`}></div>
              <div className={`${css.con_content_txt} ${css.con_content_img}`}>
                <Image src={file.thumbnail} preview={{ src: file.shareLink }} />
                {file.name}
              </div>
            </>
          );
        }
        return <div className={`${css.con_content_txt}`}>消息异常</div>;
      }
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

  const viewMsg = (item: model.MsgSaveModel, right: boolean = false) => {
    if (right) {
      return (
        <>
          <div className={`${css.con_content}`}>{parseMsg(item)}</div>
          <div style={{ color: '#888', paddingLeft: 10 }}>
            <TeamIcon share={orgCtrl.user.share} preview size={36} fontSize={32} />
          </div>
        </>
      );
    } else {
      const share = orgCtrl.user.findShareById(item.fromId);
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

  const msgAction = (item: model.MsgSaveModel) => {
    return (
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
            await props.chat.recallMessage(item.id);
          }}>
          撤回
        </Button>
        <Button
          type="text"
          danger
          onClick={async () => {
            await props.chat.deleteMessage(item.id);
          }}>
          删除
        </Button>
      </>
    );
  };

  return (
    <div className={css.chart_content} ref={body} onScroll={onScroll}>
      <Spin tip="加载中..." spinning={loading}>
        <div className={css.group_content_wrap}>
          {messages
            .filter((i) => i.showTxt.includes(props.filter))
            .map((item, index: any) => {
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
                  {item.fromId !== orgCtrl.user.id ? (
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
                        content={msgAction(item)}>
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
                          content={msgAction(item)}>
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
