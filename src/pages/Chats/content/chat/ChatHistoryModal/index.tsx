import React, { useEffect, useState, useRef } from 'react';
import { Modal, Spin, Empty } from 'antd';
import { animateScroll } from 'react-scroll';
import SearchInput from '@/components/SearchInput';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMsgChat, TargetType } from '@/ts/core';
import { showChatTime } from '@/utils/tools';
import { parseMsg } from '@/pages/Chats/components/parseMsg';
import ChatHistoryStyle from './index.module.less';

interface Iprops {
  open: boolean;
  title?: JSX.Element;
  onCancel: () => void;
  chat: IMsgChat;
}

const ChatHistoryModal: React.FC<Iprops> = ({ open, title, onCancel, chat }) => {
  const [messages, setMessages] = useState(chat.messages);
  const [loading, setLoading] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  // 获取所有的聊天历史消息
  useEffect(() => {
    getAllHistoryMessage();
  }, []);
  const getAllHistoryMessage = async () => {
    if ((await chat.moreMessage()) > 0) {
      getAllHistoryMessage();
    }
  };

  /**
   * @description: 历史消息默认滚动
   * @return {*}
   */
  const scrollDown = () => {
    animateScroll.scrollToBottom({
      containerId: 'scroll-container', // 这个是组件的容器 ID
      duration: 0, // 去掉滚动动画
    });
  };

  // 在组件渲染时调用
  useEffect(() => {
    scrollDown();
  }, [open]);

  // 滚动事件
  const onScroll = async () => {
    if (!loading && body.current && chat && body.current.scrollTop === 0) {
      setLoading(true);
      if ((await chat.moreMessage()) < 1) {
        setLoading(false);
      }
    }
  };

  /**
   * @description: 搜索事件
   * @return {*}
   */
  const searchChange = (filter: string) => {
    setMessages(chat.messages.filter((i) => i.msgBody.includes(filter)));
  };

  /**
   * @description: 消息搜索
   * @return {*}
   */
  const msgSearch = (
    <div className={`${ChatHistoryStyle.search}`}>
      <SearchInput
        onChange={(e) => {
          searchChange(e.target.value);
        }}
      />
    </div>
  );

  /**
   * @description: 消息主体
   * @return {*}
   */
  const msgHistoryContent = (
    <div
      className={`${ChatHistoryStyle.scroll_height}`}
      id="scroll-container"
      ref={body}
      onScroll={onScroll}>
      {messages.map((item, index) => {
        return (
          <div key={item.metadata.fromId + index}>
            <div className={`${ChatHistoryStyle.own_all}`}>
              <TeamIcon
                typeName={TargetType.Person}
                entityId={item.metadata.fromId}
                preview
                size={36}
              />
              <div className={`${ChatHistoryStyle.own_item}`}>
                <div className={`${ChatHistoryStyle.own_name}`}>
                  <div>{item.from.name}</div>
                  <div>{showChatTime(item.createTime)}</div>
                </div>
                <div className={`${ChatHistoryStyle.own_content}`}>{parseMsg(item)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`${ChatHistoryStyle.history}`}>
      <Modal
        title={title}
        open={open}
        footer={null}
        onCancel={onCancel}
        getContainer={false}>
        {msgSearch}
        {messages.length > 0 ? (
          <Spin tip="加载中..." spinning={loading}>
            {msgHistoryContent}
          </Spin>
        ) : (
          <Empty
            description="暂无历史消息"
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ChatHistoryModal;
