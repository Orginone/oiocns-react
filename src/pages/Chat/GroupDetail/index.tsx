import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, message, Modal, Row, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
// import CohortServers from '@/module/chat/cohortchat';
import detailStyle from './index.module.less';
import { chatCtrl } from '@/ts/controller/chat';
import { deepClone } from '@/ts/base/common';

/**
 * @description:  个人、群聊详情
 * @return {*}
 */

interface itemResult {
  code: string;
  createTime: string;
  createUser: string;
  id: string;
  name: string;
  status: number;
  thingId: string;
  typeName: string;
  updateTime: string;
  updateUser: string;
  version: string;
}

const Groupdetail = () => {
  const [chat, setChat] = useState(chatCtrl.chat);
  const refreshUI = () => {
    setChat(deepClone(chatCtrl.chat));
  };

  useEffect(() => {
    const id = chatCtrl.subscribe(refreshUI);
    return () => {
      chatCtrl.unsubscribe(id);
    };
  }, []);
  // const { clearMsgCallback } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 邀请好友
  const [isShiftUp, setIsShiftUp] = useState<boolean>(false); // 移出群聊
  const [state, setState] = useState<any>({
    userList: [], //群成员
    total: 0, //总数
    isEditNickName: false, //是否编辑昵称
    isQunName: false, //是否编辑群名称
    isIgnoreMsg: false, //是否免打扰信息
    isStick: false, //是否置顶
    friendsData: [], // 我的好友
    ids: [], // 所选择到的好友id列表
    delfriendsData: [], // 群聊人员
    delids: [], // 所选择到的好友id列表 移出
  });

  // 邀请入群
  const openDialogAdd = () => {
    setIsModalOpen(true);
    chat.chats.forEach((item: any) => {
      if (item.id === chat.userId) {
        state.friendsData = item.chats.filter((c: any) => {
          if (c.typeName === '人员') {
            let exist = false;
            chat.qunPersons.forEach((p: any) => {
              if (c.id === p.id) {
                exist = true;
              }
            });
            return !exist;
          }
          return false;
        });
      }
    });
  };

  // 邀请确认
  const handleOk = async () => {
    setIsModalOpen(false);
    const { data, code } = await CohortServers.getpullPerson({
      id: chat.curChat?.id,
      targetIds: state.ids,
    });
    if (code === 200) {
      message.success('邀请成功');
      chat.getPersons(true);
    } else {
      message.warning('您不是群管理员');
    }
  };
  // 移出确认
  const handleMoveOk = async () => {
    setIsShiftUp(false);
    const { data, code } = await CohortServers.getremovePerson({
      id: chat.curChat?.id,
      targetIds: state.delids,
    });
    if (code === 200) {
      message.success('移出成功');
      chat.getPersons(true);
    } else {
      message.warning('您不是群管理员');
    }
  };
  // 取消
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsShiftUp(false);
  };
  // 添加选择人员事件
  const onClickBox = (item: itemResult, index: number) => {
    if (state?.ids.indexOf(item.id) !== -1) {
      setState({ ...state, ids: state?.ids.filter((v: any) => v.id === item.id) });
    } else {
      setState({ ...state, ids: [...state.ids, item.id] });
    }
  };

  // 移出选择人员事件
  const onClickBoxDel = (item: itemResult, index: number) => {
    if (state.delids.indexOf(item.id) !== -1) {
      setState({ ...state, delids: state?.delids.filter((v: any) => v.id === item.id) });
    } else {
      setState({ ...state, delids: [...state.delids, item.id] });
    }
  };
  // 头像
  const heads = (
    <Row style={{ paddingBottom: '12px' }}>
      <Col span={4}>
        <HeadImg name={chat?.target.name} label={''} />
      </Col>
      <Col span={20}>
        <h4 className={detailStyle.title}>
          {chat?.target.name}
          {chat?.target.typeName !== '人员' ? (
            <span className={detailStyle.number}>({chat?.personCount})</span>
          ) : (
            ''
          )}
        </h4>
        <div className={detailStyle.base_info_desc}>{chat?.target.remark}</div>
      </Col>
    </Row>
  );
  // 群组成员
  const grouppeoples = (
    <>
      {chat?.persons.map((item: any) => {
        return (
          <div key={item.id} title={item.name} className={detailStyle.show_persons}>
            <HeadImg name={item.name} label={''} />
            <span className={detailStyle.img_list_con_name}>{item.name}</span>
          </div>
        );
      })}
      {chat?.target.typeName === '群组' ? (
        <>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              // openDialogAdd();
            }}>
            +
          </div>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              // openDialogDel();
              // setIsShiftUp(true);
            }}>
            -
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );

  return (
    <>
      <div className={detailStyle.group_detail_wrap}>
        {heads}
        <div className={detailStyle.user_list}>
          <div className={`${detailStyle.img_list} ${detailStyle.con}`}>
            {grouppeoples}
            {chat?.personCount ?? 0 > 1 ? (
              <span
                className={`${detailStyle.img_list} ${detailStyle.more_btn}`}
                onClick={() => {
                  chatCtrl.refChat(chat)?.deleteMessage('');
                }}>
                查看更多
                <span className={detailStyle.more_btn_icon}>
                  <DownOutlined />
                </span>
              </span>
            ) : (
              ''
            )}
          </div>
          {chat?.target.typeName === '群组' ? (
            <>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊名称</span>
                <span className={detailStyle.con_value}>{chat?.target.remark}</span>
              </div>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊描述</span>
                <span className={detailStyle.con_value}>{chat?.target.remark}</span>
              </div>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>我在本群的昵称</span>
                <span className={detailStyle.con_value}>测试昵称</span>
              </div>
            </>
          ) : (
            ''
          )}
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>消息免打扰</span>
            <Checkbox />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>{chat?.target.typeName !== '人员' ? '置顶群聊' : '置顶聊天'}</span>
            <Checkbox />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>查找聊天记录</span>
            <RightOutlined />
          </div>
        </div>
        {chat?.spaceId === chatCtrl.userId ? (
          <div className={`${detailStyle.footer} ${detailStyle.group_detail_wrap}`}>
            <Button
              type="primary"
              onClick={() => {
                chatCtrl.refChat(chat)?.clearMessage();
              }}>
              清空聊天记录
            </Button>
            {chat?.target.typeName === '群组' ? (
              <>
                <Button type="primary" danger>
                  退出该群
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" danger>
                  删除好友
                </Button>
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal>
        <div className={detailStyle.invitateBox}>
          {state.friendsData?.length > 0 ? (
            <>
              {state.friendsData?.map((item: any, index: any) => {
                return (
                  <div
                    key={item.id}
                    className={`${detailStyle.invitateBox} ${detailStyle.box}`}
                    onClick={() => {
                      onClickBox(item, index);
                    }}>
                    <div className={`${detailStyle.invitateBox} ${detailStyle.flex}`}>
                      <HeadImg name={item?.name} label={''} />
                      <div className={`${detailStyle.invitateBox} ${detailStyle.name}`}>
                        {item.name}
                      </div>
                    </div>
                    <div
                      className={`${detailStyle.invitateBox} ${detailStyle.btn}`}
                      style={{
                        backgroundColor: `${
                          state?.ids.includes(item.id) ? '#466DFF' : ''
                        }`,
                      }}>
                      {state?.ids.includes(item.id) ? (
                        <div
                          className={`${detailStyle.invitateBox} ${detailStyle.btn} ${detailStyle.in}`}></div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <Empty description={<span>暂无可拉取好友</span>} />
          )}
        </div>
      </Modal>
      <Modal>
        <div className={detailStyle.invitateBox}>
          <>
            {chat?.persons.map((item: any, index: any) => {
              return (
                <div
                  key={item.id}
                  className={`${detailStyle.invitateBox} ${detailStyle.box}`}
                  onClick={() => {
                    onClickBoxDel(item, index);
                  }}>
                  <div className={`${detailStyle.invitateBox} ${detailStyle.flex}`}>
                    <HeadImg name={item?.name} label={''} />
                    <div className={`${detailStyle.invitateBox} ${detailStyle.name}`}>
                      {item.name}
                    </div>
                  </div>
                  <div
                    className={`${detailStyle.invitateBox} ${detailStyle.btn}`}
                    style={{
                      backgroundColor: `${
                        state?.delids.includes(item.id) ? '#466DFF' : ''
                      }`,
                    }}>
                    {state?.delids.includes(item.id) ? (
                      <div
                        className={`${detailStyle.invitateBox} ${detailStyle.btn} ${detailStyle.in}`}></div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              );
            })}
          </>
        </div>
      </Modal>
    </>
  );
};
export default Groupdetail;
