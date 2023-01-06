import React from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import sideStyle from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import { IChat } from '@/ts/core/chat/ichat';
import { handleFormatDate } from '@/utils/tools';
import { MessageType } from '@/ts/core/enum';

interface IProps {
  current: IChat;
}

const ChatItem: React.FC<IProps> = (props) => {
  const getBarTxt = (c: IChat) => {
    if (c.lastMessage) {
      switch (c.lastMessage.msgType) {
        case MessageType.Image:
          return '[图片]';
        case MessageType.Video:
          return '[视频]';
        case MessageType.Voice:
          return '[语音]';
        default:
          if (c.lastMessage.showTxt?.includes('<img>')) {
            return '[图片]';
          }
          return c.lastMessage.showTxt;
      }
    }
    return '';
  };
  return (
    <div
      key={props.current.fullId}
      className={`${sideStyle.con_body_session} ${
        chatCtrl.isCurrent(props.current) ? sideStyle.active : ''
      } ${props.current.isToping ? sideStyle.session_toping : ''}`}
      // onContextMenu={(e: any) => handleContextClick(e, props.current)}
    >
      <div style={{ fontSize: 16, color: '#888', width: 30 }}>
        <TeamIcon share={props.current.shareInfo} size={16} fontSize={16} />
      </div>
      {props.current.noReadCount > 0 ? (
        <div className={`${sideStyle.group_con} ${sideStyle.dot}`}>
          <span>{props.current.noReadCount}</span>
        </div>
      ) : (
        ''
      )}
      <div
        className={sideStyle.group_con_show}
        onClick={() => {
          chatCtrl.setCurrent(props.current);
        }}>
        <div className={`${sideStyle.group_con_show} ${sideStyle.name}`}>
          <div
            className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.label}`}>
            {props.current.target.name}
          </div>
          <div
            className={`${sideStyle.group_con_show} ${sideStyle.name} ${sideStyle.time}`}>
            {handleFormatDate(
              props.current.lastMessage?.createTime || props.current.target.msgTime,
            )}
          </div>
        </div>
        <div className={`${sideStyle.group_con_show} ${sideStyle.msg}`}>
          {getBarTxt(props.current)}
        </div>
      </div>
    </div>
  );
};
export default ChatItem;
