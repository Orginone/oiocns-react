import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Select,
  Card,
  List,
  Badge,
  Tag,
  Empty,
  Row,
  Col,
  Image,
  DatePicker,
  Button,
  Spin,
} from 'antd';
import type { SelectProps } from 'antd';
import { animateScroll } from 'react-scroll';
import { DownloadOutlined } from '@ant-design/icons';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IMsgChat, msgChatNotify, MessageType } from '@/ts/core';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import orgCtrl from '@/ts/controller';
import { model, parseAvatar } from '@/ts/base';
import { FileItemShare } from '@/ts/base/model';
import { showChatTime } from '@/utils/tools';
import { AiOutlineWechat } from 'react-icons/ai';
import filtrateStyle from './index.module.less';

interface IProps {
  chats: IMsgChat[];
}

const Filtrate: React.FC<IProps> = ({ chats }) => {
  const [msgKey] = useCtrlUpdate(msgChatNotify);
  const [filterStr, setFilterStr] = useState<string[]>([]);
  const [messages, setMessages] = useState<model.MsgSaveModel[]>([]);
  const [msgChat, setMsgChat] = useState<IMsgChat>();
  const [loading, setLoading] = useState(false);
  const [beforescrollHeight, setBeforescrollHeight] = useState(0);
  const [isSuperviseChat, setIsSuperviseChat] = useState<boolean>(false);
  const body = useRef<HTMLDivElement>(null);

  // 初始化加载所有会话
  if (chats === undefined) {
    chats = orgCtrl.user.chats.filter((i) => i.isMyChat);
  }
  // 选择人员回调
  const handleChange = (value: string[]) => {
    setFilterStr(value);
  };

  // 滚动时加载更多消息
  useEffect(() => {
    if (body && body.current) {
      if (loading) {
        setLoading(false);
        body.current.scrollTop = body.current.scrollHeight - beforescrollHeight;
      } else {
        setLoading(false);
      }
    }
  }, [messages]);

  /**
   * @description: 处理会话列表的展示
   * @return {*}
   */
  let chatsArr: any[] = [];
  if (filterStr.length > 0) {
    filterStr?.forEach((item) => {
      let chatItem = chats.filter((a) => a.chatdata.chatName.includes(item));
      chatsArr.push(...chatItem);
    });
  }

  // 获取所有的聊天历史消息
  useEffect(() => {
    if (msgChat !== undefined) {
      getAllHistoryMessage();
    }
  }, [msgChat]);
  const getAllHistoryMessage = async () => {
    if ((await msgChat!.moreMessage()) > 0) {
      getAllHistoryMessage();
    }
  };

  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && body.current.scrollTop === 0) {
      setLoading(true);
      setBeforescrollHeight(body.current.scrollHeight);
      if ((await msgChat!.moreMessage()) < 1) {
        setLoading(false);
      }
    }
  };

  /**
   * @description: options数组项去重
   * @param {T} Arr
   * @param {keyof} id
   * @return {*}
   */
  function ArrSet<T extends any>(Arr: T[], id: keyof T): T[] {
    let obj: any = {};
    const arrays = Arr.reduce((setArr, item: any) => {
      obj[`${item[id]}`] ? '' : (obj[`${item[id]}`] = true && setArr.push(item));
      return setArr;
    }, []);
    return arrays;
  }

  /**
   * 显示消息
   * @param msg 消息
   */
  const parseMsg = (item: model.MsgSaveModel) => {
    /** 通过item下的消息类型来判断其内容得属性 */
    switch (item.msgType) {
      /** 图片类型 */
      case MessageType.Image:
        // eslint-disable-next-line no-case-declarations
        const img: FileItemShare = parseAvatar(item.showTxt);
        return (
          <>
            <div></div>
            <div>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      /** 文件类型 */
      case MessageType.File:
        // eslint-disable-next-line no-case-declarations
        const file: FileItemShare = parseAvatar(item.showTxt);
        return (
          <>
            <div></div>
            <div>
              <Image src={file.thumbnail} preview={{ src: file.shareLink }} />
              <Button type="primary" icon={<DownloadOutlined />}>
                {file.name}
              </Button>
            </div>
          </>
        );
      default:
        return (
          <>
            <div dangerouslySetInnerHTML={{ __html: item.showTxt }}></div>
            {/* 设置文本为超链接时打开新页面 */}
            {/* {isShowLink(item.showTxt) ? (
              linkText(item.showTxt)
            ) : (
              <div
                className={`${css.con_content_txt}`}
                dangerouslySetInnerHTML={{ __html: item.showTxt }}></div>
            )} */}
          </>
        );
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
    if (isSuperviseChat === true) {
      scrollDown();
    }
  }, [isSuperviseChat]);

  /**
   * @description: 当单位发生改变时，触发筛选条件内容更新
   * @param {*} useMemo
   * @return {*}
   */
  const selectPeople = useMemo(() => {
    let options: SelectProps['options'] = [];
    // 超级管理权的群组不允许监察
    let filtrateArrs = chats.filter((it) => it.chatdata.chatName !== '超级管理权');
    filtrateArrs?.forEach((item) => {
      options?.push({
        label: item.chatdata.chatName,
        value: item.chatdata.chatName,
      });
    });
    // 处理options项
    options = ArrSet(options, 'label');

    return (
      <React.Fragment>
        <div className={`${filtrateStyle.selectPeople}`}>
          <Row>
            <Col span={6}>
              <Select
                key={msgKey}
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择人员"
                onChange={handleChange}
                options={options}
              />
            </Col>
            <Col span={6}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择群组"
                onChange={handleChange}
                options={options}
              />
            </Col>
            <Col span={6}>
              <DatePicker style={{ width: '100%' }} onChange={(e) => {}} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }, [chats]);

  const cardStatus = useMemo(() => {
    return (
      <React.Fragment>
        {isSuperviseChat ? (
          <Spin tip="加载中..." spinning={loading}>
            <div
              className={`${filtrateStyle.scroll_height}`}
              id="scroll-container"
              ref={body}
              onScroll={onScroll}>
              {messages.map((item, index) => {
                const share = orgCtrl.user.findShareById(item.fromId);
                const ownName = orgCtrl.user.findShareById(msgChat!.userId).name;
                return (
                  <div key={item.fromId + index}>
                    {item.fromId === msgChat?.userId ? (
                      <div className={`${filtrateStyle.own_all}`}>
                        <TeamIcon
                          share={orgCtrl.user.share}
                          preview
                          size={36}
                          fontSize={32}
                        />
                        <div className={`${filtrateStyle.own_item}`}>
                          <div className={`${filtrateStyle.own_name}`}>
                            <div>{ownName}</div>
                            <div>{showChatTime(item.createTime)}</div>
                          </div>
                          <div className={`${filtrateStyle.own_content}`}>
                            {parseMsg(item)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${filtrateStyle.other_all}`}>
                        <TeamIcon preview share={share} size={36} fontSize={32} />
                        <div className={`${filtrateStyle.other_item}`}>
                          <div className={`${filtrateStyle.other_name}`}>
                            <div>{share.name}</div>
                            <div>{showChatTime(item.createTime)}</div>
                          </div>
                          <div className={`${filtrateStyle.other_content}`}>
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
          <Card key={msgKey}>
            {chatsArr.length > 0 ? (
              <React.Fragment>
                {chatsArr.map((item) => {
                  return (
                    <List
                      key={item.chatId}
                      className="demo-loadmore-list"
                      itemLayout="horizontal"
                      dataSource={chatsArr}
                      renderItem={(item: IMsgChat) => {
                        return (
                          <List.Item
                            style={{ cursor: 'pointer' }}
                            onClick={async () => {
                              setTimeout(() => {
                                setMessages(item.messages);
                              }, 500);
                              setIsSuperviseChat(true);
                              setMsgChat(item);
                            }}
                            actions={[
                              <a
                                key="打开会话"
                                title="打开会话"
                                onClick={async () => {
                                  setTimeout(() => {
                                    setMessages(item.messages);
                                  }, 500);
                                  setIsSuperviseChat(true);
                                  setMsgChat(item);
                                }}>
                                <AiOutlineWechat
                                  style={{ fontSize: 18 }}></AiOutlineWechat>
                              </a>,
                            ]}>
                            <List.Item.Meta
                              avatar={
                                <Badge
                                  count={item.chatdata.noReadCount}
                                  overflowCount={99}
                                  size="small">
                                  <TeamIcon share={item.share} size={40} fontSize={40} />
                                </Badge>
                              }
                              title={
                                <div>
                                  <span style={{ marginRight: 10 }}>
                                    {item.chatdata.chatName}
                                  </span>
                                  {item.chatdata.labels
                                    .filter((i) => i.length > 0)
                                    .map((label) => {
                                      return (
                                        <Tag key={label} color="success">
                                          {label}
                                        </Tag>
                                      );
                                    })}
                                </div>
                              }
                              // description={showMessage(item)}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        )}
      </React.Fragment>
    );
  }, [chatsArr]);

  return (
    <React.Fragment>
      {selectPeople}
      {cardStatus}
    </React.Fragment>
  );
};

export default Filtrate;
