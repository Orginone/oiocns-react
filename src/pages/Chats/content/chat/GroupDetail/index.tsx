import { Button, Col, Image, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import detailStyle from './index.module.less';
import { ISession } from '@/ts/core';
import ChatHistoryModal from '../ChatHistoryModal';
import { AiOutlineRight } from '@/icons/ai';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { ellipsisText } from '@/utils';
import GroupMember from '@/pages/Chats/content/chat/GroupMember';

import Activity from '@/components/Activity';
import { command } from '@/ts/base';
const GroupDetail: React.FC<any> = ({ chat }: { chat: ISession }) => {
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
        <h4 className={detailStyle.title}>
          {chat.chatdata.chatName}
          {chat.members.length > 0 ? (
            <span className={detailStyle.number}>({chat.members.length})</span>
          ) : (
            ''
          )}
        </h4>
      </Col>
    </Row>
  );

  const header = (
    <div className={detailStyle.header}>
      <TeamIcon typeName={chat.typeName} entityId={chat.id} size={50} />
      <div className={detailStyle.headerMeta}>
        <Typography.Text strong>
          {chat.chatdata.chatName}
          {chat.members.length > 0 ? (
            <span className={detailStyle.number}> ({chat.members.length})</span>
          ) : (
            ''
          )}
        </Typography.Text>
        <div className={detailStyle.headerMetaInfo}>
          <div className={detailStyle.headerMetaInfoText}>
            {ellipsisText(chat.chatdata.chatRemark, 9)}
            <Image
              style={{ marginLeft: '8px' }}
              preview={false}
              height={12}
              width={6}
              src={`/svg/right-arrow.svg`}></Image>
          </div>
          <Image
            className={detailStyle.headerMetaInfoIcon}
            preview={false}
            height={18}
            width={18}
            onClick={() => {
              command.emitter('data', 'qrcode', chat);
            }}
            src={`/svg/qrcode.svg`}
          />
        </div>
      </div>
    </div>
  );

  /**
   * @description: 操作按钮
   * @return {*}
   */
  const operaButton = (
    <>
      {chat.isGroup && (
        <div className={`${detailStyle.find_history}`}>
          <Button
            className={`${detailStyle.find_history_button}`}
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
      <div className={`${detailStyle.find_history}`}>
        <Button
          className={`${detailStyle.find_history_button}`}
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
      <div className={detailStyle.groupDetail}>
        {header}
        {chat.members.length ? <GroupMember members={chat.members}></GroupMember> : <></>}
        <div className={detailStyle.groupDetailContent}>
          <Activity activity={chat.activity}></Activity>
          <div className={detailStyle.user_list}>
            <div className={`${detailStyle.img_list} ${detailStyle.con}`}></div>
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
export default GroupDetail;
