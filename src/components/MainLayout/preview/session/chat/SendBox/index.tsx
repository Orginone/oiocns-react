import * as im from 'react-icons/im';
import { Popover, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { IMessage, ISession, ISysFileInfo, MessageType } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { parseCiteMsg } from '../components/parseMsg';
import Emoji from '../components/emoji';
import { AiOutlineClose } from 'react-icons/ai';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Theme } from '@/config/theme';
const TextArea = Input.TextArea;
/**
 * @description: 输入区域
 * @return {*}
 */

interface IProps {
  chat: ISession;
  citeText?: IMessage;
  writeContent?: string;
  closeCite: () => void;
}

const GroupInputBox = (props: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [citeShow, setCiteShow] = useState<boolean>(false); // @展示
  const [message, setMessage] = useState(props.chat.inputContent.message);

  useEffect(() => {
    if (props.writeContent) {
      setMessage(props.writeContent);
    }
  }, [props.writeContent]);

  useEffect(() => {
    props.chat.inputContent.message = message;
  }, [message]);

  /** 发送消息 */
  const sendMessage = () => {
    if (message.length > 0) {
      const vaildMentions: string[] = [];
      for (const mention of props.chat.inputContent.mentions) {
        if (message.includes(mention.text) && !vaildMentions.includes(mention.id)) {
          vaildMentions.push(mention.id);
        }
      }
      props.chat.sendMessage(MessageType.Text, message, vaildMentions, props.citeText);
      setMessage('');
      props.closeCite();
    }
  };

  /** 引用展示 */
  const citeShowText = (val: IMessage) => {
    return (
      <div className="cite-text">
        <div className="cite-text-content">
          <AiOutlineClose
            size={20}
            style={{ marginRight: '6px' }}
            onClick={() => props.closeCite()}
            className="cite-text-close-icon"
          />
          {parseCiteMsg(val)}
        </div>
      </div>
    );
  };

  /** 点击空白处取消 @ 弹窗 */
  window.addEventListener('click', () => {
    setCiteShow(false);
  });

  return (
    <div className="chat-send-box">
      <div style={{ width: '100%' }}>
        {props.citeText && citeShowText(props.citeText)}
      </div>
      <div className="chat-send-box-main">
        <div style={{ width: '100%' }}>
          {citeShow && (
            <Popover
              align={{
                points: ['t', 'l'],
              }}
              content={
                <div className="chat-at-list">
                  {props.chat.members
                    .filter((i) => i.id != props.chat.userId)
                    .map((i) => {
                      return (
                        <div
                          key={i.id}
                          className="chat-at-list-item"
                          onClick={() => {
                            props.chat.inputContent.mentions.push({
                              id: i.id,
                              text: `@${i.name} `,
                            });
                            setMessage((message) => message + i.name + ' ');
                          }}>
                          <EntityIcon disInfo entity={i} size={35} />
                          <span>{i.name}</span>
                        </div>
                      );
                    })}
                </div>
              }
              open={citeShow}
              trigger={['click', 'contextMenu']}
              onOpenChange={setCiteShow}></Popover>
          )}
          <TextArea
            value={message}
            autoSize={{ minRows: 1 }}
            allowClear={true}
            placeholder={`Enter键发送, Alt+Enter键换行。`}
            bordered={false}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.endsWith('\n')) {
                if (value.endsWith('@')) {
                  setMessage(value);
                  setCiteShow(true);
                } else {
                  setMessage(value);
                }
              } else {
                setMessage(value);
              }
            }}
            onPressEnter={(e) => {
              if (e.altKey === true && e.key === 'Enter') {
                setMessage((pre) => pre + '\n');
              } else {
                sendMessage();
              }
            }}
          />
        </div>
        <Popover
          content={
            <Emoji
              onSelect={(emoji: string) => {
                setOpenEmoji(false);
                setMessage((message) => message + emoji);
              }}
            />
          }
          open={openEmoji}
          trigger={['click', 'contextMenu']}
          onOpenChange={setOpenEmoji}>
          <im.ImSmile
            size={26}
            color={Theme.FocusColor}
            onClick={() => setOpenEmoji(!openEmoji)}
          />
        </Popover>
        <im.ImMic title="语言" size={26} color={Theme.FocusColor} />
        <im.ImFolder
          title="文件"
          size={26}
          color={Theme.FocusColor}
          onClick={() => setOpen(true)}
        />
        <im.ImVideoCamera title="视频" size={26} color={Theme.FocusColor} />
        <im.ImRocket
          size={26}
          title="发送"
          color={message.length > 0 ? Theme.FocusColor : '#909090'}
          onClick={() => sendMessage()}
        />
      </div>
      {open && (
        <OpenFileDialog
          rootKey={'disk'}
          accepts={['文件']}
          allowInherited
          currentKey={props.chat.target.directory.key}
          onCancel={() => setOpen(false)}
          onOk={async (files) => {
            if (files.length > 0) {
              const file = files[0] as ISysFileInfo;
              let msgType = MessageType.File;
              if (file.groupTags.includes('图片')) {
                msgType = MessageType.Image;
              } else if (file.groupTags.includes('视频')) {
                msgType = MessageType.Video;
              }
              await props.chat.sendMessage(msgType, JSON.stringify(file.shareInfo()), []);
            }
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupInputBox;
