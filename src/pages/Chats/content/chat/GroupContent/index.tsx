/* eslint-disable no-unused-vars */
import { Button, Checkbox, message, Popover, Spin, Badge, Tooltip, Affix } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import Information from './information';
import ForwardContentModal from './forwardContentModal';
import { showChatTime, downloadByUrl, shareOpenLink } from '@/utils/tools';
import { IMessage, ISession, MessageType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import css from './index.module.less';
import {
  parseCiteMsg,
  parseMsg,
  parseForwardMsg,
} from '@/pages/Chats/components/parseMsg';
import { RiShareForwardFill } from '@/icons/ri';
import { BsListCheck } from '@/icons/bs';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  AiOutlineCopy,
  AiOutlineRollback,
  AiOutlineMessage,
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlineEllipsis,
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
  forward: any;
  /** 回车设置引用消息 */
  enterCiteMsg: IMessage;
  multiSelectShow: boolean;
  multiSelectMsg: (item: IMessage, checked: boolean) => void;
  multiSelectFn: (multi: boolean) => void;
}

const GroupContent = (props: Iprops) => {
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<IMessage>();
  const [messages, setMessages] = useState(props.chat.messages);
  const { handleReWrites, multiSelectShow } = props;
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  const [forwardModalOpen, setForwardModalOpen] = useState<boolean>(false); // 转发时用户
  const [forwardMessages, setForwardMessages] = useState<IMessage[]>([]);
  const [multiSelect, setMultiSelect] = useState(multiSelectShow);
  useEffect(() => {
    props.chat.onMessage((ms) => {
      setMessages([...ms]);
    });
    return () => {
      props.chat.unMessage();
    };
  }, [props.chat]);

  useEffect(() => {
    setMultiSelect(multiSelectShow);
  }, [multiSelectShow]);

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
      await props.chat.moreMessage();
      setMessages([...props.chat.messages]);
    }
  };

  const handleForwadModalClose = () => {
    setForwardModalOpen(false);
    setForwardMessages([]);
  };
  const viewForward = (item: IMessage[]) => {
    setForwardModalOpen(true);
    setForwardMessages(item);
  };

  const batchForwardMsg = (item: IMessage) => {
    // TODO 需要优化
    if (
      item.forward.length === 1 &&
      item.forward[0].forward &&
      item.forward[0].forward.length > 1
    ) {
      return (
        <React.Fragment>
          {parseForwardMsg(item.forward[0].forward, viewForward)}
        </React.Fragment>
      );
    }
    return <React.Fragment>{parseForwardMsg(item.forward, viewForward)}</React.Fragment>;
  };

  const showMsg = (item: IMessage) => {
    if (item.forward && item.forward.length) return batchForwardMsg(item);
    else return <React.Fragment>{parseMsg(item)}</React.Fragment>;
  };
  const viewMsg = (item: IMessage) => {
    const popoverContent = forwardModalOpen ? {} : {content: msgAction(item)}
    if (item.isMySend) {
      return (
        <>
          <Popover
            autoAdjustOverflow={false}
            trigger="hover"
            key={item.id}
            placement="leftTop"
            getPopupContainer={(triggerNode: HTMLElement) => {
              return triggerNode.parentElement || document.body;
            }}
            overlayInnerStyle={{ marginRight: '-16px', padding: '3px' }}
            {...popoverContent}
            >
            <div style={{ display: 'flex' }}>
              <div className={`con-content`}>
                {props.chat.isBelongPerson ? (
                  showMsg(item)
                ) : (
                  <>
                    <Badge
                      key={item.id}
                      count={item.comments}
                      size="small"
                      style={{ zIndex: 2 }}
                      offset={[-15, -12]}>
                      {showMsg(item)}
                      {item.cite && parseCiteMsg(item.cite)}
                    </Badge>
                    <div
                      className={`information ${
                        item.readedinfo.includes('已读') ? 'readed' : ''
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
            </div>
          </Popover>
        </>
      );
    } else {
      return (
        <>
          <div style={{ display: 'flex' }}>
            <div>
              <TeamIcon entityId={item.metadata.fromId} size={36} />
            </div>
            <div className="con-content">
              <div className="name">{item.from.name}</div>
              <Popover
                autoAdjustOverflow={false}
                trigger="hover"
                key={item.id}
                placement="rightTop"
                getPopupContainer={(triggerNode: HTMLElement) => {
                  return triggerNode.parentElement || document.body;
                }}
                overlayInnerStyle={{ marginLeft: '-18px', padding: '3px' }}
                {...popoverContent}
                >
                {showMsg(item)}
              </Popover>
              {item.cite && parseCiteMsg(item.cite)}
            </div>
          </div>
        </>
      );
    }
  };

  const loadMsgItem = (item: IMessage) => {
    return (
      <div
        className="oio-chart-group-content-con-body"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        {multiSelect && (
          <Checkbox
            className="multi-select-styl"
            onClick={(e) => {
              props.multiSelectMsg(
                item,
                (e as unknown as CheckboxChangeEvent).target.checked,
              );
            }}
          />
        )}
        {viewMsg(item)}
      </div>
    );
  };
  const handleMore = () => {
    setMultiSelect(true);
    props.multiSelectFn(true);
  };
  const moreAction = (item: IMessage) => {
    return (
      <div className='more-action'>
        {props.chat.canDeleteMessage && (
          <Button
            type="text"
            className='more-action-btns'
            onClick={async () => {
              if (await props.chat.deleteMessage(item.id)) {
                message.success('删除成功');
              }
            }}>
            <AiOutlineDelete size={19} className='more-action-btns-icon' />
            <span className='more-action-btns-txt'>删除</span>
          </Button>
        )}
        <Button className='more-action-btns' type="text" onClick={handleMore}>
          <BsListCheck size={19} className='more-action-btns-icon' />
          <span className='more-action-btns-txt'>多选</span>
        </Button>
        {['文件', '视频', '图片'].includes(item.msgType) && item.forward?.length < 1 && (
          <Button
            type="text"
            className='more-action-btns'
            onClick={() => {
              const url = parseAvatar(item.msgBody).shareLink;
              downloadByUrl(shareOpenLink(url, true));
            }}>
            <AiOutlineDownload size={19} className='more-action-btns-icon' />
            <span className='more-action-btns-txt'>下载</span>
          </Button>
        )}
      </div>
    );
  };

  const msgAction = (item: IMessage) => {
    return (
      <div className='msg-action'>
        <CopyToClipboard text={item.msgBody}>
          <Tooltip title="复制">
            <AiOutlineCopy
              size={19}
              // className={css.actionIconStyl}
              className="msg-action-icon"
              onClick={() => {
                message.success('复制成功');
              }}
            />
          </Tooltip>
        </CopyToClipboard>
        <Tooltip title="引用">
          <AiOutlineMessage
            size={19}
            className="msg-action-icon"
            onClick={() => props.citeText(item)}
          />
        </Tooltip>
        <Tooltip title="转发">
          <RiShareForwardFill
            size={19}
            className="msg-action-icon"
            onClick={() => props.forward(item)}
          />
        </Tooltip>
        {item.isMySend && item.allowRecall && (
          <Tooltip title="撤回">
            <AiOutlineRollback
              size={19}
              className="msg-action-icon"
              onClick={async () => {
                await props.chat.recallMessage(item.id);
              }}
            />
          </Tooltip>
        )}
        {
          <Tooltip title="更多">
            <Popover
              placement="bottomRight"
              content={moreAction(item)}
              title=""
              trigger="click"
              getPopupContainer={(triggerNode: HTMLElement) => {
                return triggerNode.parentElement || document.body;
              }}
              overlayInnerStyle={{ marginTop: '-12px' }}>
              <AiOutlineEllipsis size={19} className="msg-action-icon" />
            </Popover>
          </Tooltip>
        }
      </div>
    );
  };

  const renderMessage = (item: IMessage) => {
    switch (item.msgType) {
      case MessageType.Recall:
        return (
          <div className={`oio-chart-group-content-left oio-chart-group-content-con oio-chart-group-content-recall`}>
            {item.msgBody}
            {item.allowEdit && (
              <span
                className='oio-chart-group-content-recall-reWrite'
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
          <div className={`oio-chart-group-content-left oio-chart-group-content-con oio-chart-group-content-recall`}>
            {item.msgBody}
          </div>
        );
      default:
        if (item.isMySend) {
          return (
            <div className={`oio-chart-group-content-right oio-chart-group-content-con`}>
              {loadMsgItem(item)}
            </div>
          );
        } else {
          return (
            <div className={`oio-chart-group-content-left oio-chart-group-content-con`}>
              {loadMsgItem(item)}
            </div>
          );
        }
    }
  };

  return (
    <div className="oio-chart-group" ref={body} onScroll={onScroll}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="oio-chart-group-content">
          {messages
            .filter((i) => i.msgBody.includes(props.filter))
            .map((item, index: any) => {
              return (
                <React.Fragment key={item.id}>
                  {/* 聊天间隔时间3分钟则 显示时间 */}
                  {isShowTime(
                    item.createTime,
                    index > 0 ? messages[index - 1].createTime : '',
                  ) ? (
                    <div className="oio-chart-group-content-chart-time">
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
      <ForwardContentModal
        handleClose={handleForwadModalClose}
        open={forwardModalOpen}
        messages={forwardMessages}
        title={''}
        viewForward={viewForward}
      >
         <div className="oio-chart-group-content">
          {forwardMessages
            .filter((i) => i.msgBody.includes(props.filter))
            .map((item, index: any) => {
              return (
                <React.Fragment key={item.id}>
                  {/* 聊天间隔时间3分钟则 显示时间 */}
                  {isShowTime(
                    item.createTime,
                    index > 0 ? forwardMessages[index - 1].createTime : '',
                  ) ? (
                    <div className="oio-chart-group-content-chart-time">
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
      </ForwardContentModal>
    </div>
  );
};
export default GroupContent;
