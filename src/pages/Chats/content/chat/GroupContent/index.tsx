/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import { Button, Popover, Image, Spin, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import css from './index.module.less';
import { debounce, downloadByUrl, showChatTime } from '@/utils/tools';
import { FileItemShare } from '@/ts/base/model';
import orgCtrl from '@/ts/controller';
import { IMsgChat, MessageType } from '@/ts/core';
import { model, parseAvatar } from '@/ts/base';
import { filetrText, isShowLink, renderHasReadTxt, showCiteText } from './common';
import ForwardModal from './forwardModal';
import { IconFont } from '@/components/IconFont';
import { FileTypes } from '@/ts/core/public/consts';

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
  enterCiteMsg: model.MsgSaveModel;
}
interface tagsMsgType {
  belongId: string;
  ids: string[];
  tags: string[];
}
let isFirst = false;
const GroupContent = (props: Iprops) => {
  const { citeText, enterCiteMsg, chat } = props;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(props.chat.messages);
  const { handleReWrites } = props;
  const [selectId, setSelectId] = useState<string>('');
  const body = useRef<HTMLDivElement>(null);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  // 设置转发打开窗口
  const [forwardOpen, setForwardOpen] = useState(false);
  // 转发时用户
  const [formwardCode, setFormwardCode] = useState<model.MsgSaveModel>();

  useEffect(() => {
    isFirst = true;
  }, []);
  useEffect(() => {
    setMessages([...props.chat.messages]);

    props.chat.onMessage((ms) => {
      // 标记已获取信息为已读
      if (ms.length > 0 && ms[0].belongId !== orgCtrl.user.userId) {
        props.chat.tagHasReadMsg(ms);
      }
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
        if (body.current) {
          body.current.scrollHeight > beforescrollHeight &&
            (body.current.scrollTop = body.current.scrollHeight - beforescrollHeight);
        }
      } else {
        // 判断是否在向上滚动；若处于向上滚动则，不到底部
        if (body.current.scrollTop > 30 || isFirst) {
          // 新消息，滚动置底
          body.current.scrollTop = body.current.scrollHeight;
        }
      }
    }
  }, [messages]);

  const isShowTime = (curDate: string, beforeDate: string) => {
    if (beforeDate === '') return true;
    return moment(curDate).diff(beforeDate, 'minute') > 3;
  };

  // 滚动事件
  const onScroll = debounce(async () => {
    if (!loading && body.current && props.chat && body.current.scrollTop < 10) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
      if ((await props.chat.moreMessage()) < 1) {
        isFirst = false;
        setLoading(false);
      }
    }
  }, 50);

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
          target="_blank"></a>
      </div>
    );
  };

  /** 引用*/
  const cite = (item: model.MsgSaveModel) => {
    citeText(item);
  };

  /** 转发消息 */
  const forward = (item: model.MsgSaveModel) => {
    setForwardOpen(true);
    setFormwardCode(item);
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
        // 文件展示样式
        return (
          <>
            <div className={`${css.con_content_link}`}></div>
            <div className={`${css.con_content_file}`}>
              {/* <Image src={file.thumbnail} preview={{ src: file.shareLink }} /> */}
              {/* <Button type="primary" icon={<DownloadOutlined />}>
                {file.name}
              </Button> */}
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

  const viewMsg = (item: model.MsgSaveModel, right: boolean = false) => {
    const isCite = item.showTxt.includes('$CITEMESSAGE[');
    if (right) {
      return (
        <>
          <div className={`${css.con_content}`}>
            {/* 主体展示文字 */}
            {parseMsg(item)}
            {/* 引用消息的展示 */}
            {isCite && showCiteText(item)}
            {/*  显示已读未读信息 */}
            {renderHasReadTxt(item, chat.members)}
          </div>
          <div style={{ color: '#888', paddingLeft: 10 }}>
            <TeamIcon share={orgCtrl.user.share} preview size={36} fontSize={32} />
          </div>
        </>
      );
    } else {
      // 左侧的聊天内容
      const share = orgCtrl.user.findShareById(item.fromId);
      return (
        <>
          <div style={{ color: '#888', paddingRight: 10 }}>
            <TeamIcon preview share={share} size={36} fontSize={32} />
          </div>
          <div className={`${css.con_content}`}>
            <div className={`${css.name}`}>{share.name}</div>
            {parseMsg(item)}
            {isCite && showCiteText(item)}
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
        <Button type="text" style={{ color: '#3e5ed8' }} onClick={() => forward(item)}>
          转发
        </Button>
        {item.fromId === orgCtrl.user.userId && (
          <Button
            type="text"
            style={{ color: '#3e5ed8' }}
            onClick={async () => {
              await props.chat.recallMessage(item.id);
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
              const url = parseAvatar(item.showTxt).shareLink;
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
                  {item.fromId !== orgCtrl.user.metadata.id ? (
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
                              setSelectId(item.id);
                              e.preventDefault();
                              e.stopPropagation();
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
