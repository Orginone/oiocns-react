import { Button, Col, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import detailStyle from './index.module.less';
import { getUuid } from '@/utils/tools';
import { IMsgChat, TargetType } from '@/ts/core';
import ChatHistoryModal from '../ChatHistoryModal';
import { AiOutlineRight } from 'react-icons/ai';
import { command } from '@/ts/base';

const Groupdetail: React.FC<any> = ({ chat }: { chat: IMsgChat }) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false); // 历史消息搜索

  /**
   * @description: 历史消息搜索弹窗
   * @return {*}
   */
  const onHistoryCancel = () => {
    setHistoryOpen(false);
  };

  /**
   * @description: 头像
   * @return {*}
   */
  const heads = (
    <Row style={{ paddingBottom: '12px' }}>
      <Col span={4}>
        <div style={{ color: '#888', width: 42 }}>
          <TeamIcon typeName={chat.typeName} entityId={chat.id} size={32} />
        </div>
      </Col>
      <Col span={20}>
        <h4 className={detailStyle.title}>
          {chat.chatdata.chatName}
          {chat.members.length > 0 ? (
            <span className={detailStyle.number}>({chat.members.length})</span>
          ) : (
            ''
          )}
        </h4>
        <div className={detailStyle.base_info_desc}>{chat.chatdata.chatRemark}</div>
      </Col>
    </Row>
  );

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

  /**
   * @description: 群组成员
   * @return {*}
   */
  const grouppeoples = (
    <>
      {chat.members.map((item) => {
        return (
          <div key={getUuid()} title={item.name} className={detailStyle.show_persons}>
            <TeamIcon size={36} typeName={item.typeName} entityId={item.id} />
            <Typography className={detailStyle.img_list_con_name}>{item.name}</Typography>
          </div>
        );
      })}
      {chat.share.typeName === TargetType.Cohort ? (
        <>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              command.emitter('config', 'pull', chat);
            }}>
            +
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );

  /**
   * @description: 操作按钮
   * @return {*}
   */
  const operaButton = (
    <>
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
    </>
  );

  return (
    <>
      <div className={detailStyle.group_detail_wrap}>
        {heads}
        <div className={detailStyle.user_list}>
          <div className={`${detailStyle.img_list} ${detailStyle.con}`}>
            {grouppeoples}
          </div>
          {operaButton}
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
export default Groupdetail;
