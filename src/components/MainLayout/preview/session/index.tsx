import { List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { IFile, ISession, ITarget, TargetType } from '@/ts/core';
import { command } from '@/ts/base';
import Directory from '@/components/Directory';
import DirectoryViewer from '@/components/Directory/views';
import TargetActivity from '@/components/TargetActivity';
import { loadFileMenus } from '@/executor/fileOperate';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import ChatBody from './chat';
const SessionBody = ({
  target,
  session,
  setting,
}: {
  target: ITarget;
  session: ISession;
  setting?: boolean;
}) => {
  const [actions, setActons] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState('');
  useEffect(() => {
    const newActions: string[] = [];
    if (target.typeName === TargetType.Storage) {
      newActions.push('setting', 'activity');
    } else {
      if (session.isMyChat && target.typeName !== TargetType.Group) {
        newActions.push('chat');
      }
      newActions.push('activity');
      if (session.members.length > 0 || session.id === session.userId) {
        newActions.push('store', 'setting');
      }
    }
    setActons(newActions);
    if (!newActions.includes(bodyType)) {
      if (setting && newActions.includes('setting')) {
        setBodyType('setting');
      } else {
        setBodyType(newActions[0]);
      }
    }
  }, [target]);

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody key={target.key} chat={session} filter={''} />;
      case 'activity':
        return <TargetActivity height={700} activity={session.activity} />;
      case 'store':
        return <Directory key={target.key} root={target.directory} />;
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

  const getTitle = (flag: string) => {
    switch (flag) {
      case 'chat':
        return '沟通';
      case 'activity':
        return '动态';
      case 'store':
        return '数据';
      case 'setting':
      default:
        return '关系';
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
                title={getTitle(flag)}
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
                <span style={{ marginRight: 10 }}>{session.name}</span>
                {session.members.length > 0 && (
                  <span className={css.number}>({session.members.length})</span>
                )}
              </>
            }
            avatar={<TeamIcon entity={session.metadata} size={50} />}
            description={session.groupTags
              .filter((i) => i.length > 0)
              .map((label) => {
                return (
                  <Tag key={label} color={label === '置顶' ? 'red' : 'success'}>
                    {label}
                  </Tag>
                );
              })}
          />
        </List.Item>
        <div className={css.groupDetailContent}>{loadContext()}</div>
      </div>
    </>
  );
};
export default SessionBody;
