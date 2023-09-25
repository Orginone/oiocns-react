import React, { FC, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Tag, Badge, Input, List, Checkbox } from 'antd';
import { MenuItemType } from 'typings/globelType';
import { ImSearch } from '@/icons/im';
import css from './index.module.less'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { DataNode } from 'antd/es/tree';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { IMessage, ISession } from '@/ts/core';
import {AiOutlineClose} from '@/icons/ai'
import { parseMsg } from '@/pages/Chats/components/parseMsg';
interface IChatShareForward {
    open: boolean;
    selectMenu?: MenuItemType;
    message: any;
    btachType: string;
    onCancel?: () => void;
    onShow: (val: boolean) => void
}

/** 转换数据,解析成原生菜单数据 */
const loadMenus: any = (items: MenuItemType[], expKeys: string[]) => {
    const result = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          title: item.label,
          label: '',
        //   label: renderLabel(item),
          children: loadMenus(item.children, expKeys),
          icon: item.expIcon && expKeys.includes(item.key) ? item.expIcon : item.icon,
        });
      }
    }
    return result;
};

const hanleOneLevelMenu: any = (items: MenuItemType[], expKeys: string[]) => {
    const result = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          title: item.label,
          label: '',
          icon: item.expIcon && expKeys.includes(item.key) ? item.expIcon : item.icon,
        });
        if (item.children) {
            result.push(...hanleOneLevelMenu(item.children, expKeys))
        }
      }
    }
    return [...result];
}
const ChatShareForward: FC<IChatShareForward> = (props) =>{
    const { open, message, btachType } = props
    const [filter, setFilter] = useState<string>('');
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [selectedData, setSelectedData] = useState<ISession[]>([])
    useEffect(() => {
        reloadData(openKeys)
    }, [filter])
    const reloadData = (keys: string[]) => {
        // setData(loadMenus(loopFilterTree(props.rootMenu.children), keys));
        // setOpenKeys(keys);
        setSelectedKeys([]);
    };
    let chats = orgCtrl.chats.filter((i) => i.isMyChat).filter(
        (a) =>
          a.chatdata.chatName.includes(filter) ||
          a.chatdata.chatRemark.includes(filter) ||
          a.chatdata.labels.filter((l) => l.includes(filter)).length > 0,
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
    const loopFilterTree = (data: DataNode[]) => {
        const result: any[] = [];
        for (const item of data) {
          const newItem: DataNode & {label?: string} = { ...item };
          let exsit = false;
          const title: typeof newItem.title = newItem.label;
          if (title && typeof title === 'string') {
            exsit = title.includes(filter);
          }
          const children: typeof item.children = item.children;
          if (children && Array.isArray(children)) {
            const result = loopFilterTree(children);
            exsit = exsit || result.length > 0;
            newItem.children = result;
          }
          if (exsit) {
            result.push(newItem);
          }
        }
        return result;
      };
    
    const handleCancel = () => {
        setSelectedKeys([])
        setSelectedData([])
        props.onShow(false)
    }

    const handleOk = () => {
      if (btachType === 'single' || !btachType) {
        selectedData.map( async(chat: ISession) => {
          message.map(async(msg: IMessage, idx: number) => {
            if (msg.forward && msg.forward.length) {
              await chat.sendMessage(message[idx].msgType, '', [], undefined, msg.forward )
            } else {
              await chat.sendMessage(message[idx].msgType, msg.msgBody, [], undefined, [] )
            }
          })
        })
      }
      if (btachType === 'merge') {
        selectedData.map( async(chat: ISession) => {
          await chat.sendMessage(message[0].msgType, '', [], undefined, message )
        })
      }
      handleCancel()
    }

    const onCheck = (checked: boolean, item: ISession) => {
        if (checked) {
            setSelectedKeys([...selectedKeys, item.key])
            setSelectedData([...selectedData, item])
        } else {
          setSelectedKeys([...selectedKeys.filter((key: string) => key !== item.key)])
          setSelectedData([...selectedData.filter((dataItem: ISession) => dataItem.key !== item.key)])
        }
    };
  /** 转发信息展示 */
  const forwardShowText = () => {
    if (!message || !message.length) return
    return (
      <div className={css.forwardText}>
        <div className="forward-text__content">{parseMsg(message && message[0])}</div>
      </div>
    );
  };
  // const innerHeight = window.innerHeight
    return (
        <Modal
            width="70%"
            title="转发"
            open={open}
            // bodyStyle={{height: `calc(${innerHeight / 2}px)`}}
            bodyStyle={{height: '400px'}}
            footer={[
                <Button key="back" onClick={handleCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  发送
                </Button>
            ]}
        > 
            <Row className={css.searchAndChosen}>
              <Col span={12}>
                <Input
                    className={css.chatMemberInput}
                    placeholder="搜索"
                    prefix={<ImSearch />}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                  />
              </Col>
              <Col span={12}>
                <div className={css.chosenNum}>{`已选：${selectedKeys.length}会话`}</div>
              </Col>
            </Row>
            <div className={css.departLine}>&nbsp;</div>
            <Row className={css.chatShareForwardModal}>
                <Col className={css.chatMember} span={12}>
                  <div className={css.memberWrap}>
                    <List
                        header={null}
                        footer={null}
                        dataSource={chats}
                        renderItem={item => {
                            return <Row className={css.chatMemlistRow}>
                                <Col className={css.chatMemlistCol} span={24}>
                                    <Checkbox
                                      checked={!!selectedKeys.find(key => key === item.key)}
                                      onChange={(e: CheckboxChangeEvent) => {
                                        onCheck(e.target.checked, item)
                                      }}
                                    >
                                        <List.Item
                                          className={css.listItem}
                                        >
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
                                                  <span style={{ marginRight: 10 }}>{item.chatdata.chatName}</span>
                                              </div>
                                            }
                                          />
                                        </List.Item>
                                    </Checkbox>
                                </Col>
                            </Row>
                        }}
                    >
                    </List>
                  </div>
                </Col>
                <Col span={12} className={css.chosenMember}>
                  <div className={css.chosenMemberWrap}>
                    <List
                      header={null}
                      footer={null}
                      locale={undefined}
                      dataSource={selectedData}
                      renderItem={item => {
                        return <Row className={`${css.chatMemlistRow} ${css.chosenListRow}`}>
                            <Col span={24}>
                              <List.Item
                                className={css.listItem}
                                actions={[<AiOutlineClose style={{cursor: 'pointer'}} onClick={() => {
                                  setSelectedKeys([...selectedKeys.filter((key: string) => key !== item.key)])
                                  setSelectedData([...selectedData.filter((dataItem: ISession) => dataItem.key !== item.key)])
                                }} key="list-loadmore-edit">X</AiOutlineClose>]}
                              >
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
                                        <span style={{ marginRight: 10 }}>{item.chatdata.chatName}</span>
                                    </div>
                                  }
                                />
                              </List.Item>
                            </Col>
                        </Row>
                      }}
                    />
                    {/* <div className={css.forwardTextWrap}>{forwardShowText()}</div> */}
                  </div>                    
                </Col>
            </Row>
        </Modal>
    )
}

export default ChatShareForward