import { Button, Col, Image, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import detailStyle from './index.module.less';
import { IMsgChat, ITarget } from '@/ts/core';
import ChatHistoryModal from '../ChatHistoryModal';
import { AiOutlineRight } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { ellipsisText } from '@/utils';
import GroupMember from '@/pages/Chats/content/chat/GroupMember';
// @ts-ignore
import { ReactComponent as PublishSvg } from '@/assets/svg/publish.svg';

import Icon from '@ant-design/icons';
import ActivityPublisher from '@/components/Activity/ActivityPublisher';
import ActivityList from '@/components/Activity/ActivityList';
const GroupDetail: React.FC<any> = ({ chat }: { chat: IMsgChat }) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false); // 历史消息搜索
  const [activityPublisherOpen, setActivityPublisherOpen] = useState(false);
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
      <div className={`${detailStyle.find_history}`}>
        <Button
          className={`${detailStyle.find_history_button}`}
          type="ghost"
          onClick={async () => {
            if ('directory' in chat) {
              await (chat as ITarget).directory.loadContent();
              orgCtrl.currentKey = chat.key;
              history.push('/store');
            }
          }}>
          共享目录 <AiOutlineRight />
        </Button>
      </div>
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

  const actionList = [
    {
      icon: <Icon color="red" component={PublishSvg} />,
      title: '发布动态',
      type: 'primary',
    },
    {
      icon: <Icon component={PublishSvg} />,
      title: '共享',
      type: 'primary',
    },
    {
      title: '交易',
      icon: <Icon component={PublishSvg} />,
      type: 'primary',
    },
  ];
  return (
    <>
      <div className={detailStyle.groupDetail}>
        {header}
        <GroupMember members={chat.members}></GroupMember>
        <div className={detailStyle.groupDetailContent}>
          {'resource' in chat && (
            <ActivityList coll={(chat as ITarget).resource.activityColl}></ActivityList>
          )}
          <div className={detailStyle.user_list}>
            <div className={`${detailStyle.img_list} ${detailStyle.con}`}></div>
            {operaButton}
          </div>
        </div>

        <div className={detailStyle.groupDetailActionArea}>
          {actionList.map((item, index) => {
            return (
              <div
                className={detailStyle.groupDetailActionAreaItem}
                key={index}
                onClick={() => {
                  setActivityPublisherOpen(true);
                }}>
                <div
                  className={
                    detailStyle.groupDetailActionAreaItem__icon +
                    (item.type === 'primary'
                      ? ' ' + detailStyle.groupDetailActionAreaItem__iconActive
                      : '')
                  }>
                  {item.icon}
                </div>
                <div>{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 历史记录搜索弹窗 */}
      <ChatHistoryModal
        open={historyOpen}
        title={historyheard}
        onCancel={onHistoryCancel}
        chat={chat}
      />
      {'resource' in chat && (
        <ActivityPublisher
          open={activityPublisherOpen}
          target={chat as ITarget}
          finish={() => {
            setActivityPublisherOpen(false);
          }}></ActivityPublisher>
      )}
    </>
  );
};
export default GroupDetail;
