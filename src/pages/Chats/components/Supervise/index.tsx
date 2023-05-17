import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Spin, Image, Empty } from 'antd';
import { IconFont } from '@/components/IconFont';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { FileItemShare } from '@/ts/base/model';
import { ICompany, MessageType, ChatMessage } from '@/ts/core';
import { model, parseAvatar } from '@/ts/base';
import { showChatTime } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import { FileTypes } from '@/ts/core/public/consts';
import SuperMsgs from '@/ts/core/chat/message/supermsg';
import { filetrText, isShowLink } from '../../content/chat/GroupContent/common';
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

  /** 过滤非http链接字符 */
  const linkText = (val: string) => {
    const reg = /[\u4e00-\u9fa5]+/g;
    const link = val.substring(val.indexOf('http'), val.length);
    return (
      <div className={`${css.con_content_a}`}>
        <span className={`${css.con_content_span}`}>
          {val?.substring(val.indexOf('http'), 0)}
        </span>
        <a
          dangerouslySetInnerHTML={{ __html: link }}
          href={val.replace(reg, '')}
          target="_blank"
          rel="noreferrer"></a>
      </div>
    );
  };

  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && body.current.scrollTop === 0) {
      setLoading(true);
      // setBeforescrollHeight(body.current.scrollHeight);
      // if ((await chat.moreMessage()) < 1) {
      //   setLoading(false);
      // }
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
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            <div className={`${css.con_content_txt} ${css.con_content_img}`}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.showTxt);
        const showSize: (size: number) => string = (size) => {
          if (size > 1024000) {
            return (size / 1024000).toFixed(2) + 'M';
          } else {
            return (size / 1024).toFixed(2) + 'KB';
          }
        };
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
                  {showSize(file?.size ?? 0)}
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
      default: {
        // 优化截图展示问题
        if (item.showTxt.includes('$IMG')) {
          let str = item.showTxt;
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
            {isShowLink(item.showTxt) ? (
              linkText(item.showTxt)
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
              const share = orgCtrl.user.findShareById(item.fromId);
              const own_name = orgCtrl.user.findShareById(item.toId);
              return (
                <div key={item.fromId + index}>
                  <div className={`${css.other_all}`}>
                    <TeamIcon preview share={share} size={36} fontSize={32} />
                    <div className={`${css.other_item}`}>
                      <div className={`${css.other_name}`}>
                        <div>
                          {share.name}
                          &emsp;to:&emsp;
                          {own_name.name}
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
