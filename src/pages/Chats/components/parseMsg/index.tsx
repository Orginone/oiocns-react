import React from 'react';
import { Image } from 'antd';
import { MessageType, IMessage } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { parseAvatar } from '@/ts/base';
import { formatSize } from '@/ts/base/common';
import css from './index.module.less';

/** 将链接转化为超链接 */
const linkText = (val: string) => {
  let reg = /(https?:\/\/[^\s]+)/g;
  return val.replace(reg, '<a target=_blank href="$1"> $1 </a>');
};

/**
 * 显示消息
 * @param item
 */
export const parseMsg = (item: IMessage): any => {
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      if (img && img.thumbnail) {
        return (
          <>
            <div className={`${css.con_content_txt}`}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      return <div className={`${css.con_content_txt}`}>消息异常</div>;
    }
    case MessageType.File: {
      const file: FileItemShare = parseAvatar(item.msgBody);
      if (!file) {
        return (
          <div className={`${css.con_content_txt}`} style={{ color: '#af1212' }}>
            文件消息异常
          </div>
        );
      }
      return (
        <>
          <div className={`${css.con_content_txt}`}>
            <a href={file.shareLink} title="点击下载">
              <div>
                <b>{file.name}</b>
              </div>
              <div>{formatSize(file.size)}</div>
            </a>
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
          <div className={css.voiceStyle}>
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
            <div className={`${css.con_content_txt}`}>
              {imgUrls.map((url, idx) => (
                <Image
                  className={css.cut_img}
                  src={url}
                  key={idx}
                  preview={{ src: url }}
                />
              ))}
              {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
            </div>
          </>
        );
      }
      // 默认文本展示
      return (
        <div className={`${css.con_content_txt}`}>
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
            <div className={`${css.con_content_cite_txt}`}>
              <span>{item.from.name}:</span>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      return <div className={`${css.con_content_cite_txt}`}>消息异常</div>;
    }
    case MessageType.File: {
      const file: FileItemShare = parseAvatar(item.msgBody);
      return (
        <div className={`${css.con_content_cite_txt}`}>
          <span>{item.from.name}:</span>
          <a href={file.shareLink} title="点击下载">
            <div>
              <b>{file.name}</b>
            </div>
            <div>{formatSize(file.size)}</div>
          </a>
        </div>
      );
    }
    case MessageType.Voice: {
      const bytes = JSON.parse(item.msgBody).bytes;
      const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      return (
        <div className={`${css.con_content_cite_txt}`}>
          <span>{item.from.name}:</span>
          <div className={css.voiceStyle}>
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
            <div className={`${css.con_content_cite_txt}`}>
              <span>{item.from.name}:</span>
              {imgUrls.map((url, idx) => (
                <Image
                  className={css.cut_img}
                  src={url}
                  key={idx}
                  preview={{ src: url }}
                />
              ))}
              {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
            </div>
          </>
        );
      }
      // 默认文本展示
      return (
        <div className={`${css.con_content_cite_txt}`}>
          <span>{item.from.name}:</span>
          <div dangerouslySetInnerHTML={{ __html: linkText(item.msgBody) }}></div>
        </div>
      );
    }
  }
};
