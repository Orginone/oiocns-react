import React from 'react';
import { Image } from 'antd';
import { MessageType, IMessage } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { parseAvatar } from '@/ts/base';
import { FileTypes } from '@/ts/core/public/consts';
import { formatSize } from '@/ts/base/common';
import { filetrText, isShowLink, linkText } from '@/pages/Chats/config/common';
import { IconFont } from '@/components/IconFont';
import styles from './index.module.less';

export const parseMsg = (item: IMessage) => {
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      if (img && img.thumbnail) {
        return (
          <>
            <div className={`${styles.con_content_link}`}></div>
            <div className={`${styles.con_content_txt} ${styles.con_content_img}`}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      return <div className={`${styles.con_content_txt}`}>消息异常</div>;
    }
    case MessageType.File: {
      const file: FileItemShare = parseAvatar(item.msgBody);
      const showFileIcon: (fileName: string) => string = (fileName) => {
        const parts = fileName.split('.');
        const fileTypeStr: string = parts[parts.length - 1];
        const iconName = FileTypes[fileTypeStr] ?? 'icon-weizhi';
        return iconName;
      };
      return (
        <>
          <div className={`${styles.con_content_link}`}></div>
          <div className={`${styles.con_content_file}`}>
            <div className={styles.con_content_file_info}>
              <span className={styles.con_content_file_info_label}>{file.name}</span>
              <span className={styles.con_content_file_info_value}>
                {formatSize(file.size ?? 0)}
              </span>
            </div>
            <IconFont
              className={styles.con_content_file_Icon}
              type={showFileIcon(file.name)}
            />
          </div>
        </>
      );
    }
    case MessageType.Voice: {
      if (!item.msgBody) {
        return <span>无法解析音频</span>;
      }
      const bytes = JSON.parse(item.msgBody).bytes;
      const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      return (
        <div className={styles.voiceStyle}>
          <audio src={url} controls />
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
            <div className={`${styles.con_content_link}`}></div>
            <div className={`${styles.con_content_txt}`}>
              {imgUrls.map((url, idx) => (
                <Image
                  className={styles.cut_img}
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
        <>
          {/* 设置文本为超链接时打开新页面 */}
          {isShowLink(item.msgBody) ? (
            linkText(item.msgBody)
          ) : (
            <div
              className={`${styles.con_content_txt}`}
              dangerouslySetInnerHTML={{ __html: filetrText(item) }}></div>
          )}
        </>
      );
    }
  }
};
