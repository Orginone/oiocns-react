import orgCtrl from '@/ts/controller';
import { IconFont } from '@/components/IconFont';
import { Button, message, Popover, Spin, Upload, UploadProps, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import fileCss from '../GroupContent/index.module.less';
import { CloseCircleFilled } from '@ant-design/icons';
import { IMsgChat, MessageType, TaskModel } from '@/ts/core';
import Cutting from '../../cutting';
import { filetrText, isShowLink } from '../GroupContent/common';
import { model, parseAvatar } from '@/ts/base';
import { FileItemShare } from '@/ts/base/model';
import { FileTypes } from '@/ts/core/public/consts';

/**
 * @description: 输入区域
 * @return {*}
 */

interface Iprops {
  chat: IMsgChat;
  writeContent: any;
  // citeText: model.MsgSaveModel;
  citeText: model.MsgSaveModel;
  closeCite: any;
  /** 回车传递引用消息 */
  enterCiteMsg: any;
}

const Groupinputbox = (props: Iprops) => {
  const { writeContent, citeText, closeCite, enterCiteMsg, chat } = props;

  const [task, setTask] = useState<TaskModel>();
  const [IsCut, setIsCut] = useState<boolean>(false); // 是否截屏
  const [imgUrls, setImgUrls] = useState<Array<string>>([]); // 表情图片
  /**
   * @description: 提交聊天内容
   * @return {*}
   */
  const submit = async () => {
    const insterHtml = document.getElementById('insterHtml');
    if (insterHtml != null) {
      const text: any =
        insterHtml.childNodes.length > 0
          ? reCreatChatContent(insterHtml.childNodes ?? [])
          : [insterHtml.innerHTML];
      let massage = text.join('').trim();
      console.log(massage, 'massgar');

      if (massage.length > 0) {
        insterHtml.innerHTML = '发送中,请稍后...';
        await chat.sendMessage(MessageType.Text, massage);
      }
      insterHtml.innerHTML = '';
      closeCite('');
      console.log('消息内容', text);
    }
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
   * @return {*}
   */
  const reCreatChatContent = (elementChild: NodeList | any[]): Array<string> => {
    // 判断聊天格式
    const arrElement = Array.from(elementChild);
    if (arrElement.length > 0) {
      return arrElement.map((n) => {
        if (n.nodeName == '#text' || n.nodeName == 'DIV') {
          // 如果是文本
          if (n.textContent.length > 2048) {
            const newContent = n.textContent.substring(0, 2048);
            return newContent;
          } else {
            const newContent = citeText
              ? `${n.textContent}$CITEMESSAGE[${filetrText(citeText)}]`
              : `${n.textContent}`;

            return newContent;
          }
        } else if (n.nodeName == 'IMG') {
          switch (n.className) {
            case 'cutImg':
              return `$IMG[${n.src}]`;
            // case 'emoji':
            //   return `$EMO[${n.src.match(/\/(\d+)\.png/)[1]}]`;
            default:
              break;
          }
        }
        return n?.outerHTML;
      });
    }
    return [];
  };

  /**
   * @description: 创建img标签
   * @param {string} url
   * @return {*}
   */
  const handleImgChoosed = (url: string) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = `emoji`;
    document.getElementById('insterHtml')?.append(img);
  };

  /** 统一处理返回参数 */
  const parseMsg = (item: model.MsgSaveModel) => {
    switch (item.msgType) {
      case MessageType.Image: {
        const img: FileItemShare = parseAvatar(item.showTxt);
        return (
          <>
            <div style={{ width: '40%' }}>
              <Image src={img.thumbnail} preview={{ src: img.shareLink }} />
            </div>
          </>
        );
      }
      case MessageType.File: {
        const file: FileItemShare = parseAvatar(item.showTxt);
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
            <div className={`${fileCss.con_content_link}`}></div>
            <div className={`${fileCss.con_content_file}`}>
              <div className={fileCss.con_content_file_info}>
                <span className={fileCss.con_content_file_info_label}>{file.name}</span>
                <span className={fileCss.con_content_file_info_value}>
                  {showSize(file?.size ?? 0)}
                </span>
              </div>
              <IconFont
                className={fileCss.con_content_file_Icon}
                type={showFileIcon(file.name)}
              />
            </div>
          </>
        );
      }
      default: {
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
              <div className={`${'con_content_link'}`}></div>
              <div className={`${'con_content_txt'}`}>
                {imgUrls.map((url, idx) => (
                  <Image src={url} key={idx} preview={{ src: url }} />
                ))}
                {str.trim() && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{str}</p>}
              </div>
            </>
          );
        }

        return (
          <>
            <div className={`${'con_content_link'}`}></div>
            {/* 设置文本为超链接时打开新页面 */}
            {isShowLink(item.showTxt) ? (
              item.showTxt
            ) : (
              <div
                className={`${'con_content_txt'}`}
                dangerouslySetInnerHTML={{ __html: filetrText(item) }}></div>
            )}
          </>
        );
      }
    }
  };

  // 截屏后放入输入区发出消息
  const handleCutImgSelect = async (result: any) => {
    const img = document.createElement('img');
    img.src = result.shareInfo().shareLink;
    img.className = `cutImg`;
    img.style.display = 'block';
    img.style.marginBottom = '10px';
    document.getElementById('insterHtml')?.append(img);
  };
  // 截屏直接发出消息
  // const handleCutImgSelect = async (result: any) => {
  //   await chat.sendMessage(
  //     result.metadata.thumbnail ? MessageType.Image : MessageType.File,
  //     JSON.stringify(result.shareInfo()),
  //   );
  // };
  /**
   * @description: 处理表情图片
   * @return {*}
   */
  useEffect(() => {
    let imgUrl = ``;
    let imgUrlss = [];
    for (let i = 1; i <= 36; i++) {
      imgUrl = `/emo/${i}.png`;
      imgUrlss.push(imgUrl);
    }
    setImgUrls(imgUrlss);
  }, []);
  useEffect(() => {
    let doc = document.getElementById('insterHtml');
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
    let doc = document.getElementById('insterHtml');
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
    }
  };
  /** 文件上传参数 */
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    async customRequest(options) {
      const file = options.file as File;
      const docDir = await orgCtrl.user.filesys?.home?.create('沟通');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file, (p: number) => {
          return setTask({
            finished: p,
            size: file.size,
            name: file.name,
            group: docDir.metadata.name,
            createTime: new Date(),
          });
        });
        setTask(undefined);
        if (result) {
          await chat.sendMessage(
            result.metadata.thumbnail ? MessageType.Image : MessageType.File,
            JSON.stringify(result.shareInfo()),
          );
        }
      }
    },
  };

  /** 引用展示 */
  const citeShowText = (val: model.MsgSaveModel) => {
    return (
      <div className={'showTxtContent'}>
        <div className={'showText'}>{parseMsg(val)}</div>
        <CloseCircleFilled onClick={() => closeCite('')} className={'closeIcon'} />
      </div>
    );
  };

  const getMessage = () => {
    if (task) {
      if (task.finished === -1) {
        return `${task.name}正在上传失败...`;
      }
      const process = ((task.finished * 100.0) / task.size).toFixed(2);
      return `${task.name}正在上传中${process}%...`;
    }
    return '';
  };

  return (
    <Spin tip={getMessage()} spinning={task != undefined}>
      <div className={'group_input_wrap'}>
        <div className={'icons_box'}>
          <div style={{ marginTop: '4px' }}>
            <Popover
              trigger="click"
              content={
                <div className={'qqface_wrap'}>
                  {imgUrls.map((index) => {
                    return (
                      <div
                        className={'emoji_box'}
                        key={index}
                        onClick={() => {
                          handleImgChoosed(index);
                        }}>
                        <img className={'emoji'} src={`${index}`} alt="" />
                      </div>
                    );
                  })}
                </div>
              }>
              <IconFont type={'icon-biaoqing'} className={'icons_oneself'} />
            </Popover>
          </div>
          {/* <AudioOutlined  /> */}

          <IconFont
            className={'icons_oneself'}
            type={'icon-maikefeng'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
          <Upload {...uploadProps}>
            <IconFont className={'icons_oneself'} type={'icon-wenjian'} />
          </Upload>
          <IconFont
            title="Ctrl+Alt+A 可触发截屏；选择截图区域后双击即可完成截图；Esc退出截屏"
            className={'icons_oneself'}
            type={'icon-jietu'}
            onClick={() => {
              setIsCut(true);
            }}
          />
          <IconFont
            className={'icons_oneself'}
            type={'icon-shipin'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
        </div>
        <div className={'input_content'}>
          <div
            id="insterHtml"
            className={'textarea'}
            contentEditable="true"
            spellCheck="false"
            placeholder="请输入内容"
            onKeyDown={keyDown}></div>
          {citeText && citeShowText(citeText)}
          <div className={'send_box'}>
            <Button
              type="primary"
              style={{ color: '#fff', border: 'none' }}
              onClick={() => submit()}>
              发送
            </Button>
          </div>
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
    </Spin>
  );
};

export default Groupinputbox;
