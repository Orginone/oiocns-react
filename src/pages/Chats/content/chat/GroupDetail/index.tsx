import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import detailStyle from './index.module.less';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { getUuid } from '@/utils/tools';
import { IChat } from '@/ts/core/target/chat/ichat';

const Groupdetail: React.FC<any> = ({ chat }: { chat: IChat }) => {
  const [open, setOpen] = useState<boolean>(false); // 邀请弹窗开关
  const [removeOpen, setRemoveOpen] = useState<boolean>(false); // 移出弹窗开关
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>([]); // 需要邀请的部门成员
  const [removePerosn, setRemovePerosn] = useState<any>();

  /** 查找群 */
  const findCohort = async () => {
    const res = await orgCtrl.user.getCohorts(false);
    for (const item of res) {
      if (item.id === chat.chatId) {
        return item;
      }
    }
  };

  /**
   * @description: 邀请确认
   * @return {*}
   */
  const onOk = async () => {
    if (selectPerson) {
      let ids: string[] = [];
      selectPerson.forEach((item) => {
        ids.push(item?.id);
      });
      (await findCohort())?.pullMembers(ids, selectPerson[0].typeName);
    }
    setOpen(false);
  };

  const changeSilence = (e: any) => {};

  /**
   * @description: 移除确认
   * @return {*}
   */
  const onRemoveOk = async () => {
    setRemoveOpen(false);
    if (selectPerson) {
      let ids: string[] = [];
      selectPerson.forEach((item) => {
        ids.push(item?.id);
      });
      (await findCohort())?.removeMembers(ids, selectPerson[0].typeName);
    }
  };

  /**
   * @description: 取消
   * @return {*}
   */
  const onCancel = () => {
    setOpen(false);
    setRemoveOpen(false);
  };
  /**
   * @description: 头像
   * @return {*}
   */
  const heads = (
    <Row style={{ paddingBottom: '12px' }}>
      <Col span={4}>
        <div style={{ color: '#888', width: 42 }}>
          <TeamIcon share={chat.shareInfo} size={32} fontSize={28} />
        </div>
      </Col>
      <Col span={20}>
        <h4 className={detailStyle.title}>
          {chat.target.name}
          {chat.target.typeName !== '人员' ? (
            <span className={detailStyle.number}>({chat.personCount})</span>
          ) : (
            ''
          )}
        </h4>
        <div className={detailStyle.base_info_desc}>{chat.target.remark}</div>
      </Col>
    </Row>
  );

  /**
   * @description: 群组成员
   * @return {*}
   */
  const grouppeoples = (
    <>
      {chat.persons.map((item) => {
        return (
          <div key={getUuid()} title={item.name} className={detailStyle.show_persons}>
            <TeamIcon
              size={36}
              preview
              share={orgCtrl.provider.findUserById(item.id)}
              fontSize={32}
            />
            <Typography className={detailStyle.img_list_con_name}>{item.name}</Typography>
          </div>
        );
      })}
      {chat.target.typeName === '群组' ? (
        <>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setOpen(true);
              setRemovePerosn(undefined);
            }}>
            +
          </div>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setRemoveOpen(true);
              setRemovePerosn(chat.persons);
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
            {chat.personCount ?? 0 > 1 ? (
              <span
                className={`${detailStyle.img_list} ${detailStyle.more_btn}`}
                onClick={async () => {
                  await chat.morePerson('');
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
          {chat.target.typeName === '群组' ? (
            <>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊名称</span>
                <span className={detailStyle.con_value}>{chat.target.remark}</span>
              </div>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊描述</span>
                <span className={detailStyle.con_value}>{chat.target.remark}</span>
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
            <Checkbox onChange={changeSilence} />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>{chat.target.typeName !== '人员' ? '置顶群聊' : '置顶聊天'}</span>
            <Checkbox
              onChange={() => {
                chat.isToping = true;
              }}
              checked={chat.isToping}
            />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>查找聊天记录</span>
            <RightOutlined />
          </div>
        </div>
        {chat.spaceId === chat.userId ? (
          <div className={`${detailStyle.footer} `}>
            <Button
              block
              type="primary"
              size={'large'}
              onClick={async () => {
                await chat.clearMessage();
              }}>
              清空聊天记录
            </Button>
            {chat.target.typeName === '群组' ? (
              <>
                <Button type="primary" danger size={'large'} block>
                  退出该群
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" danger size={'large'} block>
                  删除好友
                </Button>
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      {/* 邀请成员 */}
      {/* <InviteMembers
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        title="邀请成员"
        setSelectPerson={setSelectPerson}
      /> */}
      <Modal
        title={'邀请成员'}
        destroyOnClose
        open={open}
        width={1024}
        onOk={onOk}
        onCancel={onCancel}>
        <AssignPosts searchFn={setSelectPerson} />
      </Modal>
      {/* 移出成员 */}
      {/* <RemoveMember
        title="移出成员"
        open={removeOpen}
        onOk={onRemoveOk}
        onCancel={onCancel}
        setSelectPerson={setSelectPerson}
        personData={removePerosn}
      /> */}
      <Modal
        title={'移出成员'}
        destroyOnClose
        open={removeOpen}
        width={1024}
        onCancel={onCancel}
        onOk={onRemoveOk}>
        <AssignPosts searchFn={setSelectPerson} personData={removePerosn} />
      </Modal>
    </>
  );
};
export default Groupdetail;
