import * as im from '@/icons/im';
import { Button, message, Popover } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { IMessage, ISession, ISysFileInfo, MessageType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import PullDown from '../components/pullDown';
import Cutting from '../components/cutting';
import './index.less';
import OpenFileDialog from '@/components/OpenFileDialog';
import { parseCiteMsg } from '../components/parseMsg';
import Emoji from '../components/emoji';

/**
 * @description: 输入区域
 * @return {*}
 */

interface IProps {
  chat: ISession;
  writeContent: any;
  citeText: IMessage | undefined;
  closeCite: any;
  /** 回车传递引用消息 */
  enterCiteMsg: any;
}

const GroupInputBox = (props: IProps) => {
  const { writeContent, citeText, enterCiteMsg, closeCite } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [IsCut, setIsCut] = useState<boolean>(false); // 是否截屏
  const [citeShow, setCiteShow] = useState<boolean>(false); // @展示

  /** 引用展示 */
  const citeShowText = (val: IMessage) => {
    return (
      <div className="cite-text">
        <div className="cite-text__content">{parseCiteMsg(val)}</div>
        <CloseCircleFilled
          onClick={() => closeCite('')}
          className="cite-text__close-icon"
        />
      </div>
    );
  };

  /** 艾特触发人员选择 */
  const onSelect = (e: any) => {
    setCiteShow(false);
    const innerHtml = document.getElementById('innerHtml');
    if (innerHtml) {
      const node = document.createElement('at');
      node.id = e.id;
      node.innerText = `${e.name}`;
      innerHtml.append(node);
      node.focus();
    }
  };

  /** 点击空白处取消 @ 弹窗 */
  window.addEventListener('click', () => {
    setCiteShow(false);
  });

  /**
   * @description: 提交聊天内容
   * @return {*}
   */
  const submit = async () => {
    const innerHtml = document.getElementById('innerHtml');
    if (innerHtml != null) {
      const mentions: string[] = [];
      const text: any =
        innerHtml.childNodes.length > 0
          ? reCreatChatContent(innerHtml.childNodes ?? [], mentions)
          : [innerHtml.innerHTML];
      let massage = text.join('').trim();
      if (massage.length > 0) {
        innerHtml.innerHTML = '发送中,请稍后...';
        props.chat.sendMessage(MessageType.Text, massage, mentions, citeText);
      }
      innerHtml.innerHTML = '';
      closeCite('');
    }
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
   * @param mentions
   * @return {*}
   */
  const reCreatChatContent = (
    elementChild: NodeList | any[],
    mentions: string[],
  ): Array<string> => {
    // 判断聊天格式
    const arrElement = Array.from(elementChild);
    if (arrElement.length > 0) {
      return arrElement.map((n) => {
        if (n.nodeName == 'AT') {
          mentions.push(n.id);
        }
        if (n.nodeName == 'IMG') {
          return `$IMG[${n.src}]`;
        }
        return `${n.textContent}`;
      });
    }
    return [];
  };

  useEffect(() => {
    let doc = document.getElementById('innerHtml');
    if (writeContent !== null && doc) {
      doc.innerHTML = writeContent;
    }
  }, [writeContent]);

  /**
   * @description: 输入框 键盘指令
   * @param {any} e
   * @return {*}
   */
  const keyDown = (e: any) => {
    let doc = document.getElementById('innerHtml');
    if (!doc) return;
    if (e.ctrlKey && e.keyCode == 13) {
      //用户点击了ctrl+enter触发
      const value = doc.innerHTML;
      enterCiteMsg(citeText);
      if (!value?.includes('<div><br></div>')) {
        doc.innerHTML += '<div><br></div>';
      }
    } else if (e.keyCode == 13) {
      //用户点击了enter触发
      e.preventDefault(); // 阻止浏览器默认换行操作
      enterCiteMsg(citeText);
      const value = doc.innerHTML.replaceAll('<div><br></div>', '');
      if (value) {
        submit();
      } else {
        return message.warning('不能发送空值');
      }
    } else if (e.key === '@' && props.chat.members.length > 0) {
      doc.innerHTML += '@';
      setCiteShow(true);
    }
  };
  /** 截屏后放入输入区发出消息 */
  const handleCutImgSelect = async (result: any) => {
    const img = document.createElement('img');
    img.src = result.shareInfo().shareLink;
    img.className = `cutImg`;
    img.style.display = 'block';
    img.style.marginBottom = '10px';
    document.getElementById('innerHtml')?.append(img);
  };

  return (
    <>
      <div className="group-input-box">
        <div className="group-input-box__toolbar">
          <Popover
            content={
              <Emoji
                onSelect={(emoji: string) => {
                  setOpenEmoji(false);
                  document.getElementById('innerHtml')?.append(emoji);
                }}
              />
            }
            open={openEmoji}
            trigger={['click', 'contextMenu']}
            onOpenChange={setOpenEmoji}>
            <div onClick={() => setOpenEmoji(!openEmoji)} style={{ paddingTop: '6px' }}>
              <im.ImSmile size={18} color={'#9498df'} />
            </div>
          </Popover>
          <im.ImMic
            size={18}
            color={'#9498df'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
          <im.ImFolder size={18} color={'#9498df'} onClick={() => setOpen(true)} />
          <im.ImVideoCamera
            size={18}
            color={'#9498df'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
        </div>
        {/* @功能 */}
        <div className="group-input-box__input-area">
          {citeShow && (
            <PullDown
              style={{ display: `${!citeShow ? 'none' : 'block'}` }}
              pullDownRef={(ref: any) => ref && ref.focus()}
              people={props.chat.members
                .filter((i) => i.id != props.chat.userId)
                .map((i) => {
                  return {
                    id: i.id,
                    name: i.name,
                    share: {
                      name: i.name,
                      typeName: i.typeName,
                      avatar: parseAvatar(i.icon),
                    },
                  };
                })}
              open={citeShow}
              onSelect={onSelect}
              onClose={() => setCiteShow(false)}
            />
          )}
          <div
            id="innerHtml"
            autoFocus={true}
            ref={(ref) => ref && !citeShow && ref.focus()}
            className={'textarea'}
            contentEditable="true"
            spellCheck="false"
            placeholder="请输入内容"
            onKeyDown={keyDown}></div>
          {citeText && citeShowText(citeText)}
        </div>
        <div className="group-input-box__action-bar">
          <Button
            type="primary"
            style={{ color: '#fff', border: 'none' }}
            onClick={() => submit()}>
            发送
          </Button>
        </div>
      </div>
      {/* 截图功能 */}
      <Cutting
        open={IsCut}
        onClose={(file: any) => {
          file && handleCutImgSelect(file);
          setIsCut(false);
        }}
      />
      {open && (
        <OpenFileDialog
          rootKey={'disk'}
          accepts={['文件']}
          allowInherited
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
    </>
  );
};

export default GroupInputBox;
