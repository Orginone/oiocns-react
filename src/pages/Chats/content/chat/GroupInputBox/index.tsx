import orgCtrl from '@/ts/controller';
import { IconFont } from '@/components/IconFont';
import { Button, message, Popover, Spin, Upload, UploadProps } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { IMessage, IMsgChat, MessageType, TaskModel } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import PullDown from '@/pages/Chats/components/pullDown';
import Cutting from '../../cutting';
import './index.less';
import { parseCiteMsg } from '@/pages/Chats/components/parseMsg';

/**
 * @description: 输入区域
 * @return {*}
 */

interface Iprops {
  chat: IMsgChat;
  writeContent: any;
  citeText: IMessage | undefined;
  closeCite: any;
  /** 回车传递引用消息 */
  enterCiteMsg: any;
}

const Groupinputbox = (props: Iprops) => {
  const { writeContent, citeText, enterCiteMsg, closeCite } = props;
  const [task, setTask] = useState<TaskModel>();
  const [imgUrls, setImgUrls] = useState<Array<string>>([]); // 表情图片
  const [IsCut, setIsCut] = useState<boolean>(false); // 是否截屏
  const [citeShow, setCiteShow] = useState<boolean>(false); // @展示

  /** 引用展示 */
  const citeShowText = (val: IMessage) => {
    return (
      <div className={'showTxtContent'}>
        <div className={'showText'}>{parseCiteMsg(val)}</div>
        <CloseCircleFilled onClick={() => closeCite('')} className={'closeIcon'} />
      </div>
    );
  };

  /** 艾特触发人员选择 */
  const onSelect = (e: any) => {
    setCiteShow(false);
    const insterHtml = document.getElementById('insterHtml');
    if (insterHtml) {
      const node = document.createElement('at');
      node.id = e.id;
      node.innerText = `${e.name}`;
      insterHtml.append(node);
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
    const insterHtml = document.getElementById('insterHtml');
    if (insterHtml != null) {
      const mentions: string[] = [];
      const text: any =
        insterHtml.childNodes.length > 0
          ? reCreatChatContent(insterHtml.childNodes ?? [], mentions)
          : [insterHtml.innerHTML];
      let massage = text.join('').trim();
      if (massage.length > 0) {
        insterHtml.innerHTML = '发送中,请稍后...';
        await props.chat.sendMessage(MessageType.Text, massage, mentions, citeText);
      }
      insterHtml.innerHTML = '';
      closeCite('');
    }
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
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
    document.getElementById('insterHtml')?.append(img);
  };

  /** 创建img标签 */
  const handleImgChoosed = (url: string) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = `emoji`;
    document.getElementById('insterHtml')?.append(img);
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
          await props.chat.sendMessage(
            result.metadata.thumbnail ? MessageType.Image : MessageType.File,
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
        {/* @功能 */}
        <div className={'input_content'}>
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
            id="insterHtml"
            autoFocus={true}
            ref={(ref) => ref && !citeShow && ref.focus()}
            className={'textarea'}
            contentEditable="true"
            spellCheck="false"
            placeholder="请输入内容"
            onKeyDown={keyDown}></div>
          {citeText && citeShowText(citeText)}
        </div>
        <div className={'send_box'}>
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

export default Groupinputbox;
