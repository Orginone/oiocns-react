import { message, Popover, Spin, Badge, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import Information from './information';
import { showChatTime, downloadByUrl } from '@/utils/tools';
import { IMessage, ISession, MessageType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import css from './index.module.less';
import { parseCiteMsg, parseMsg } from '@/pages/Chats/components/parseMsg';
import { RiShareForwardFill } from '@/icons/ri';
import {
  AiOutlineCopy,
  AiOutlineRollback,
  AiOutlineMessage,
  AiOutlineDelete,
  AiOutlineDownload,
} from '@/icons/ai';
/**
 * @description: 聊天区域
 * @return {*}
 */

interface Iprops {
  chat: ISession;
  filter: string;
  handleReWrites: Function;
  /** 返回值，引用 */
  citeText: any;
  /** 回车设置引用消息 */
  enterCiteMsg: IMessage;
}

const GroupContent = (props: Iprops) => {
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<IMessage>();
  const [messages, setMessages] = useState(props.chat.messages);
  const { handleReWrites } = props;
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  // const [forwardOpen, setForwardOpen] = useState(false); // 设置转发打开窗口
  // const [formwardCode, setFormwardCode] = useState<IMessage>(); // 转发时用户
  // const [ismousewheel, setIsMousewheel] = useState(false);
  useEffect(() => {
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
  function createWheelStopListener(callback: () => void, timeout?: number) {
    var handle: ReturnType<typeof setTimeout>;
    // setIsMousewheel(true);
    var onScroll = function () {
      if (handle) {
        clearTimeout(handle);
      }
      handle = setTimeout(callback, timeout || 200); // default 200 ms
    };
    body.current?.addEventListener('wheel', onScroll);
    return function () {
      body.current?.removeEventListener('wheel', onScroll);
    };
  }

  const isShowTime = (curDate: string, beforeDate: string) => {
    if (beforeDate === '') return true;
    return moment(curDate).diff(beforeDate, 'minute') > 3;
  };
  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && props.chat && body.current.scrollTop < 10) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
      await props.chat.moreMessage();
      setMessages([...props.chat.messages]);
    }
    createWheelStopListener(() => {
      // setIsMousewheel(false);
    });
  };

  /** 转发消息 */
  const forward = (item: IMessage) => {
    // setForwardOpen(true);
    // setFormwardCode(item);
  };

  const viewMsg = (item: IMessage) => {
    if (item.isMySend) {
      return (
        <>
          <div className={`${css.con_content}`}>
            {props.chat.isBelongPerson ? (
              <React.Fragment>
                {parseMsg(item)}
                {item.cite && parseCiteMsg(item.cite)}
              </React.Fragment>
            ) : (
              <>
                <Badge
                  key={item.id}
                  count={item.comments}
                  size="small"
                  style={{ zIndex: 2 }}
                  offset={[-15, -12]}>
                  {parseMsg(item)}
                  {item.cite && parseCiteMsg(item.cite)}
                </Badge>
                <div
                  className={`${css.information} ${
                    item.readedinfo.includes('已读') ? css.readed : ''
                  }`}
                  onClick={() => setInfoMsg(item)}>
                  {item.readedinfo}
                </div>
              </>
            )}
          </div>
          <div style={{ color: '#888' }}>
            <TeamIcon entityId={item.metadata.fromId} size={36} />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div style={{ color: '#888', paddingRight: 10 }}>
            <TeamIcon entityId={item.metadata.fromId} size={36} />
          </div>
          <div className={`${css.con_content}`}>
            <div className={`${css.name}`}>{item.from.name}</div>
            {parseMsg(item)}
            {item.cite && parseCiteMsg(item.cite)}
          </div>
        </>
      );
    }
  };

  const loadMsgItem = (item: IMessage) => {
    return (
      <Popover
        trigger="hover"
        key={item.id}
        placement="bottom"
        getPopupContainer={(triggerNode: HTMLElement) => {
          return triggerNode.parentElement || document.body;
        }}
        content={msgAction(item)}>
        <div
          className={css.con_body}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          {viewMsg(item)}
        </div>
      </Popover>
    );
  };

  const msgAction = (item: IMessage) => {
    return (
      <div className={css.msgAction}>
        <CopyToClipboard text={item.msgBody}>
          <Tooltip title="复制">
            <AiOutlineCopy
              size={22}
              className={css.actionIconStyl}
              onClick={() => {
                message.success('复制成功');
              }}
            />
          </Tooltip>
        </CopyToClipboard>
        <Tooltip title="引用">
          <AiOutlineMessage
            size={22}
            className={css.actionIconStyl}
            onClick={() => props.citeText(item)}
          />
        </Tooltip>
        <Tooltip title="转发">
          <RiShareForwardFill
            size={22}
            className={css.actionIconStyl}
            onClick={() => forward(item)}
          />
        </Tooltip>
        {item.isMySend && item.allowRecall && (
          <Tooltip title="撤回">
            <AiOutlineRollback
              size={22}
              className={css.actionIconStyl}
              onClick={async () => {
                await props.chat.recallMessage(item.id);
              }}
            />
          </Tooltip>
        )}
        {props.chat.canDeleteMessage && (
          <Tooltip title="删除">
            <AiOutlineDelete
              size={22}
              className={css.actionIconStyl}
              onClick={async () => {
                if (await props.chat.deleteMessage(item.id)) {
                  message.success('删除成功');
                }
              }}
            />
          </Tooltip>
        )}
        {['文件', '视频', '图片'].includes(item.msgType) && (
          <Tooltip title="下载">
            <AiOutlineDownload
              size={22}
              className={css.actionIconStyl}
              onClick={() => {
                const url = parseAvatar(item.msgBody).shareLink;
                downloadByUrl(`/orginone/kernel/load/${url}?download=1`);
              }}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const renderMessage = (item: IMessage) => {
    switch (item.msgType) {
      case MessageType.Recall:
        return (
          <div className={`${css.group_content_left} ${css.con} ${css.recall}`}>
            {item.msgBody}
            {item.allowEdit && (
              <span
                className={css.reWrite}
                onClick={() => {
                  handleReWrites(item.msgSource);
                }}>
                重新编辑
              </span>
            )}
          </div>
        );
      case MessageType.Notify:
        return (
          <div className={`${css.group_content_left} ${css.con} ${css.recall}`}>
            {item.msgBody}
          </div>
        );
      default:
        if (item.isMySend) {
          return (
            <div className={`${css.group_content_right} ${css.con}`}>
              {loadMsgItem(item)}
            </div>
          );
        } else {
          return (
            <div className={`${css.group_content_left} ${css.con}`}>
              {loadMsgItem(item)}
            </div>
          );
        }
    }
  };

  return (
    <div className={css.chart_content} ref={body} onScroll={onScroll}>
      <Spin tip="加载中..." spinning={loading}>
        <div className={css.group_content_wrap}>
          {messages
            .filter((i) => i.msgBody.includes(props.filter))
            .map((item, index: any) => {
              return (
                <React.Fragment key={item.metadata.fromId + index}>
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
                  {renderMessage(item)}
                </React.Fragment>
              );
            })}
        </div>
        {infoMsg && <Information msg={infoMsg} onClose={() => setInfoMsg(undefined)} />}
      </Spin>
    </div>
  );
};
export default GroupContent;
