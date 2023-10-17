import { List } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { ISession, TargetType } from '@/ts/core';
import { ellipsisText } from '@/utils';
import ChatBody from './chat';
import { command } from '@/ts/base';
import TargetActivity from '@/components/TargetActivity';
import MemberContent from './member';
import { ImAddressBook, ImQrcode, ImBubbles2, ImLifebuoy } from '@/icons/im';
const SessionBody = ({ chat, store }: { chat: ISession; store?: boolean }) => {
  const [bodyType, setBodyType] = useState(store ? 'activity' : 'chat');
  const sessionActions = () => {
    const actions = [];
    if (chat.isMyChat && chat.target.typeName !== TargetType.Group) {
      actions.push(
        <ImBubbles2
          key="chat"
          size={26}
          title="沟通"
          onClick={() => {
            setBodyType('chat');
          }}
        />,
      );
    }
    actions.push(
      <ImLifebuoy
        key="activity"
        size={26}
        title="动态"
        onClick={() => {
          setBodyType('activity');
        }}
      />,
    );
    if (chat.members.length > 0) {
      actions.push(
        <ImAddressBook
          key="setting"
          size={26}
          title="成员"
          onClick={() => {
            setBodyType('member');
          }}
        />,
      );
    }
    actions.push(
      <ImQrcode
        key="qrcode"
        size={26}
        title="二维码"
        onClick={() => {
          command.emitter('executor', 'qrcode', chat);
        }}
      />,
    );
    return actions;
  };

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody chat={chat} filter={''} />;
      case 'member':
        if (chat.members.length > 0) {
          return <MemberContent dircetory={chat.target.memberDirectory} />;
        } else if (store) {
          return <TargetActivity height={700} activity={chat.activity}></TargetActivity>;
        } else {
          return <ChatBody chat={chat} filter={''} />;
        }
      case 'activity':
        return <TargetActivity height={700} activity={chat.activity}></TargetActivity>;
    }
  };

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item className={css.header} actions={sessionActions()}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>{chat.chatdata.chatName}</span>
                {chat.members.length > 0 && (
                  <span className={css.number}>({chat.members.length})</span>
                )}
              </>
            }
            avatar={<TeamIcon entity={chat.metadata} size={50} />}
            description={ellipsisText(chat.chatdata.chatRemark, 50)}
          />
        </List.Item>
        <div className={css.groupDetailContent}>{loadContext()}</div>
      </div>
    </>
  );
};
export default SessionBody;
