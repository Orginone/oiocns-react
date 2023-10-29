import { List } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { ITarget, TargetType } from '@/ts/core';
import { ellipsisText } from '@/utils';
import ChatBody from './chat';
import { command } from '@/ts/base';
import TargetActivity from '@/components/TargetActivity';
import MemberContent from './member';
import { ImAddressBook, ImQrcode, ImBubbles2, ImLifebuoy } from '@/icons/im';
const SessionBody = ({ target, setting }: { target: ITarget; setting?: boolean }) => {
  const [bodyType, setBodyType] = useState(setting ? 'activity' : 'chat');
  const sessionActions = () => {
    const actions = [];
    if (target.session.isMyChat && target.typeName !== TargetType.Group) {
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
    if (target.members.length > 0) {
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
          command.emitter('executor', 'qrcode', target);
        }}
      />,
    );
    return actions;
  };

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody chat={target.session} filter={''} />;
      case 'member':
        if (target.members.length > 0) {
          return <MemberContent dircetory={target.memberDirectory} />;
        } else if (setting) {
          return (
            <TargetActivity
              height={700}
              activity={target.session.activity}></TargetActivity>
          );
        } else {
          return <ChatBody chat={target.session} filter={''} />;
        }
      case 'activity':
        return (
          <TargetActivity
            height={700}
            activity={target.session.activity}></TargetActivity>
        );
    }
  };

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item className={css.header} actions={sessionActions()}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>
                  {target.session.chatdata.chatName}
                </span>
                {target.members.length > 0 && (
                  <span className={css.number}>({target.members.length})</span>
                )}
              </>
            }
            avatar={<TeamIcon entity={target.session.metadata} size={50} />}
            description={ellipsisText(target.session.chatdata.chatRemark, 50)}
          />
        </List.Item>
        <div className={css.groupDetailContent}>{loadContext()}</div>
      </div>
    </>
  );
};
export default SessionBody;
