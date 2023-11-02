import { List } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { ISession, ITarget, TargetType } from '@/ts/core';
import { ellipsisText } from '@/utils';
import ChatBody from './chat';
import { command } from '@/ts/base';
import TargetActivity from '@/components/TargetActivity';
import MemberContent from './member';
import orgCtrl from '@/ts/controller';
import { ImAddressBook, ImQrcode, ImBubbles2, ImLifebuoy, ImFolder } from '@/icons/im';
import { useHistory } from 'react-router-dom';
const SessionBody = ({
  target,
  session,
  setting,
}: {
  target: ITarget;
  session: ISession;
  setting?: boolean;
}) => {
  const history = useHistory();
  const [bodyType, setBodyType] = useState(setting ? 'member' : 'chat');
  const sessionActions = () => {
    const actions = [];
    if (session.isMyChat && target.typeName !== TargetType.Group) {
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
    if (session.members.length > 0 || session.id === session.userId) {
      actions.push(
        <ImFolder
          key="store"
          size={26}
          title="存储"
          onClick={() => {
            orgCtrl.currentKey = target.directory.key;
            history.push('/store');
          }}
        />,
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
          command.emitter('executor', 'qrcode', target);
        }}
      />,
    );
    return actions;
  };

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody chat={session} filter={''} />;
      case 'member':
        if (session.members.length > 0 || session.id === session.userId) {
          return <MemberContent dircetory={target.memberDirectory} />;
        } else if (setting) {
          return (
            <TargetActivity height={700} activity={session.activity}></TargetActivity>
          );
        } else {
          return <ChatBody chat={session} filter={''} />;
        }
      case 'activity':
        return <TargetActivity height={700} activity={session.activity}></TargetActivity>;
    }
  };

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item className={css.header} actions={sessionActions()}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>{session.chatdata.chatName}</span>
                {session.members.length > 0 && (
                  <span className={css.number}>({session.members.length})</span>
                )}
              </>
            }
            avatar={<TeamIcon entity={session.metadata} size={50} />}
            description={ellipsisText(session.chatdata.chatRemark, 50)}
          />
        </List.Item>
        <div className={css.groupDetailContent}>{loadContext()}</div>
      </div>
    </>
  );
};
export default SessionBody;
