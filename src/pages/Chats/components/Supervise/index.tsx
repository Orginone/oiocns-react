import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Spin, Image, Empty } from 'antd';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { FileItemShare } from '@/ts/base/model';
import { ICompany, MessageType, ChatMessage, IMessage } from '@/ts/core';
import { model, parseAvatar } from '@/ts/base';
import { showChatTime } from '@/utils/tools';
import SuperMsgs from '@/ts/core/chat/message/supermsg';
import { formatSize } from '@/ts/base/common';
import css from './index.module.less';

interface IProps {
  belong: ICompany;
}

const Supervise: React.FC<IProps> = ({ belong }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<model.MsgSaveModel[]>([]);
  const [companyPerson] = useState(
    belong.chats.filter(
      (i) =>
        i.share.name !== '关系管理权' &&
        i.share.name !== '财物管理权' &&
        i.share.name !== '办事管理权',
    ),
  );
  const body = useRef<HTMLDivElement>(null);
  const ChatsMessage = new ChatMessage(belong);

  useEffect(() => {
    getAllMessage();
  }, [SuperMsgs.chatIds]);
  const getAllMessage = async () => {
    let chatsa = await ChatsMessage.moreMessage(
      true,
      SuperMsgs.chatIds.length === 0 ? [companyPerson[0].chatId] : SuperMsgs.chatIds,
    );
    setMessages(chatsa);
  };

  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && body.current.scrollTop === 0) {
      setLoading(true);
    }
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
              <div className={`${css.con_content_txt} ${css.con_content_img}`}>
                <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
              </div>
            </>
          );
        }
        return <div className={`${css.con_content_txt}`}>消息异常</div>;
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.msgBody);
        return (
          <>
            <div className={`${css.con_content_txt}`}>
              <a href={file.shareLink} title="点击下载">
                <div>
                  <b>{file.name}</b>
                </div>
                <div>{formatSize(file.size)}</div>
              </a>
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
            // str = str.replace(strItem, '图(' + (idx + 1) + ')');
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
                dangerouslySetInnerHTML={{ __html: item.msgBody }}></div>
            )}
          </>
        );
      }
    }
  };

  /**
   * @description: 左侧历史消息渲染模块
   * @return {*}
   */
  const historyMsg = useMemo(() => {
    return (
      <Spin tip="加载中..." spinning={loading}>
        <div
          className={`${css.scroll_height}`}
          id="scroll-container"
          ref={body}
          onScroll={onScroll}>
          {messages.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            messages.map((item, index) => {
              return (
                <div key={item.fromId + index}>
                  <div className={`${css.other_all}`}>
                    <TeamIcon preview entityId={item.fromId} size={36} />
                    <div className={`${css.other_item}`}>
                      <div className={`${css.other_name}`}>
                        <div>
                          <TeamIcon preview entityId={item.fromId} showName />
                          &emsp;发送给&emsp;
                          <TeamIcon preview entityId={item.toId} showName />
                        </div>
                        <div>{showChatTime(item.createTime)}</div>
                      </div>
                      <div className={`${css.other_content}`}>{parseMsg(item)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>
    );
  }, [messages]);

  return (
    <React.Fragment>
      <div className={`${css.supervise}`}>
        <div className={`${css.supervise_left}`}>{historyMsg}</div>
      </div>
    </React.Fragment>
  );
};

export default Supervise;
