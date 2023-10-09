import { List, Modal } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { ISession } from '@/ts/core';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { ellipsisText } from '@/utils';
import { command } from '@/ts/base';
import Activity from '@/components/Activity';
import MemberContent from './member';
import { ImQrcode } from '@react-icons/all-files/im/ImQrcode';
import { ImFolder } from '@react-icons/all-files/im/ImFolder';
import { ImAddressBook, ImBin } from '@/icons/im';
const SessionBody = ({ chat }: { chat: ISession }) => {
  const [memberShow, setMemberShow] = useState(false);
  const history = useHistory();
  const sessionActions = () => {
    const actions = [
      <ImQrcode
        key="qrcode"
        size={26}
        title="二维码"
        onClick={() => {
          command.emitter('executor', 'qrcode', chat);
        }}
      />,
    ];
    if (chat.members.length > 0) {
      actions.push(
        <ImAddressBook
          key="setting"
          size={26}
          title="成员"
          onClick={() => {
            setMemberShow(!memberShow);
          }}
        />,
      );
    }
    if (chat.sessionId === chat.target.id) {
      actions.push(
        <ImFolder
          key="share"
          size={26}
          title="存储"
          onClick={() => {
            orgCtrl.currentKey = chat.target.directory.key;
            history.push('/store');
          }}
        />,
      );
    }
    if (chat.canDeleteMessage) {
      actions.push(
        <ImBin
          key="clean"
          size={26}
          title="清空消息"
          onClick={() => {
            const confirm = Modal.confirm({
              okText: '确认',
              cancelText: '取消',
              title: '清空询问框',
              content: (
                <div style={{ fontSize: 16 }}>
                  确认要清空{chat.chatdata.chatName}的所有消息吗?
                </div>
              ),
              onCancel: () => {
                confirm.destroy();
              },
              onOk: () => {
                confirm.destroy();
                chat.clearMessage().then((ok) => {
                  if (ok) {
                    chat.changCallback();
                  }
                });
              },
            });
          }}
        />,
      );
    }
    return actions;
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
                  <span className={css.number}>({chat.members.length}人)</span>
                )}
              </>
            }
            avatar={<TeamIcon entity={chat.metadata} size={50} />}
            description={ellipsisText(chat.chatdata.chatRemark, 200)}
          />
        </List.Item>
        {memberShow && chat.members.length > 0 && (
          <div className={css.member_content}>
            <MemberContent dircetory={chat.target.memberDirectory} />
          </div>
        )}
        <div className={css.groupDetailContent}>
          <Activity height={680} activity={chat.activity}></Activity>
        </div>
      </div>
    </>
  );
};
export default SessionBody;
