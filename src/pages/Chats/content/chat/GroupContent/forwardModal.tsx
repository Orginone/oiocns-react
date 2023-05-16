import React, { memo, useState, useEffect } from 'react';
import { Checkbox, Col, Divider, Input, Modal, Row, Tag, Image, message } from 'antd';
import { common, kernel, model, parseAvatar } from '@/ts/base';
import { ImSearch } from 'react-icons/im';
import style from './index.module.less';
import styles from './text.module.less';
import { MessageType } from '@/ts/core';
import { FileItemShare, ResultType } from '@/ts/base/model';
import { FileTypes } from '@/ts/core/public/consts';
import { IconFont } from '@/components/IconFont';
import orgCtrl from '@/ts/controller';
import { forwardType } from './interface';
import { filetrText, isShowLink } from './common';

interface ModalPageProps {
  // 采用如下属性标注方式,会在父组件传值时，有文案提示
  /** 弹窗显示/隐藏 */
  visible: boolean;
  /** 点击确认后的回调 */
  onOk?: any;
  /** 点击取消后的回调 */
  onCancel?: any;
  /** 聊天内容 */
  formwardCode: model.MsgSaveModel | any;
}

const ForwardModal: React.FC<ModalPageProps> = (props) => {
  const { visible, onCancel, formwardCode } = props; // 在这里将属性从props 中解构出来

  const allUser = orgCtrl.user.chats.filter((i) => i.isMyChat);
  // 这里是页面状态
  const [sendData, setSendData] = useState<Array<forwardType>>([]); // 需要传输的卡片

  // 确认按钮
  const okHandle = async () => {
    // TODO 可以在这里做一些组件内部的事，再调用回调
    let allPromise: Array<string> = [];
    for (let index = 0; index < sendData.length; index++) {
      const element = sendData[index];
      kernel
        .createImMsg({
          msgType: formwardCode.msgType,
          toId: element.toId,
          belongId: formwardCode.belongId,
          msgBody: common.StringPako.deflate(
            filetrText(formwardCode) || formwardCode.showTxt,
          ),
        })
        .then((value: ResultType<boolean>) => {
          if (value.success) {
            allPromise.push(element.toId);
          }
        });
    }
    Promise.all(allPromise).then(() => {
      message.success('消息转发成功');
      onCancel();
    });
    // onOk();
  };

  // 取消按钮
  const cancelHandle = async () => {
    // TODO 可以在这里做一些组件内部的事，再调用回调
    onCancel();
  };

  /** 统一处理返回参数 */
  const parseMsg = (item: model.MsgSaveModel) => {
    switch (item.msgType) {
      case MessageType.Image: {
        const img: FileItemShare = parseAvatar(item.showTxt);
        return (
          <>
            <div>
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
            <div className={styles.fileContent} style={{ marginTop: '10px' }}>
              <div className={styles.fileContent_text}>
                {/* 文件的名称 */}
                <span className={styles.fileContent_Text_name}>{file.name}</span>
                <span>
                  {/* 文件的大小 */}
                  {showSize(file?.size ?? 0)}
                </span>
              </div>
              <IconFont
                type={showFileIcon(file.name)}
                className={styles.fileContent_Text_icon}
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
              <div className={style.con_content_link}></div>
              <div className={style.con_content_txt}>
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

  /** 勾选哪一项 */
  const handleCheck = (item: any, val: any) => {
    if (val.target.checked === true) {
      setSendData([
        ...sendData,
        {
          name: item.share.name,
          belongId: item.belongId,
          chatdata: item.chatdata,
          toId: item.chatId,
        },
      ]);
    } else {
      const data = sendData.filter((en: any) => {
        return en.belongId !== item.belongId;
      });
      setSendData(data);
    }
  };

  /** 对所展示的内容提取 */
  const showText = (val: forwardType) => {
    return (
      <div className={style.sendSty}>
        <div className={style.roleName}>{val.name}</div>
        {val.chatdata.labels.map((res: string) => (
          <Tag key={res} color="success">
            {res}
          </Tag>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // useEffect在组件初始化或visible变化时执行
  }, [visible]);

  return (
    <Modal
      // title="转发"
      open={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
      width={800}>
      <Row gutter={10}>
        <Col span={10} className={style.leftBox}>
          <Input
            style={{ height: 36, fontSize: 14, marginTop: '10px' }}
            placeholder="搜索"
            prefix={<ImSearch />}
          />
          <Divider />
          <div className={style.leftContent}>
            {allUser.map((item) => {
              return (
                <div className={style.leftContentUser} key={item.chatId}>
                  <Checkbox
                    onChange={(e) => handleCheck(item, e)}
                    key={item.chatId}
                    // checked={item.chatdata.fullId}
                  >
                    <div className={style.leftCheckSpan}>
                      <p className={style.leftText}>{item.chatdata.chatName}</p>
                      {item.chatdata.labels
                        .filter((i) => i.length > 0)
                        .map((label) => {
                          return (
                            <Tag key={label} color="success">
                              {label}
                            </Tag>
                          );
                        })}
                    </div>
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </Col>
        <Col span={14}>
          <div className={style.rightContent}>
            <div className={style.rightSend}>
              发送给
              <div>
                {sendData.length > 0 && sendData.map((res: any) => showText(res))}
              </div>
            </div>
            <Divider />
            消息内容：
            <div className={style.rightBottomText}>
              <div className={style.rightMes}>{parseMsg(formwardCode)}</div>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default memo(ForwardModal);
