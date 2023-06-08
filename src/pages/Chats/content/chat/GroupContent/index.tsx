/* eslint-disable no-unused-vars */
import { Button, Popover, Spin, Badge } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import Information from './information';
import { showChatTime, downloadByUrl } from '@/utils/tools';
import { IMessage, IMsgChat, MessageType, TargetType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import ForwardModal from '@/pages/Chats/components/ForwardModal';
import css from './index.module.less';
import { parseCiteMsg, parseMsg } from '@/pages/Chats/components/parseMsg';

/**
 * @description: 聊天区域
 * @return {*}
 */

interface Iprops {
  chat: IMsgChat;
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
  const [selectId, setSelectId] = useState<string>('');
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  const [forwardOpen, setForwardOpen] = useState(false); // 设置转发打开窗口
  const [formwardCode, setFormwardCode] = useState<IMessage>(); // 转发时用户

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

  /** 转发消息 */
  const forward = (item: IMessage) => {
    setForwardOpen(true);
    setFormwardCode(item);
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
            <TeamIcon
              typeName={TargetType.Person}
              entityId={item.metadata.fromId}
              preview
              size={36}
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div style={{ color: '#888', paddingRight: 10 }}>
            <TeamIcon
              typeName={TargetType.Person}
              entityId={item.metadata.fromId}
              preview
              size={36}
            />
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
        open={selectId == item.id}
        key={item.id}
        placement="bottomRight"
        onOpenChange={() => {
          setSelectId('');
        }}
        content={msgAction(item)}>
        <div
          className={css.con_body}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectId(item.id);
          }}>
          {viewMsg(item)}
        </div>
      </Popover>
    );
  };

  const msgAction = (item: IMessage) => {
    const onClose = () => {
      setSelectId('');
    };
    return (
      <>
        <CopyToClipboard text={item.msgBody}>
          <Button type="text" style={{ color: '#3e5ed8' }} onClick={onClose}>
            复制
          </Button>
        </CopyToClipboard>
        <Button type="text" style={{ color: '#3e5ed8' }} onClick={() => forward(item)}>
          转发
        </Button>
        {item.isMySend && (
          <Button
            type="text"
            style={{ color: '#3e5ed8' }}
            onClick={async () => {
              await props.chat.recallMessage(item.id);
              onClose();
            }}>
            撤回
          </Button>
        )}
        <Button
          type="text"
          style={{ color: '#3e5ed8' }}
          onClick={() => props.citeText(item)}>
          引用
        </Button>
        {['文件', '视频', '图片'].includes(item.msgType) && (
          <Button
            type="text"
            onClick={() => {
              const url = parseAvatar(item.msgBody).shareLink;
              downloadByUrl(url);
            }}
            style={{ color: '#3e5ed8' }}>
            下载
          </Button>
        )}
        <Button
          type="text"
          danger
          onClick={async () => {
            await props.chat.deleteMessage(item.id);
            onClose();
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
                  {/* 重新编辑 */}
                  {item.msgType === MessageType.Recall && (
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
                  )}
                  {/* 左侧聊天内容显示 */}
                  {!item.isMySend && item.msgType != MessageType.Recall && (
                    <div className={`${css.group_content_left} ${css.con}`}>
                      {loadMsgItem(item)}
                    </div>
                  )}
                  {/* 右侧聊天内容显示 */}
                  {item.isMySend && item.msgType != MessageType.Recall && (
                    <div className={`${css.group_content_right} ${css.con}`}>
                      {loadMsgItem(item)}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
        {infoMsg && <Information msg={infoMsg} onClose={() => setInfoMsg(undefined)} />}
      </Spin>
      {forwardOpen && (
        <ForwardModal
          visible={forwardOpen}
          onCancel={() => setForwardOpen(false)}
          formwardCode={formwardCode}
        />
      )}
    </div>
  );
};
export default GroupContent;
