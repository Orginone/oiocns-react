import { List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { IFile, ISession, TargetType } from '@/ts/core';
import { command } from '@/ts/base';
import Directory from '@/components/Directory';
import DirectoryViewer from '@/components/Directory/views';
import TargetActivity from '@/components/TargetActivity';
import { loadFileMenus } from '@/executor/fileOperate';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import ChatBody from './chat';
import { cleanMenus } from '@/utils/tools';
const SessionBody = ({ session, setting }: { session: ISession; setting?: boolean }) => {
  const [actions, setActons] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState('');
  useEffect(() => {
    const newActions: string[] = [];
    if (session.target.typeName === TargetType.Storage) {
      newActions.push('relation', 'activity');
    } else {
      if (session.isMyChat && session.target.typeName !== TargetType.Group) {
        newActions.push('chat');
      }
      newActions.push('activity');
      if (session.id === session.target.id) {
        newActions.push('store', 'relation');
      }
    }
    if (session.target.hasRelationAuth()) {
      newActions.push('setting');
    }
    setActons(newActions);
    if (!newActions.includes(bodyType)) {
      if (setting && newActions.includes('relation')) {
        setBodyType('relation');
      } else {
        setBodyType(newActions[0]);
      }
    }
  }, [session]);

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody key={session.target.key} chat={session} filter={''} />;
      case 'activity':
        return <TargetActivity height={700} activity={session.activity} />;
      case 'store':
        return <Directory key={session.target.key} root={session.target.directory} />;
      case 'relation':
        return (
          <DirectoryViewer
            extraTags
            initTags={['成员']}
            selectFiles={[]}
            content={session.target.memberDirectory.content()}
            fileOpen={() => {}}
            contextMenu={(entity) => {
              const file = (entity as IFile) || session.target.memberDirectory;
              return {
                items: cleanMenus(loadFileMenus(file)) || [],
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
      case 'relation':
        return '关系';
      default:
        return '设置';
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
