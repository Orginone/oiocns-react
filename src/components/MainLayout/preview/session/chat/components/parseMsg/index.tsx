import React from 'react';
import { Image } from 'antd';
import { MessageType, IMessage } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { command, parseAvatar } from '@/ts/base';
import { formatSize } from '@/ts/base/common';
import { shareOpenLink, truncateString } from '@/utils/tools';
import {
  AiFillFile,
  AiFillFileExcel,
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileText,
  AiFillFileWord,
  AiFillFileZip,
} from 'react-icons/ai';
/** 将链接转化为超链接 */
const linkText = (val: string) => {
  val = val.replace(/(https?:\/\/[^\s]+)/g, '<a target=_blank href="$1">$1</a>');
  return val.replace(/\n/g, '<br/>');
};

/**
 * 文件类型icon展示
 */

export const getFileIcon = (type?: string) => {
  if (!type) return;
  const size = 28;
  const color = 'blue';
  let icon = <AiFillFile size={size} color={color} />;
  switch (type) {
    case '.pdf':
      icon = <AiFillFilePdf size={size} color={color} />;
      break;
    case '.xlsx':
      icon = <AiFillFileExcel size={size} color={color} />;
      break;
    case '.xls':
      icon = <AiFillFileExcel size={size} color={color} />;
      break;
    case '.txt':
      icon = <AiFillFileText size={size} color={color} />;
      break;
    case '.pptx':
      icon = <AiFillFilePpt size={size} color={color} />;
      break;
    case '.docx':
      icon = <AiFillFileWord size={size} color={color} />;
      break;
    case '.doc':
      icon = <AiFillFileWord size={size} color={color} />;
      break;
    case '.zip':
      icon = <AiFillFileZip size={size} color={color} />;
      break;
    default:
      icon = <AiFillFile size={size} color={color} />;
  }
  return icon;
};

/**
 * 显示消息
 * @param item
 */
export const parseMsg = (item: IMessage): any => {
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      if (img && img.shareLink) {
        return (
          <>
            <div
              className="con_content_txt"
              onClick={() => {
                command.emitter('executor', 'open', img);
              }}>
              <Image width={300} src={shareOpenLink(img.shareLink)} preview={false} />
            </div>
          </>
        );
      }
      return <div className="con_content_txt">消息异常</div>;
    }
    case MessageType.Video: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      if (img && img.shareLink) {
        return (
          <>
            <div
              className="con_content_txt"
              onClick={() => {
                command.emitter('executor', 'open', img);
              }}>
              <Image width={300} src={img.thumbnail} preview={false} />
            </div>
          </>
        );
      }
      return <div className="con_content_txt">消息异常</div>;
    }
    case MessageType.File: {
      const file: FileItemShare = parseAvatar(item.msgBody);
      if (!file) {
        return (
          <div className="con_content_txt" style={{ color: '#af1212' }}>
            文件消息异常
          </div>
        );
      }
      const iconDiv = getFileIcon(file.extension);
      return (
        <>
          <div
            className={`con_content_txt con_content_file`}
            onClick={() => {
              command.emitter('executor', 'open', file);
            }}>
            <div className={`con_content_txt_inner`}>
              <div>{file.name}</div>
              <div className={`con_content_size`}>{formatSize(file.size)}</div>
            </div>
            {iconDiv}
          </div>
        </>
      );
    }
    case MessageType.Voice: {
      const bytes = JSON.parse(item.msgBody).bytes;
      const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      return (
        <>
          <div className="voiceStyle">
            <audio src={url} controls />
          </div>
        </>
      );
    }
    default: {
      // 优化截图展示问题
      if (item.msgBody.includes('$IMG')) {
        let str = item.msgBody;
        const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)];
        // 获取消息包含的图片地址
        const imgUrls = matches.map((match) => match[1]);
        // 替换消息里 图片信息特殊字符
        const willReplaceStr = matches.map((match) => match[0]);
        willReplaceStr.forEach((strItem) => {
          str = str.replace(strItem, ' ');
        });
        // 垂直展示截图信息。把文字消息统一放在底部
        return (
          <>
            <div className="con_content_txt">
              {imgUrls.map((url, idx) => (
                <Image className="cut_img" src={url} key={idx} preview={{ src: url }} />
              ))}
              {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
            </div>
          </>
        );
      }
      // 默认文本展示
      return (
        <div className="con_content_txt">
          <div dangerouslySetInnerHTML={{ __html: linkText(item.msgBody) }}></div>
        </div>
      );
    }
  }
};

/**
 * 解析引用消息
 * @param item 消息体
 * @returns 内容
 */
export const parseCiteMsg = (item: IMessage): any => {
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      if (img && img.thumbnail) {
        return (
          <>
            <div className="con_content_cite_txt">
              <span>{item.from.name}:</span>
              <Image
                src={img.thumbnail}
                preview={{ src: shareOpenLink(img.shareLink) }}
              />
            </div>
          </>
        );
      }
      return <div className="con_content_cite_txt">消息异常</div>;
    }
    case MessageType.File: {
      const file: FileItemShare = parseAvatar(item.msgBody);
      const iconDiv = getFileIcon(file.extension);
      return (
        <div className="con_content_cite_txt">
          <span>{item.from.name}:</span>
          <a href={shareOpenLink(file.shareLink, true)} title="点击下载">
            <div>
              <b>{file.name}</b>
            </div>
            <div>{formatSize(file.size)}</div>
            {iconDiv}
          </a>
        </div>
      );
    }
    case MessageType.Voice: {
      const bytes = JSON.parse(item.msgBody).bytes;
      const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      return (
        <div className="con_content_cite_txt">
          <span>{item.from.name}:</span>
          <div className="voiceStyle">
            <audio src={url} controls />
          </div>
        </div>
      );
    }
    default: {
      // 优化截图展示问题
      if (item.msgBody.includes('$IMG')) {
        let str = item.msgBody;
        const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)];
        // 获取消息包含的图片地址
        const imgUrls = matches.map((match) => match[1]);
        // 替换消息里 图片信息特殊字符
        const willReplaceStr = matches.map((match) => match[0]);
        willReplaceStr.forEach((strItem) => {
          str = str.replace(strItem, ' ');
        });
        // 垂直展示截图信息。把文字消息统一放在底部
        return (
          <>
            <div className="con_content_cite_txt">
              <span>{item.from.name}:</span>
              {imgUrls.map((url, idx) => (
                <Image className="cut_img" src={url} key={idx} preview={{ src: url }} />
              ))}
              {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
            </div>
          </>
        );
      }
      // 默认文本展示
      return (
        <div className="con_content_cite_txt">
          <span>{item.from.name}:</span>
          <div
            dangerouslySetInnerHTML={{
              __html: truncateString(linkText(item.msgBody), 80),
            }}></div>
        </div>
      );
    }
  }
};

/**
 * 解析转发消息
 * @param item 消息体
 * @returns 内容
 */
export const parseForwardMsg = (
  item: IMessage[],
  viewForward?: (item: IMessage[]) => void,
) => {
  let formName = Array.from(
    new Set(item.map((msg: IMessage) => msg.from.name).filter((name: string) => name)),
  );
  let showName =
    formName && formName.length > 2
      ? '群聊'
      : `${formName[0]}${formName[1] ? '和' + formName[1] : ''}的`;
  return (
    <div
      className="con_content_forward_txt"
      onClick={() => viewForward && viewForward(item)}>
      <div className="con_content_forward_session">{`${showName}会话消息`}</div>
      {item.map((msg: IMessage, idx: number) => {
        // 默认只展示3条记录
        if (idx > 2) return;
        if (!msg.msgBody && msg.forward?.length) {
          msg = msg.forward[0];
        }
        switch (msg.msgType) {
          case MessageType.Image: {
            const img: FileItemShare = parseAvatar(msg.msgBody);
            if (img)
              return (
                <div className="con_content_forward_msg">
                  {msg.from.name}:{img.name}
                </div>
              );
            return <div className="con_content_forward_msg">消息异常</div>;
          }
          case MessageType.File: {
            const file: FileItemShare = parseAvatar(msg.msgBody);
            return (
              <div className="con_content_forward_msg">
                {msg.from.name}:{file.name}
              </div>
            );
          }
          case MessageType.Voice: {
            const bytes = JSON.parse(msg.msgBody).bytes;
            const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            return (
              <div className="con_content_forward_msg">
                {msg.from.name}:{url}
              </div>
            );
          }
          default: {
            // 优化截图展示问题
            if (msg.msgBody.includes('$IMG')) {
              let str = msg.msgBody;
              const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)];
              // 获取消息包含的图片地址
              // const imgUrls = matches.map((match) => match[1]);
              // 替换消息里 图片信息特殊字符
              const willReplaceStr = matches.map((match) => match[0]);
              willReplaceStr.forEach((strItem) => {
                str = str.replace(strItem, ' ');
              });
              // 垂直展示截图信息。把文字消息统一放在底部
              return (
                <div className="con_content_forward_msg">
                  {msg.from.name}:【图片】{str.trim()}
                </div>
              );
            }
            // 默认文本展示
            return (
              <div className="con_content_forward_msg">
                <span>{msg.from.name}：</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: truncateString(linkText(msg.msgBody), 80),
                  }}></span>
              </div>
            );
          }
        }
      })}
    </div>
  );
};
