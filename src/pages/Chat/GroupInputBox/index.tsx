import { AudioOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, message, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import inputboxStyle from './index.module.less';
import { chat } from '@/module/chat/orgchat';

/**
 * @description: 输入区域
 * @return {*}
 */

interface Iprops {
  writeContent: any;
  // setHistoryMesagesList: Function;
  // sendMesageCallback: (val: any) => void;
}

const Groupinputbox = (props: Iprops) => {
  const { writeContent } = props;
  const [imgUrls, setImgUrls] = useState<Array<string>>([]); // 表情图片

  /**
   * @description: 提交聊天内容
   * @return {*}
   */
  const submit = async () => {
    const inputContent: any = document.getElementById('insterHtml')?.childNodes;
    const text: any =
      inputContent?.length > 0
        ? reCreatChatContent(document.getElementById('insterHtml')?.childNodes)
        : [document.getElementById('insterHtml')?.innerHTML];
    let massage = text.join('').trim();
    if (massage.length > 0) {
      await chat.sendMsg(
        {
          toId: chat.curChat?.id,
          spaceId: chat.curChat?.spaceId,
          msgType: 'text',
          msgBody: massage,
        },
        // sendMesageCallback,
        // setHistoryMesagesList(),
      );
      // ChatStore.addSessionList();
      // ChatStore._cacheSession();
    }
    document.getElementById('insterHtml').innerHTML = '';
  };

  /**
   * @description: 解析聊天内容
   * @param {NodeList} elementChild
   * @return {*}
   */
  const reCreatChatContent = (elementChild: NodeList | any[]): Array<string> => {
    const arrElement = Array.from(elementChild);
    // const newSpace  = document.createDocumentFragment()
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
    // return newSpace.innerHTML
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
    document.getElementById('insterHtml').append(img);
  };

  /**
   * @description: 处理表情图片
   * @return {*}
   */
  useEffect(() => {
    let imgUrl = ``;
    let imgUrlss = [];
    for (let i = 1; i <= 36; i++) {
      imgUrl = `/src/assets/emo/${i}.png`;
      imgUrlss.push(imgUrl);
    }
    setImgUrls(imgUrlss);
  }, []);
  useEffect(() => {
    if (writeContent !== null) {
      document.getElementById('insterHtml').innerHTML = writeContent;
    }
  }, [writeContent]);

  /**
   * @description: 输入框 键盘指令
   * @param {any} e
   * @return {*}
   */
  const keyDown = (e: any) => {
    if (e.ctrlKey && e.keyCode == 13) {
      //用户点击了ctrl+enter触发
      const value = document.getElementById('insterHtml')?.innerHTML;
      if (!value?.includes('<div><br></div>')) {
        document.getElementById('insterHtml').innerHTML += '<div><br></div>';
      }
      setFocus();
    } else if (e.keyCode == 13) {
      //用户点击了enter触发
      e.preventDefault(); // 阻止浏览器默认换行操作
      const value = document
        .getElementById('insterHtml')
        .innerHTML.replaceAll('<div><br></div>', '');
      if (value) {
        submit();
      } else {
        return message.warning('不能发送空值');
      }
    }
  };

  /**
   * @description: 设置光标到最后
   * @return {*}
   */
  const setFocus = () => {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(inputRef.value);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
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
                      }}
                    >
                      <img className={inputboxStyle.emoji} src={`${index}`} alt="" />
                    </div>
                  );
                })}
              </div>
            }
          >
            <SmileOutlined className={inputboxStyle.icons_oneself} />
          </Popover>
        </div>
        <AudioOutlined className={inputboxStyle.icons_oneself} />
      </div>
      <div className={inputboxStyle.input_content}>
        <div
          id="insterHtml"
          className={inputboxStyle.textarea}
          contentEditable="true"
          spellCheck="false"
          //   ref="inputRef"
          placeholder="请输入内容"
          onKeyDown={keyDown}
        ></div>
        <div className={inputboxStyle.send_box}>
          <Button
            type="primary"
            style={{ backgroundColor: '#21ba45', color: '#fff', border: 'none' }}
            onClick={() => submit()}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Groupinputbox;
