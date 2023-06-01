/* eslint-disable no-unused-vars */
import { Button, Popover, Image, Spin, Badge } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import Information from './information';
import { showChatTime, downloadByUrl } from '@/utils/tools';
import { FileItemShare } from '@/ts/base/model';
import { IMessage, IMsgChat, MessageType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import ForwardModal from '@/pages/Chats/components/ForwardModal';
import { FileTypes } from '@/ts/core/public/consts';
import { formatSize } from '@/ts/base/common';
import { IconFont } from '@/components/IconFont';
import {
  filetrText,
  isShowLink,
  showCiteText,
  linkText,
} from '@/pages/Chats/config/common';
import css from './index.module.less';

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
      if ((await props.chat.moreMessage()) < 1) {
        setLoading(false);
      }
    }
  };

  /** 引用*/
  const cite = (item: IMessage) => {
    props.citeText(item);
  };

  /** 转发消息 */
  const forward = (item: IMessage) => {
    setForwardOpen(true);
    setFormwardCode(item);
  };

  /**
   * 显示消息
   * @param msg 消息
   */
  const parseMsg = (item: IMessage) => {
    switch (item.msgType) {
      case MessageType.Image: {
        const img: FileItemShare = parseAvatar(item.msgBody);
        if (img && img.thumbnail) {
          return (
            <>
              <div className={`${css.con_content_link}`}></div>
              <div className={`${css.con_content_txt}`}>
                <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
              </div>
            </>
          );
        }
        return <div className={`${css.con_content_txt}`}>消息异常</div>;
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.msgBody);
        const showFileIcon: (fileName: string) => string = (fileName) => {
          const parts = fileName.split('.');
          const fileTypeStr: string = parts[parts.length - 1];
          const iconName = FileTypes[fileTypeStr] ?? 'icon-weizhi';
          return iconName;
        };
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            <div className={`${css.con_content_file}`}>
              <div className={css.con_content_file_info}>
                <span className={css.con_content_file_info_label}>{file.name}</span>
                <span className={css.con_content_file_info_value}>
                  {formatSize(file.size ?? 0)}
                </span>
              </div>
              <IconFont
                className={css.con_content_file_Icon}
                type={showFileIcon(file.name)}
              />
            </div>
          </>
        );
      }
      case MessageType.Voice: {
        if (!item.msgBody) {
          return <span>无法解析音频</span>;
        }
        const bytes = JSON.parse(item.msgBody).bytes;
        const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        return (
          <div className={css.voiceStyle}>
            <audio src={url} controls />
          </div>
        );
      }
      default: {
        // 优化截图展示问题
        if (item.msgBody.includes('$IMG')) {
          let str = item.msgBody;
          const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)];
          // 获取消息包含的图片地址
          const imgUrls = matches.map((match) => match[1]);
          // 替换消息里 图片信息特殊字符
          const willReplaceStr = matches.map((match) => match[0]);
          willReplaceStr.forEach((strItem) => {
            str = str.replace(strItem, ' ');
          });
          // 垂直展示截图信息。把文字消息统一放在底部
          return (
            <>
              <div className={`${css.con_content_link}`}></div>
              <div className={`${css.con_content_txt}`}>
                {imgUrls.map((url, idx) => (
                  <Image
                    className={css.cut_img}
                    src={url}
                    key={idx}
                    preview={{ src: url }}
                  />
                ))}
                {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
              </div>
            </>
          );
        }
        // 默认文本展示
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            {/* 设置文本为超链接时打开新页面 */}
            {isShowLink(item.msgBody) ? (
              linkText(item.msgBody)
            ) : (
              <div
                className={`${css.con_content_txt}`}
                dangerouslySetInnerHTML={{ __html: filetrText(item) }}></div>
            )}
          </>
        );
      }
    }
  };

  const viewMsg = (item: IMessage) => {
    const isCite = item.msgBody.includes('$CITE[');
    if (item.isMySend) {
      return (
        <>
          <div className={`${css.con_content}`}>
            {props.chat.isBelongPerson ? (
              <React.Fragment>
                {parseMsg(item)}
                {/* 引用消息的展示 */}
                {isCite && showCiteText(item)}
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
                  {/* 引用消息的展示 */}
                  {isCite && showCiteText(item)}
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
            <TeamIcon share={item.from} preview size={36} fontSize={32} />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div style={{ color: '#888', paddingRight: 10 }}>
            <TeamIcon preview share={item.from} size={36} fontSize={32} />
          </div>
          <div className={`${css.con_content}`}>
            <div className={`${css.name}`}>{item.from.name}</div>
            {parseMsg(item)}
            {isCite && showCiteText(item)}
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
        <Button type="text" style={{ color: '#3e5ed8' }} onClick={() => cite(item)}>
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
