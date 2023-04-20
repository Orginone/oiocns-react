import chatCtrl from '@/ts/controller/chat';
import storeCtrl from '@/ts/controller/store';
import { MessageType } from '@/ts/core/enum';
import { IconFont } from '@/components/IconFont';
import { Button, message, Popover, Spin, Upload, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import inputboxStyle from './index.module.less';
import { TaskModel } from '@/ts/core';

/**
 * @description: 输入区域
 * @return {*}
 */

interface Iprops {
  writeContent: any;
}

const Groupinputbox = (props: Iprops) => {
  const { writeContent } = props;
  const [task, setTask] = useState<TaskModel>();
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
      if (massage.length > 0) {
        insterHtml.innerHTML = '发送中,请稍后...';
        await chatCtrl.chat?.sendMessage(MessageType.Text, massage);
      }
      insterHtml.innerHTML = '';
    }
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
   * @return {*}
   */
  const reCreatChatContent = (elementChild: NodeList | any[]): Array<string> => {
    const arrElement = Array.from(elementChild);
    if (arrElement.length > 0) {
      return arrElement.map((n) => {
        if (n.nodeName == '#text') {
          // 如果是文本
          const newContent =
            n.textContent.length > 2048
              ? n.textContent.substring(0, 2048)
              : n.textContent;
          return newContent;
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
      if (!value?.includes('<div><br></div>')) {
        doc.innerHTML += '<div><br></div>';
      }
    } else if (e.keyCode == 13) {
      //用户点击了enter触发
      e.preventDefault(); // 阻止浏览器默认换行操作
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
      const docDir = await storeCtrl.home?.create('沟通');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file, (p: number) => {
          return setTask({
            finished: p,
            size: file.size,
            name: file.name,
            group: docDir.name,
            createTime: new Date(),
          });
        });
        setTask(undefined);
        if (result) {
          await chatCtrl.chat?.sendMessage(
            result.target.thumbnail ? MessageType.Image : MessageType.File,
            JSON.stringify(result.shareInfo()),
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
      <div className={inputboxStyle.group_input_wrap}>
        <div className={inputboxStyle.icons_box}>
          <div style={{ marginTop: '4px' }}>
            <Popover
              trigger="click"
              content={
                <div className={inputboxStyle.qqface_wrap}>
                  {imgUrls.map((index) => {
                    return (
                      <div
                        className={inputboxStyle.emoji_box}
                        key={index}
                        onClick={() => {
                          handleImgChoosed(index);
                        }}>
                        <img className={inputboxStyle.emoji} src={`${index}`} alt="" />
                      </div>
                    );
                  })}
                </div>
              }>
              <IconFont type={'icon-biaoqing'} className={inputboxStyle.icons_oneself} />
            </Popover>
          </div>
          {/* <AudioOutlined  /> */}

          <IconFont
            className={inputboxStyle.icons_oneself}
            type={'icon-maikefeng'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
          <Upload {...uploadProps}>
            <IconFont className={inputboxStyle.icons_oneself} type={'icon-wenjian'} />
          </Upload>
          <IconFont
            className={inputboxStyle.icons_oneself}
            type={'icon-jietu'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
          <IconFont
            className={inputboxStyle.icons_oneself}
            type={'icon-shipin'}
            onClick={() => {
              message.warning('功能暂未开放');
            }}
          />
        </div>
        <div className={inputboxStyle.input_content}>
          <div
            id="insterHtml"
            className={inputboxStyle.textarea}
            contentEditable="true"
            spellCheck="false"
            placeholder="请输入内容"
            onKeyDown={keyDown}></div>
          <div className={inputboxStyle.send_box}>
            <Button
              type="primary"
              style={{ color: '#fff', border: 'none' }}
              onClick={() => submit()}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Groupinputbox;
