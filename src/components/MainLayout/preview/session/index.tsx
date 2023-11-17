import { List } from 'antd';
import React, { useEffect, useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { IFile, ISession, ITarget, TargetType } from '@/ts/core';
import { ellipsisText } from '@/utils';
import { command } from '@/ts/base';
import DirectoryViewer from '@/components/Directory/views';
import TargetActivity from '@/components/TargetActivity';
import { loadFileMenus } from '@/executor/fileOperate';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import ChatBody from './chat';
import StoreBody from './store';
const SessionBody = ({ target, session }: { target: ITarget; session: ISession }) => {
  const [actions, setActons] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState('');
  useEffect(() => {
    const newActions: string[] = [];
    if (session.isMyChat && target.typeName !== TargetType.Group) {
      newActions.push('chat');
    }
    newActions.push('activity');
    if (session.members.length > 0 || session.id === session.userId) {
      newActions.push('store', 'setting');
    }
    setActons(newActions);
    if (!newActions.includes(bodyType)) {
      setBodyType(newActions[0]);
    }
  }, [target]);

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody key={target.key} chat={session} filter={''} />;
      case 'activity':
        return <TargetActivity height={700} activity={session.activity} />;
      case 'store':
        return <StoreBody key={target.key} target={target} />;
      case 'setting':
        return (
          <DirectoryViewer
            extraTags
            initTags={['成员']}
            selectFiles={[]}
            content={target.memberDirectory.content()}
            fileOpen={() => {}}
            contextMenu={(entity) => {
              const file = (entity as IFile) || target.memberDirectory;
              return {
                items: loadFileMenus(file),
                onClick: ({ key }: { key: string }) => {
                  command.emitter('executor', key, file);
                },
              };
            }}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item
          className={css.header}
          actions={actions.map((flag) => {
            const selected = flag === bodyType;
            return (
              <a
                key={flag}
                onClick={() => {
                  setBodyType(flag);
                }}>
                <OrgIcons type={flag} selected={selected} size={26} />
              </a>
            );
          })}>
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
