import { Badge, Card, Empty, List, Tag, Checkbox, Typography, Dropdown } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IMsgChat, msgChatNotify, ICompany } from '@/ts/core';
import { XTarget } from '@/ts/base/schema';
import { orgAuth } from '@/ts/core/public/consts';
import SuperMsgs from '@/ts/core/chat/message/supermsg';
import css from './index.module.less';
import { showChatTime } from '@/utils/tools';
const { Text } = Typography;

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

  const loadChatOperation = (item: IMsgChat) => {
    const operates: any[] = [];
    if (item.chatdata.noReadCount < 1) {
      operates.push(
        <a
          key="标记为未读"
          title="标记为未读"
          onClick={async () => {
            item.chatdata.noReadCount += 1;
            item.cache();
            msgChatNotify.changCallback();
          }}>
          标记为未读
        </a>,
      );
    }
    if (item.chatdata.isToping) {
      operates.push(
        <a
          key="取消置顶"
          title="取消置顶"
          onClick={async () => {
            item.labels = item.labels.RemoveAll((i) => i === '置顶');
            item.chatdata.isToping = false;
            item.cache();
            msgChatNotify.changCallback();
          }}>
          取消置顶
        </a>,
      );
    } else {
      operates.push(
        <a
          key="置顶会话"
          title="置顶会话"
          onClick={async () => {
            item.chatdata.isToping = true;
            item.labels.Add('置顶');
            item.cache();
            msgChatNotify.changCallback();
          }}>
          置顶会话
        </a>,
      );
    }
    if (!item.isFriend) {
      operates.push(
        <a
          key="加好友"
          title="加好友"
          onClick={async () => {
            if (await item.space.user.pullMembers([item.metadata as XTarget])) {
              msgChatNotify.changCallback();
            }
          }}>
          加好友
        </a>,
      );
    }
    return operates.map((item, index) => {
      return {
        key: `${index}`,
        label: item,
      };
    });
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
                <Dropdown
                  menu={{ items: loadChatOperation(item) }}
                  trigger={['contextMenu']}>
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    extra={
                      <Text type="secondary">
                        {item.chatdata.lastMessage
                          ? showChatTime(item.chatdata.lastMessage?.createTime)
                          : ''}
                      </Text>
                    }
                    onClick={() => {
                      orgCtrl.currentKey = item.chatdata.fullId;
                      orgCtrl.changCallback();
                    }}>
                    <List.Item.Meta
                      avatar={
                        <Badge count={item.chatdata.noReadCount} size="small">
                          <TeamIcon
                            typeName={item.typeName}
                            entityId={item.id}
                            size={40}
                          />
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
                                <Tag
                                  key={label}
                                  color={label === '置顶' ? 'red' : 'success'}>
                                  {label}
                                </Tag>
                              );
                            })}
                        </div>
                      }
                      description={
                        <>
                          {item.chatdata.mentionMe && (
                            <span style={{ color: 'red' }}>[有人@我]</span>
                          )}
                          <span>{item.information}</span>
                        </>
                      }></List.Item.Meta>
                  </List.Item>
                </Dropdown>
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
