import React, { FC, useState } from 'react';
import { Modal, Button, Row, Col, Badge, Input, List, Checkbox } from 'antd';
import { MenuItemType } from 'typings/globelType';
import { ImSearch } from '@/icons/im';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { IMessage, ISession, MessageType } from '@/ts/core';
import { AiOutlineClose } from '@/icons/ai';
interface IChatShareForward {
  open: boolean;
  selectMenu?: MenuItemType;
  message: any;
  btachType: string;
  onCancel?: () => void;
  onShow: (val: boolean) => void;
}

const ChatShareForward: FC<IChatShareForward> = (props) => {
  const { open, message, btachType } = props;
  const [filter, setFilter] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<ISession[]>([]);
  let chats = orgCtrl.chats
    .filter((i) => i.isMyChat)
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.groupTags.filter((l) => l.includes(filter)).length > 0,
    )
    .sort((a, b) => {
      var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
          num = b.isBelongPerson ? 1 : -1;
        } else {
          num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5;
        }
      }
      return num;
    });

  const handleCancel = () => {
    setSelectedKeys([]);
    setSelectedData([]);
    props.onShow(false);
  };

  const handleOk = () => {
    if (btachType === 'single' || !btachType) {
      selectedData.map(async (chat: ISession) => {
        message.map(async (msg: IMessage, idx: number) => {
          if (msg.forward && msg.forward.length) {
            await chat.sendMessage(message[idx].msgType, '', [], undefined, msg.forward);
          } else {
            await chat.sendMessage(message[idx].msgType, msg.msgBody, [], undefined, []);
          }
        });
      });
    }
    if (btachType === 'merge') {
      selectedData.map(async (chat: ISession) => {
        await chat.sendMessage(MessageType.Forward, '', [], undefined, message);
      });
    }
    handleCancel();
  };

  const onCheck = (checked: boolean, item: ISession) => {
    if (checked) {
      setSelectedKeys([...selectedKeys, item.key]);
      setSelectedData([...selectedData, item]);
    } else {
      setSelectedKeys([...selectedKeys.filter((key: string) => key !== item.key)]);
      setSelectedData([
        ...selectedData.filter((dataItem: ISession) => dataItem.key !== item.key),
      ]);
    }
  };
  const renderTitle = () => {
    return <div className="chatShare-title">
      <span>转发</span>
      <Input
        className="chatMem-search"
        placeholder="搜索"
        prefix={<ImSearch />}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      />
      <div className="chosen-num">{`已选：${selectedKeys.length}会话`}</div>
    </div>
  }
  return (
    <Modal
      width="70%"
      title={renderTitle()}
      open={open}
      // bodyStyle={{height: `calc(${innerHeight / 2}px)`}}
      bodyStyle={{ maxHeight: '600px', height: '80%', position: 'relative' }}
      className="chat-shareForward"
      onCancel={handleCancel}
      maskClosable
      afterClose={() => {
        setSelectedData([])
        setSelectedKeys([])
        setFilter('')
      }}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          发送
        </Button>,
      ]}>
      <Row>
        <div className="departLine">&nbsp;</div>
        <Col className="chatMem" span={12}>
          <div className="mem-wrap">
            <List
              header={null}
              footer={null}
              dataSource={chats}
              renderItem={(item) => {
                return (
                  <Row className="chatMem-list">
                    <Col span={24}>
                      <Checkbox
                        checked={!!selectedKeys.find((key) => key === item.key)}
                        onChange={(e: CheckboxChangeEvent) => {
                          onCheck(e.target.checked, item);
                        }}>
                        <List.Item className="chatMem-list-item">
                          <List.Item.Meta
                            avatar={
                              <Badge size="small">
                                <TeamIcon
                                  typeName={item.metadata.typeName}
                                  entityId={item.sessionId}
                                  size={40}
                                />
                              </Badge>
                            }
                            title={
                              <div>
                                <span style={{ marginRight: 10 }}>
                                  {item.chatdata.chatName}
                                </span>
                              </div>
                            }
                          />
                        </List.Item>
                      </Checkbox>
                    </Col>
                  </Row>
                );
              }}></List>
          </div>
        </Col>
        <Col span={12} className="chosenMem">
          <div className="chosenMem-wrap">
            <List
              header={null}
              footer={null}
              locale={undefined}
              dataSource={selectedData}
              renderItem={(item) => {
                return (
                  // <Row className={`${css.chatMemlist} ${css.chosenListRow}`}>
                  <Row className="chatMem-list chosen-list">
                    <Col span={24}>
                      <List.Item
                        className="chatMem-list-item"
                        actions={[
                          <AiOutlineClose
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedKeys([
                                ...selectedKeys.filter((key: string) => key !== item.key),
                              ]);
                              setSelectedData([
                                ...selectedData.filter(
                                  (dataItem: ISession) => dataItem.key !== item.key,
                                ),
                              ]);
                            }}
                            key="list-loadmore-edit">
                            X
                          </AiOutlineClose>,
                        ]}>
                        <List.Item.Meta
                          avatar={
                            <Badge size="small">
                              <TeamIcon
                                typeName={item.metadata.typeName}
                                entityId={item.sessionId}
                                size={40}
                              />
                            </Badge>
                          }
                          title={
                            <div>
                              <span style={{ marginRight: 10 }}>
                                {item.chatdata.chatName}
                              </span>
                            </div>
                          }
                        />
                      </List.Item>
                    </Col>
                  </Row>
                );
              }}
            />
            {/* <div className={css.forwardTextWrap}>{forwardShowText()}</div> */}
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ChatShareForward;
