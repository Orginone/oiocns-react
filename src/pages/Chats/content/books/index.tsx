import { Badge, Card, Empty, List, Tag, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { AiOutlineWechat } from 'react-icons/ai';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { ICompany, IMsgChat, MessageType, msgChatNotify } from '@/ts/core';
import { filetrText } from '../chat/GroupContent/common';
import { orgAuth } from '@/ts/core/public/consts';
import css from './index.module.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import SuperMsgs from '@/ts/core/chat/message/supermsg';
import { showChatTime } from '@/utils/tools';
import { showCiteName } from '@/utils/common';
/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<any> = ({
  chats,
  filter,
  belong,
}: {
  chats: IMsgChat[];
  filter: string;
  belong: ICompany;
}) => {
  const [isSupervise, setIsSupervise] = useState<boolean>(false); // 是否有超管权限
  const [msgKey] = useCtrlUpdate(msgChatNotify);
  if (chats === undefined) {
    chats = orgCtrl.chat.chats.filter((i) => i.isMyChat);
  }
  chats = chats
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.chatdata.labels.filter((l) => l.includes(filter)).length > 0,
    )
    .sort((a, b) => {
      const num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        return b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 1 : -1;
      }
      return num;
    });

  /**
   * @description: 页面加载判断是否有超管权限
   * @return {*}
   */
  useEffect(() => {
    if (belong !== undefined) {
      setIsSupervise(belong.hasAuthoritys([orgAuth.SuperAuthId]));
    }
  }, [belong]);

  let selectMenus: string[] = [];
  const selectChange = (e: CheckboxChangeEvent, chaId: string, superChatid: string[]) => {
    if (e.target.checked) {
      selectMenus.push(chaId);
      const SuperSet = new Set(superChatid);
      selectMenus = [...selectMenus, ...SuperSet];
    } else {
      const newSet = new Set(selectMenus);
      const SuperSet = new Set(superChatid);
      newSet.delete(chaId);
      SuperSet.delete(chaId);
      const newIdArr = [...newSet, ...SuperSet];
      selectMenus = newIdArr;
    }
    SuperMsgs.getSuperChatIds(selectMenus);
  };

  const showMessage = (chat: IMsgChat) => {
    if (chat.chatdata.lastMessage) {
      let text = '最新消息[' + showChatTime(chat.chatdata.lastMessage.createTime) + ']:';
      if (chat.chatdata.lastMessage.msgType === MessageType.Text) {
        return (
          text +
          filetrText(chat.chatdata.lastMessage) +
          showCiteName(chat.chatdata.isFindme, chat.userId)
        );
      }
      return text + '[' + chat.chatdata.lastMessage.msgType + ']';
    }
    return '简介信息:' + chat.chatdata.chatRemark;
  };
  return (
    <Card key={msgKey}>
      {chats.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={(item: IMsgChat) => {
            return (
              <div className={css.book_ul}>
                {isSupervise ? (
                  <Checkbox
                    className={css.check}
                    defaultChecked={SuperMsgs.chatIds.includes(item.chatId)}
                    key={item.key}
                    onChange={(e) => {
                      selectChange(e, item.chatId, SuperMsgs.chatIds);
                    }}
                  />
                ) : (
                  ''
                )}
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    orgCtrl.currentKey = item.chatdata.fullId;
                    orgCtrl.changCallback();
                  }}
                  actions={[
                    <a
                      key="打开会话"
                      title="打开会话"
                      onClick={async () => {
                        orgCtrl.currentKey = item.chatdata.fullId;
                        orgCtrl.changCallback();
                      }}>
                      <AiOutlineWechat style={{ fontSize: 18 }}></AiOutlineWechat>
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
                        <span style={{ marginRight: 10 }}>{item.chatdata.chatName}</span>
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
                    description={showMessage(item)}
                  />
                </List.Item>
              </div>
            );
          }}
        />
      )}

      {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
  );
};
export default Book;
