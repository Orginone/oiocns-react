import { Button, Col, List, Modal, Row } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import css from './index.module.less';
import { ISession } from '@/ts/core';
import ChatHistoryModal from '../../../../pages/Chats/content/chat/ChatHistoryModal';
import { AiOutlineRight } from '@/icons/ai';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { ellipsisText } from '@/utils';
import { command } from '@/ts/base';
import Activity from '@/components/Activity';
import MemberContent from './member';
import { ImQrcode } from '@react-icons/all-files/im/ImQrcode';
const SessionBody = ({ chat }: { chat: ISession }) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false); // 历史消息搜索
  const history = useHistory();
  /**
   * @description: 历史消息搜索弹窗
   * @return {*}
   */
  const onHistoryCancel = () => {
    setHistoryOpen(false);
  };

  /**
   * @description: 历史记录头像
   * @return {*}
   */
  const historyheard = (
    <Row style={{ paddingBottom: '12px' }}>
      <Col>
        <div style={{ color: '#888', width: 42 }}>
          <TeamIcon typeName={chat.typeName} entityId={chat.id} size={32} />
        </div>
      </Col>
      <Col>
        <h4 className={css.title}>
          {chat.chatdata.chatName}
          {chat.members.length > 0 ? (
            <span className={css.number}>({chat.members.length})</span>
          ) : (
            ''
          )}
        </h4>
      </Col>
    </Row>
  );

  /**
   * @description: 操作按钮
   * @return {*}
   */
  const operaButton = (
    <>
      {chat.isGroup && (
        <div className={`${css.find_history}`}>
          <Button
            className={`${css.find_history_button}`}
            type="ghost"
            onClick={async () => {
              await chat.target.directory.loadContent();
              orgCtrl.currentKey = chat.target.directory.key;
              history.push('/store');
            }}>
            共享目录 <AiOutlineRight />
          </Button>
        </div>
      )}
      <div className={`${css.find_history}`}>
        <Button
          className={`${css.find_history_button}`}
          type="ghost"
          onClick={() => {
            setHistoryOpen(true);
          }}>
          查找聊天记录 <AiOutlineRight />
        </Button>
      </div>
      {chat.canDeleteMessage && (
        <Button
          block
          onClick={() =>
            Modal.confirm({
              title: '确认清除当前会话聊天记录？',
              onOk: () => {
                chat.clearMessage();
              },
            })
          }>
          清除聊天记录
        </Button>
      )}
    </>
  );

  return (
    <>
      <div className={css.groupDetail}>
        <List.Item
          className={css.header}
          actions={[
            <ImQrcode
              key="qrcode"
              size={40}
              color="#9498df"
              onClick={() => {
                command.emitter('data', 'qrcode', chat);
              }}
            />,
          ]}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>{chat.chatdata.chatName}</span>
                {chat.members.length > 0 && (
                  <span className={css.number}>({chat.members.length}人)</span>
                )}
              </>
            }
            avatar={<TeamIcon typeName={chat.typeName} entityId={chat.id} size={50} />}
            description={ellipsisText(chat.chatdata.chatRemark, 200)}
          />
        </List.Item>
        {chat.members.length > 0 && (
          <div style={{ height: '40vh' }}>
            <MemberContent dircetory={chat.target.memberDirectory} />
          </div>
        )}
        <div className={css.groupDetailContent}>
          <Activity activity={chat.activity}></Activity>
          <div className={css.user_list}>
            <div className={`${css.img_list} ${css.con}`}></div>
            {operaButton}
          </div>
        </div>
      </div>

      {/* 历史记录搜索弹窗 */}
      <ChatHistoryModal
        open={historyOpen}
        title={historyheard}
        onCancel={onHistoryCancel}
        chat={chat}
      />
    </>
  );
};
export default SessionBody;
