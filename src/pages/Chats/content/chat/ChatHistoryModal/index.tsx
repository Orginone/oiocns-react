import React, { useEffect, ChangeEvent, useState, useRef } from 'react';
import { Modal, Spin, Image, Empty } from 'antd';
import { animateScroll } from 'react-scroll';
import SearchInput from '@/components/SearchInput';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMsgChat, MessageType, IMessage } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { parseAvatar } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { filetrText, isShowLink, linkText } from '@/pages/Chats/config/common';
import { showChatTime } from '@/utils/tools';
import { FileTypes } from '@/ts/core/public/consts';
import { formatSize } from '@/ts/base/common';
import { IconFont } from '@/components/IconFont';
import ChatHistoryStyle from './index.module.less';

interface Iprops {
  open: boolean;
  title?: JSX.Element;
  onCancel: () => void;
  chat: IMsgChat;
}

const ChatHistoryModal: React.FC<Iprops> = ({ open, title, onCancel, chat }) => {
  const [messages, setMessages] = useState(chat.messages);
  const [loading, setLoading] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  /**
   * @description: 搜索事件
   * @return {*}
   */
  const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
    filterOne(chat.messages, e.target.value, ['msgBody']);
  };

  /**
   * @description: 一维数组对象模糊搜索  历史消息，模糊匹配
   * @param {*} dataList 为一维数组数据结构
   * @param {*} value 为input框的输入值
   * @param {*} type type 为指定想要搜索的字段名，array格式 ['showTxt']
   * @return {*}
   */
  const filterOne = (dataList: any[], value: string, type: string[]) => {
    let s = dataList.filter(function (item) {
      for (let j = 0; j < type.length; j++) {
        if (item[type[j]] != undefined || item[type[j]] != null) {
          if (item[type[j]].indexOf(value) >= 0) {
            return item;
          }
        }
      }
    });
    setMessages(s);
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
              <div className={`${ChatHistoryStyle.con_content_link}`}></div>
              <div
                className={`${ChatHistoryStyle.con_content_txt} ${ChatHistoryStyle.con_content_img}`}>
                <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
              </div>
            </>
          );
        }
        return <div className={`${ChatHistoryStyle.con_content_txt}`}>消息异常</div>;
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
            <div className={`${ChatHistoryStyle.con_content_link}`}></div>
            <div className={`${ChatHistoryStyle.con_content_file}`}>
              <div className={ChatHistoryStyle.con_content_file_info}>
                <span className={ChatHistoryStyle.con_content_file_info_label}>
                  {file.name}
                </span>
                <span className={ChatHistoryStyle.con_content_file_info_value}>
                  {formatSize(file.size ?? 0)}
                </span>
              </div>
              <IconFont
                className={ChatHistoryStyle.con_content_file_Icon}
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
          <div className={ChatHistoryStyle.voiceStyle}>
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
              <div className={`${ChatHistoryStyle.con_content_link}`}></div>
              <div className={`${ChatHistoryStyle.con_content_txt}`}>
                {imgUrls.map((url, idx) => (
                  <Image
                    className={ChatHistoryStyle.cut_img}
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
            {/* 设置文本为超链接时打开新页面 */}
            {isShowLink(item.msgBody) ? (
              linkText(item.msgBody)
            ) : (
              <div
                className={`${ChatHistoryStyle.con_content_txt}`}
                dangerouslySetInnerHTML={{ __html: filetrText(item) }}></div>
            )}
          </>
        );
      }
    }
  };

  /**
   * @description: 历史消息默认滚动
   * @return {*}
   */
  const scrollDown = () => {
    animateScroll.scrollToBottom({
      containerId: 'scroll-container', // 这个是组件的容器 ID
      duration: 0, // 去掉滚动动画
    });
  };
  // 在组件渲染时调用
  useEffect(() => {
    scrollDown();
  }, [open]);

  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && chat && body.current.scrollTop === 0) {
      setLoading(true);
      if ((await chat.moreMessage()) < 1) {
        setLoading(false);
      }
    }
  };

  // 获取所有的聊天历史消息
  useEffect(() => {
    getAllHistoryMessage();
  }, []);
  const getAllHistoryMessage = async () => {
    if ((await chat.moreMessage()) > 0) {
      getAllHistoryMessage();
    }
  };

  return (
    <div className={`${ChatHistoryStyle.history}`}>
      <Modal
        title={title}
        open={open}
        footer={null}
        onCancel={onCancel}
        getContainer={false}>
        <div className={`${ChatHistoryStyle.search}`}>
          <SearchInput
            onChange={(e) => {
              searchChange(e);
            }}
          />
        </div>
        {messages.length > 0 ? (
          <Spin tip="加载中..." spinning={loading}>
            <div
              className={`${ChatHistoryStyle.scroll_height}`}
              id="scroll-container"
              ref={body}
              onScroll={onScroll}>
              {messages.map((item, index) => {
                const share = item.from;
                const ownName = orgCtrl.user.findShareById(chat.userId).name;
                return (
                  <div key={item.metadata.fromId + index}>
                    {item.metadata.fromId === chat.userId ? (
                      <div className={`${ChatHistoryStyle.own_all}`}>
                        <TeamIcon
                          share={orgCtrl.user.share}
                          preview
                          size={36}
                          fontSize={32}
                        />
                        <div className={`${ChatHistoryStyle.own_item}`}>
                          <div className={`${ChatHistoryStyle.own_name}`}>
                            <div>{ownName}</div>
                            <div>{showChatTime(item.createTime)}</div>
                          </div>
                          <div className={`${ChatHistoryStyle.own_content}`}>
                            {parseMsg(item)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${ChatHistoryStyle.other_all}`}>
                        <TeamIcon preview share={share} size={36} fontSize={32} />
                        <div className={`${ChatHistoryStyle.other_item}`}>
                          <div className={`${ChatHistoryStyle.other_name}`}>
                            <div>{share.name}</div>
                            <div>{showChatTime(item.createTime)}</div>
                          </div>
                          <div className={`${ChatHistoryStyle.other_content}`}>
                            {parseMsg(item)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Spin>
        ) : (
          <Empty
            description="暂无历史消息"
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ChatHistoryModal;
