import * as im from 'react-icons/im';
import { Divider, Popover, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { IMessage, ISession, ISysFileInfo, MessageType } from '@/ts/core';
import './index.less';
import OpenFileDialog from '@/components/OpenFileDialog';
import { parseCiteMsg } from '../components/parseMsg';
import Emoji from '../components/emoji';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { TbSend } from 'react-icons/tb';
import { TextArea } from 'devextreme-react';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import dxTextArea from 'devextreme/ui/text_area';
import { XTarget } from '@/ts/base/schema';

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
  const [message, setMessage] = useState<string>('');
  const [mentions, setMentions] = useState<{ text: string; id: string }[]>([]);
  // const [citeFilter, setCiteFilter] = useState<string>('');
  const [chatMems, setChatMens] = useState<XTarget[]>();
  // 禁止回车默认事件
  dxTextArea.defaultOptions({
    options: {
      defaultPrevented: true,
    },
  });
  useEffect(() => {
    if (props.writeContent) {
      setMessage(props.writeContent);
    }
  }, [props.writeContent]);

  useEffect(() => {
    let otherMems = props.chat.members.filter((i) => i.id != props.chat.userId);
    const citeSplit = message.split('@');
    const filterVal = citeSplit.length ? citeSplit[citeSplit.length - 1] : '';
    if (citeShow && filterVal) {
      const filterMens = otherMems.filter((i) => i.name.includes(filterVal));
      setChatMens(filterMens);
    } else {
      setChatMens(otherMems);
    }
  }, [citeShow, message]);

  /** 发送消息 */
  const sendMessage = () => {
    if (message.length > 0) {
      const vaildMentions: string[] = [];
      for (const mention of mentions) {
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
        <div className="cite-text-content">{parseCiteMsg(val)}</div>
        <AiOutlineCloseCircle
          size={20}
          onClick={() => props.closeCite()}
          className="cite-text-close-icon"
        />
      </div>
    );
  };

  /** 点击空白处取消 @ 弹窗 */
  window.addEventListener('click', () => {
    setCiteShow(false);
  });
  return (
    <div className="send-box flexColumn">
      {props.citeText && citeShowText(props.citeText)}
      <div className="flex" style={{ width: '100%' }}>
        {citeShow && !!chatMems?.length && (
          <Popover
            align={{
              points: ['t', 'l'],
            }}
            style={{ display: 'inline-block', width: '100%' }}
            content={
              <div className="at-list">
                {chatMems.map((i) => {
                  return (
                    <div
                      key={i.id}
                      className="at-list-item"
                      onClick={() => {
                        setMentions((before) => [
                          ...before,
                          {
                            id: i.id,
                            text: `@${i.name} `,
                          },
                        ]);
                        setMessage((message) => message + i.name + ' ');
                        setCiteShow(false);
                      }}>
                      <EntityIcon entity={i} showName size={30} />
                    </div>
                  );
                })}
              </div>
            }
            open={citeShow}
            trigger={['contextMenu']}
            onOpenChange={setCiteShow}></Popover>
        )}
        <TextArea
          value={message}
          width={'100%'}
          maxHeight={200}
          showClearButton
          autoResizeEnabled
          stylingMode="underlined"
          valueChangeEvent="input"
          style={{ fontSize: 16 }}
          placeholder={`发送到${props.chat.name}`}
          onKeyDown={({ event }) => {
            const altKey = event?.ctrlKey || event?.metaKey;
            if (altKey && event?.keyCode === 13) {
              setMessage(message + '\n');
              return;
            }
            if (event?.keyCode === 13) event?.preventDefault();
          }}
          onEnterKey={() => {
            sendMessage();
          }}
          onValueChanged={(e) => {
            const value: string = e.value ?? '';
            if (value.includes('@')) {
              setCiteShow(true);
            } else {
              setCiteShow(false);
            }
            setMessage(value);
          }}
        />
        <Space split={<Divider type="vertical" style={{ height: 20 }} />} size={0}>
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
              size={20}
              color={'#3838b9'}
              onClick={() => setOpenEmoji(!openEmoji)}
            />
          </Popover>
          <im.ImMic title="语言" size={20} color={'#3838b9'} />
          <im.ImFolder
            title="文件"
            size={20}
            color={'#3838b9'}
            onClick={() => setOpen(true)}
          />
          <im.ImVideoCamera title="视频" size={20} color={'#3838b9'} />
          <TbSend
            size={26}
            title="发送"
            color={message.length > 0 ? '#3838b9' : '#909090'}
            onClick={() => sendMessage()}
          />
        </Space>
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
