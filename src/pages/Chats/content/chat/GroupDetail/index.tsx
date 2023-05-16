import { Col, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import detailStyle from './index.module.less';
import { parseAvatar, schema } from '@/ts/base';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { getUuid } from '@/utils/tools';
import { ICohort, IMsgChat, TargetType } from '@/ts/core';
import ChatHistoryModal from '../ChatHistoryModal';
import { AiOutlineRight } from 'react-icons/ai';
import orgCtrl from '@/ts/controller';

const Groupdetail: React.FC<any> = ({
  chat,
  filter,
}: {
  chat: IMsgChat;
  filter: string;
}) => {
  const [open, setOpen] = useState<boolean>(false); // 邀请弹窗开关
  const [removeOpen, setRemoveOpen] = useState<boolean>(false); // 移出弹窗开关
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>([]); // 需要邀请的部门成员
  const [historyOpen, setHistoryOpen] = useState<boolean>(false); // 历史消息搜索

  /**
   * @description: 邀请确认
   * @return {*}
   */
  const onOk = async () => {
    if (selectPerson && selectPerson.length > 0) {
      await (chat as ICohort).pullMembers(selectPerson);
    }
    setOpen(false);
  };
  /**
   * @description: 移除确认
   * @return {*}
   */
  const onRemoveOk = async () => {
    setRemoveOpen(false);
    if (selectPerson && selectPerson.length > 0) {
      await (chat as ICohort).removeMembers(selectPerson);
    }
  };

  /**
   * @description: 取消
   * @return {*}
   */
  const onCancel = () => {
    setOpen(false);
    setRemoveOpen(false);
  };

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
          <TeamIcon share={chat.share} size={32} fontSize={28} />
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
          <TeamIcon share={chat.share} size={32} fontSize={28} />
        </div>
      </Col>
      <Col>
        <h4 className={detailStyle.title}>
          {/* {chat.target.name}
          {chat.target.typeName !== '人员' ? (
            <span className={detailStyle.number}>({chat.personCount})</span>
          ) : (
            ''
          )} */}
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
            <TeamIcon
              size={36}
              preview
              share={{
                name: item.name,
                typeName: item.typeName,
                avatar: parseAvatar(item.icon),
              }}
              fontSize={32}
            />
            <Typography className={detailStyle.img_list_con_name}>{item.name}</Typography>
          </div>
        );
      })}
      {chat.share.typeName === TargetType.Cohort ? (
        <>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setOpen(true);
            }}>
            +
          </div>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setRemoveOpen(true);
            }}>
            -
          </div>
        </>
      ) : (
        ''
      )}
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
          <div
            className={`${detailStyle.find_history}`}
            onClick={() => {
              setHistoryOpen(true);
            }}>
            查找聊天记录
            <AiOutlineRight />
          </div>
        </div>
      </div>
      {/* 历史记录搜索弹窗 */}
      <ChatHistoryModal
        open={historyOpen}
        title={historyheard}
        onCancel={onHistoryCancel}
        chat={chat}
        filter={filter}
      />
      <Modal
        title={'邀请成员'}
        destroyOnClose
        open={open}
        width={1024}
        onOk={onOk}
        onCancel={onCancel}>
        <AssignPosts members={orgCtrl.user.members} searchFn={setSelectPerson} />
      </Modal>
      <Modal
        title={'移出成员'}
        destroyOnClose
        open={removeOpen}
        width={1024}
        onCancel={onCancel}
        onOk={onRemoveOk}>
        <AssignPosts searchFn={setSelectPerson} members={chat.members} />
      </Modal>
    </>
  );
};
export default Groupdetail;
