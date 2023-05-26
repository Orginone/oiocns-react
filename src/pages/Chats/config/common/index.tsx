import { parseAvatar } from '@/ts/base';
import { FileItemShare } from '@/ts/base/model';
import { MessageType, IMessage } from '@/ts/core';
import { CaretUpOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React from 'react';
import style from './index.module.less';
import { IconFont } from '@/components/IconFont';
import { FileTypes } from '@/ts/core/public/consts';
import { formatSize } from '@/ts/base/common';

/** 处理返回的文字 */
export const filetrText = (val: IMessage) => {
  //后端返回的值
  const spanText = val?.msgBody?.indexOf(
    '<span style="white-space: pre; background-color: rgb(255, 255, 255);">',
  );
  if (spanText === 0) {
    const citeText = val?.msgBody?.substring(
      val?.msgBody?.indexOf('">') + 2,
      val?.msgBody?.length - 7,
    );
    return citeText;
  } else {
    const userText = val?.msgBody?.substring(spanText, val?.msgBody?.length);
    const typeofText = userText?.indexOf('$CITE');
    const typeofFInd = userText?.indexOf('$FINDME');
    if (typeofText !== -1) {
      const textGroup = userText?.substring(0, typeofText);
      return textGroup;
    } else if (typeofFInd !== -1) {
      const findGroup = userText?.substring(0, typeofFInd);
      return findGroup;
    } else {
      return userText;
    }
  }
};

/** 判断是否为超链接的格式 */
export const isShowLink = (val: string) => {
  const str = val;
  //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
  //下面的代码中应用了转义字符"\"输出一个字符"/"
  // eslint-disable-next-line no-useless-escape
  const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  const objExp = new RegExp(Expression);
  if (objExp.test(str) === true) {
    return val;
  } else {
    return false;
  }
};

/** 过滤非http链接字符 */
export const linkText = (val: string) => {
  const reg = /[\u4e00-\u9fa5]+/g;
  const link = val.substring(val.indexOf('http'), val.length);
  return (
    <div className={`${style.con_content_a}`}>
      <span className={`${style.con_content_span}`}>
        {val?.substring(val.indexOf('http'), 0)}
      </span>
      <a
        dangerouslySetInnerHTML={{ __html: link }}
        href={val.replace(reg, '')}
        target="_blank"
        rel="noreferrer"></a>
    </div>
  );
};

/** 引用消息文字的过滤 */
export const filterCite = (item: string, type: string, user: IMessage) => {
  switch (type) {
    case '文本':
      {
        const matches = [...item.matchAll(/\$CITE\[([^\]]*)\]/g)];
        if (matches.length > 0) {
          return matches.map((res: any, index: number) => {
            const isFile = res[1].includes('{"size":');
            if (!isFile) {
              return (
                <div
                  key={user.metadata.fromId + index}
                  className={user.isMySend ? style.rightContent : style.leftContent}>
                  <CaretUpOutlined
                    className={user.isMySend ? style.citeIcon : style.leftCiteIcon}
                  />
                  <div className={user.isMySend ? style.citeText : style.leftCiteText}>
                    {res[1]}
                  </div>
                </div>
              );
            } else if (isFile) {
              const matches = [...item.matchAll(/\$CITE\[([^\]]*)\]/g)];
              const fileText = matches.map((res: any) => res[1]);
              // 这里做图片的展示
              const file: FileItemShare = parseAvatar(fileText[0]);
              const showFileIcon: (fileName: string) => string = (fileName) => {
                const parts = fileName.split('.');
                const fileTypeStr: string = parts[parts.length - 1];
                const iconName = FileTypes[fileTypeStr] ?? 'icon-weizhi';
                return iconName;
              };
              return (
                <div
                  key={user.metadata.fromId}
                  className={user.isMySend ? style.rightContent : style.leftContent}>
                  <CaretUpOutlined className={style.citeIcon} />
                  <div className={style.fileContent}>
                    <div className={style.fileContent_text}>
                      {/* 文件的名称 */}
                      <span className={style.fileContent_Text_name}>{file.name}</span>
                      <span>
                        {/* 文件的大小 */}
                        {formatSize(file.size ?? 0)}
                      </span>
                    </div>
                    <IconFont
                      type={showFileIcon(file.name)}
                      className={style.fileContent_Text_icon}
                    />
                  </div>
                </div>
              );
            }
          });
        }
      }
      break;
    default:
      null;
      break;
  }
};

/** 显示引用消息 */
export const showCiteText = (item: IMessage) => {
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.msgBody);
      return (
        <>
          <div className={`${style.imageCite} ${style.citeText}`}>
            <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
          </div>
        </>
      );
    }
    default: {
      // 如果截图不存在引用消息直接展示
      if (item.msgBody.includes('$CITE')) {
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
              <div>
                {imgUrls.map((url, idx) => (
                  <Image src={url} key={idx} preview={{ src: url }} />
                ))}
                {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
              </div>
            </>
          );
        }
      }
      return <>{filterCite(item.msgBody, item.msgType, item)}</>;
    }
  }
};

/** 截屏后放入输入区发出消息 */
export const handleCutImgSelect = async (result: any) => {
  const img = document.createElement('img');
  img.src = result.shareInfo().shareLink;
  img.className = `cutImg`;
  img.style.display = 'block';
  img.style.marginBottom = '10px';
  document.getElementById('insterHtml')?.append(img);
};

/** 创建img标签 */
export const handleImgChoosed = (url: string) => {
  const img = document.createElement('img');
  img.src = url;
  img.className = `emoji`;
  document.getElementById('insterHtml')?.append(img);
};
