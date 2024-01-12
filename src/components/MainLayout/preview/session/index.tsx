import React, { useEffect, useState } from 'react';
import { IFile, ISession, ITarget, TargetType } from '@/ts/core';
import { command } from '@/ts/base';
import Directory from '@/components/Directory';
import DirectoryViewer from '@/components/Directory/views';
import TargetActivity from '@/components/TargetActivity';
import { loadFileMenus } from '@/executor/fileOperate';
import ChatBody from './chat';
import PreviewLayout from '../layout';
import { cleanMenus } from '@/utils/tools';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
const SessionBody = ({
  session,
  relation,
}: {
  session: ISession;
  relation?: boolean;
}) => {
  const [actions, setActions] = useState<{ key: string; label: string }[]>([]);
  const [bodyType, setBodyType] = useState('');

  useEffect(() => {
    const newActions = [
      {
        key: 'activity',
        label: '动态',
      },
    ];
    if (session.id === session.target.id) {
      newActions.push({
        key: 'store',
        label: '数据',
      });
      if (
        session.target.hasRelationAuth() ||
        session.target.typeName !== TargetType.Storage
      ) {
        newActions.push({
          key: 'relation',
          label: '关系',
        });
        if (relation) {
          setBodyType('relation');
        }
      }
    }
    if (session.isMyChat && session.target.typeName !== TargetType.Group) {
      if (
        session.target.typeName !== TargetType.Storage ||
        session.target.hasRelationAuth()
      ) {
        newActions.unshift({
          key: 'chat',
          label: '沟通',
        });
        if (relation !== true) {
          setBodyType('chat');
        }
      }
    }
    if (session.target.hasRelationAuth()) {
      newActions.push({
        key: 'setting',
        label: '设置',
      });
    }
    setBodyType((pre) => (pre === '' ? 'activity' : pre));
    setActions(newActions);
  }, [session]);

  const RenderMemberDirectory: React.FC<{ target: ITarget }> = ({ target }) => {
    const [key] = useCtrlUpdate(target);
    return (
      <DirectoryViewer
        key={key}
        extraTags={false}
        currentTag={'成员'}
        initTags={['成员']}
        selectFiles={[]}
        content={target.memberDirectory.content()}
        fileOpen={() => {}}
        contextMenu={(entity) => {
          const file = (entity as IFile) || target.memberDirectory;
          return {
            items: cleanMenus(loadFileMenus(file)) || [],
            onClick: ({ key }: { key: string }) => {
              command.emitter('executor', key, file);
            },
          };
        }}
      />
    );
  };

  const loadContext = () => {
    switch (bodyType) {
      case 'chat':
        return <ChatBody key={session.target.key} chat={session} filter={''} />;
      case 'activity':
        return <TargetActivity height={760} activity={session.activity} />;
      case 'store':
        return <Directory key={session.target.key} root={session.target.directory} />;
      case 'relation':
        return <RenderMemberDirectory target={session.target} />;
      default:
        return <></>;
    }
  };

  return (
    <PreviewLayout
      entity={session}
      actions={actions}
      selectKey={bodyType}
      onActionChanged={(key: string) => {
        setBodyType(key);
      }}
      number={session.members.length}>
      {loadContext()}
    </PreviewLayout>
  );
};
export default SessionBody;
