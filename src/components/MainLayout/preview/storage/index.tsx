import { List } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { IStorage } from '@/ts/core';
import { ellipsisText } from '@/utils';
import { command } from '@/ts/base';
import MemberContent from './member';
import { ImAddressBook, ImQrcode } from '@/icons/im';
const StorageBody = ({ storage }: { storage: IStorage }) => {
  const [bodyType, setBodyType] = useState('member');
  const sessionActions = () => {
    return [
      <ImAddressBook
        key="setting"
        size={26}
        title="成员"
        onClick={() => {
          setBodyType('member');
        }}
      />,
      <ImQrcode
        key="qrcode"
        size={26}
        title="二维码"
        onClick={() => {
          command.emitter('executor', 'qrcode', storage);
        }}
      />,
    ];
  };

  const loadContext = () => {
    switch (bodyType) {
      case 'member':
        return <MemberContent dircetory={storage.memberDirectory} />;
    }
  };

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item className={css.header} actions={sessionActions()}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>{storage.name}</span>
                <span className={css.number}>({storage.members.length})</span>
              </>
            }
            avatar={<TeamIcon entity={storage.metadata} size={50} />}
            description={ellipsisText(storage.remark, 50)}
          />
        </List.Item>
        <div className={css.groupDetailContent}>{loadContext()}</div>
      </div>
    </>
  );
};
export default StorageBody;
