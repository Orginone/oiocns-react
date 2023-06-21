import * as im from 'react-icons/im';
import { Button, message, Popover, Spin, Upload, UploadProps } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { IMessage, IMsgChat, MessageType } from '@/ts/core';
import { model, parseAvatar } from '@/ts/base';
import PullDown from '@/pages/Chats/components/pullDown';
import Cutting from '../../cutting';
import './index.less';
import { parseCiteMsg } from '@/pages/Chats/components/parseMsg';

/**
 * @description: 输入区域
 * @return {*}
 */

interface IProps {
  chat: IMsgChat;
  writeContent: any;
  citeText: IMessage | undefined;
  closeCite: any;
  /** 回车传递引用消息 */
  enterCiteMsg: any;
}

const GroupInputBox = (props: IProps) => {
  const { writeContent, citeText, enterCiteMsg, closeCite } = props;
  const [task, setTask] = useState<model.TaskModel>();
  const [imgUrls, setImgUrls] = useState<Array<string>>([]); // 表情图片
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
        await props.chat.sendMessage(MessageType.Text, massage, mentions, citeText);
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

  /** 创建img标签 */
  const handleImgChoosed = (url: string) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = `emoji`;
    document.getElementById('innerHtml')?.append(img);
  };
  /** 文件上传参数 */
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    async customRequest(options) {
      const file = options.file as File;
      if (file) {
        const result = await props.chat.directory.createFile(file, (p: number) => {
          return setTask({
            finished: p,
            size: file.size,
            name: file.name,
            createTime: new Date(),
          });
        });
        setTask(undefined);
        if (result) {
          await props.chat.sendMessage(
            result.filedata.thumbnail ? MessageType.Image : MessageType.File,
            JSON.stringify(result.shareInfo()),
            [],
          );
        }
      }
    },
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
      <div className="group-input-box">
        <div className="group-input-box__toolbar">
          <Popover
            placement="top"
            trigger="click"
            content={
              <div className="emoticons-picker">
                {imgUrls.map((index) => {
                  return (
                    <div
                      className="emoticons-picker__item"
                      key={index}
                      onClick={() => {
                        handleImgChoosed(index);
                      }}>
                      <img className="emoticon" src={`${index}`} alt="" />
                    </div>
                  );
                })}
              </div>
            }>
            <im.ImSmile size={18} color={'#9498df'} />
          </Popover>
          <im.ImMic
            size={18}
            color={'#9498df'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
          <Upload {...uploadProps}>
            <im.ImFolder size={18} color={'#9498df'} />
          </Upload>
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
    </Spin>
  );
};

export default GroupInputBox;
