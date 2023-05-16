import { model, parseAvatar } from '@/ts/base';
import { FileItemShare } from '@/ts/base/model';
import { MessageType } from '@/ts/core';
import { CaretUpOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import React from 'react';
import style from './text.module.less';
import css from './index.module.less';
import { IconFont } from '@/components/IconFont';
import { FileTypes } from '@/ts/core/public/consts';
/** 处理返回的文字*/
export const filetrText = (val: model.MsgSaveModel) => {
  //后端返回的值
  const spanText = val?.showTxt?.indexOf(
    '<span style="white-space: pre; background-color: rgb(255, 255, 255);">',
  );
  if (spanText === 0) {
    const citeText = val?.showTxt?.substring(
      val?.showTxt?.indexOf('">') + 2,
      val?.showTxt?.length - 7,
    );
    return citeText;
  } else {
    const userText = val?.showTxt?.substring(spanText, val?.showTxt?.length);
    const typeofText = userText.indexOf('$CITEMESSAGE');
    if (typeofText !== -1) {
      const textGroup = userText.substring(0, typeofText);
      return textGroup;
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
    <div className={`${css.con_content_a}`}>
      <span className={`${css.con_content_span}`}>
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
export const filterCite = (item: string, type: string) => {
  switch (type) {
    case '文本': {
      const matches = [...item.matchAll(/\$CITEMESSAGE\[([^\]]*)\]/g)];
      if (matches.length > 0) {
        return matches.map((res: any) => {
          const isFile = res[1].includes('{"size":');
          // const isImage = res[1].includes('');
          if (!isFile) {
            return (
              <>
                <CaretUpOutlined className={style.citeIcon} />
                <div
                  dangerouslySetInnerHTML={{ __html: res[1] }}
                  className={style.citeText}></div>
              </>
            );
          } else if (isFile) {
            const matches = [...item.matchAll(/\$CITEMESSAGE\[([^\]]*)\]/g)];
            const fileText = matches.map((res: any) => res[1]);
            // 这里做图片的展示
            const file: FileItemShare = parseAvatar(fileText[0]);
            const showSize: (size: number) => string = (size) => {
              if (size > 1024000) {
                return (size / 1024000).toFixed(2) + 'M';
              } else {
                return (size / 1024).toFixed(2) + 'KB';
              }
            };
            const showFileIcon: (fileName: string) => string = (fileName) => {
              const parts = fileName.split('.');
              const fileTypeStr: string = parts[parts.length - 1];
              const iconName = FileTypes[fileTypeStr] ?? 'icon-weizhi';
              return iconName;
            };
            return (
              <>
                <CaretUpOutlined className={style.citeIcon} />
                <div className={style.fileContent}>
                  <div className={style.fileContent_text}>
                    {/* 文件的名称 */}
                    <span className={style.fileContent_Text_name}>{file.name}</span>
                    <span>
                      {/* 文件的大小 */}
                      {showSize(file?.size ?? 0)}
                    </span>
                  </div>
                  <IconFont
                    type={showFileIcon(file.name)}
                    className={style.fileContent_Text_icon}
                  />
                </div>
              </>
            );
          }
        });
      }
    }
    default:
      null;
      break;
  }
};

/**
 * 显示引用消息
 * @param msg 引用消息
 */
export const showCiteText = (item: model.MsgSaveModel) => {
  // debugger;
  switch (item.msgType) {
    case MessageType.Image: {
      const img: FileItemShare = parseAvatar(item.showTxt);
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
      if (item.showTxt.includes('$CITEMESSAGE')) {
        // 优化截图展示问题
        if (item.showTxt.includes('$IMG')) {
          let str = item.showTxt;
          const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)];
          // 获取消息包含的图片地址
          const imgUrls = matches.map((match) => match[1]);
          // 替换消息里 图片信息特殊字符
          const willReplaceStr = matches.map((match) => match[0]);
          willReplaceStr.forEach((strItem) => {
            // str = str.replace(strItem, '图(' + (idx + 1) + ')');
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
      return <>{filterCite(item.showTxt, item.msgType)}</>;
    }
  }
};
