import React, { useEffect, ChangeEvent, useState, useRef } from 'react';
import { Modal, Spin, Image, Button, Empty } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { animateScroll } from 'react-scroll';
import SearchInput from '@/components/SearchInput';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IMsgChat, MessageType } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { model, parseAvatar } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { filetrText, isShowLink } from '../GroupContent/common';
import { showChatTime } from '@/utils/tools';
import ChatHistoryStyle from './index.module.less';

interface Iprops {
  open: boolean;
  title?: JSX.Element;
  onCancel: () => void;
  chat: IMsgChat;
  filter: string;
}

const ChatHistoryModal: React.FC<Iprops> = ({ open, title, onCancel, chat, filter }) => {
  const [messages, setMessages] = useState(chat.messages);
  const [loading, setLoading] = useState(false);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  const [searchStr, setSearchStr] = useState<string>('');
  const body = useRef<HTMLDivElement>(null);

  /**
   * @description: 处理第一次进入时的历史消息
   * @return {*}
   */
  useEffect(() => {
    setMessages([...chat.messages]);
    chat.onMessage((ms) => {
      setMessages([...ms]);
    });
    return () => {
      chat.unMessage();
    };
  }, [chat]);

  // 滚动时加载更多消息
  useEffect(() => {
    if (body && body.current && searchStr === '') {
      if (loading) {
        setLoading(false);
        body.current.scrollTop = body.current.scrollHeight - beforescrollHeight;
      } else {
        setLoading(false);
        // body.current.scrollTop = body.current.scrollHeight;
      }
    }
  }, [messages]);

  // 搜索防抖
  const debounce = (func: any, wait: number) => {
    let timer: any;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(func, wait);
    };
  };

  /**
   * @description: 搜索事件
   * @return {*}
   */
  const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchStr(e.target.value);
    debounce(filterOne(chat.messages, e.target.value, ['showTxt']), 500);
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

  /** 过滤非http链接字符 */
  const linkText = (val: string) => {
    const reg = /[\u4e00-\u9fa5]+/g;
    const link = val.substring(val.indexOf('http'), val.length);
    return (
      <div className={`${ChatHistoryStyle.con_content_a}`}>
        <span className={`${ChatHistoryStyle.con_content_span}`}>
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
            <div className={`${ChatHistoryStyle.con_content_link}`}></div>
            <div
              className={`${ChatHistoryStyle.con_content_txt} ${ChatHistoryStyle.con_content_img}`}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.showTxt);
        return (
          <>
            <div className={`${ChatHistoryStyle.con_content_link}`}></div>
            <div
              className={`${ChatHistoryStyle.con_content_file} ${ChatHistoryStyle.con_content_img}`}>
              <Image src={file.thumbnail} preview={{ src: file.shareLink }} />
              <Button type="primary" icon={<DownloadOutlined />}>
                {file.name}
              </Button>
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
              <div className={`${ChatHistoryStyle.con_content_link}`}></div>
              <div className={`${ChatHistoryStyle.con_content_txt}`}>
                {imgUrls.map((url, idx) => (
                  <Image src={url} key={idx} preview={{ src: url }} />
                ))}
                {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
              </div>
            </>
          );
        }
        return (
          <>
            <div className={`${ChatHistoryStyle.con_content_link}`}></div>
            {/* 设置文本为超链接时打开新页面 */}
            {isShowLink(item.showTxt) ? (
              linkText(item.showTxt)
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
    if (
      !loading &&
      body.current &&
      chat &&
      body.current.scrollTop === 0 &&
      searchStr === ''
    ) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
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
              {messages
                .filter((i) => i.showTxt.includes(filter))
                .map((item, index) => {
                  const share = orgCtrl.user.findShareById(item.fromId);
                  const ownName = orgCtrl.user.findShareById(chat.userId).name;
                  return (
                    <div key={item.fromId + index}>
                      {item.fromId === chat.userId ? (
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
