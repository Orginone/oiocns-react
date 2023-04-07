import { Card, Empty, List, message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { BookType } from '../../config/menuType';
import { IChat, ITarget, TargetType } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import chatCtrl from '@/ts/controller/chat';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { UserAddOutlined, WechatOutlined } from '@ant-design/icons';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import setting from '@/ts/controller/setting';
import { XTarget } from '@/ts/base/schema';
interface IProps {
  selectMenu: MenuItemType;
}

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<IProps> = ({ selectMenu }: IProps) => {
  const [links, setLinks] = useState<IChat[]>([]);
  //根据角色查询成员
  const loadAuthorityMembers = async (
    auth: IAuthority,
    spaceId: string,
    spaceName: string,
  ) => {
    const XTargetArray = await auth.queryAuthorityPerson(userCtrl.space.id, {
      offset: 0,
      limit: 1000,
      filter: '',
    });
    const chats: IChat[] = [];
    for (const item of XTargetArray.data.result || []) {
      if (item.id != setting.user.id) {
        chats.push(
          chatCtrl.findTargetChat(
            item,
            spaceId,
            spaceName,
            spaceName === '我的' ? '好友' : '同事',
          ),
        );
      }
    }
    setLinks(chats);
  };
  //查询成员
  const loadMembers = async (
    target: ITarget,
    spaceId: string,
    spaceName: string,
    label: string,
  ) => {
    let rt = await target.loadMembers({ limit: 10000, offset: 0, filter: '' });
    const chats: IChat[] = [];
    for (const item of rt.result || []) {
      if (item.id != setting.user.id) {
        chats.push(chatCtrl.findTargetChat(item, spaceId, spaceName, label));
      }
    }
    setLinks(chats);
  };

  useEffect(() => {
    const schat = selectMenu.item.chat;
    const typeName = selectMenu.itemType.split('-')[1];
    switch (typeName) {
      case BookType.Authority:
        loadAuthorityMembers(selectMenu.item.source, schat.spaceId, schat.spaceName);
        break;
      case TargetType.Company:
      case TargetType.Hospital:
      case TargetType.University:
        loadMembers(selectMenu.item.source, schat.spaceId, schat.spaceName, '同事');
        break;
      case TargetType.Person:
        loadMembers(selectMenu.item.source, schat.spaceId, schat.spaceName, '好友');
        break;
      case TargetType.Cohort:
        loadMembers(
          selectMenu.item.source,
          schat.spaceId,
          schat.spaceName,
          schat.spaceName === '我的' ? '好友' : '同事',
        );
        break;
      default:
        loadMembers(selectMenu.item.source, schat.spaceId, schat.spaceName, '同事');
        break;
    }
  }, [selectMenu]);

  /** 加载右侧功能按钮 */
  const loadActions = (chat: IChat) => {
    const actions = [];
    const isFriends =
      setting.friends.filter((item) => item.id === chat.chatId).length > 0;
    if (isFriends || chat.target.label === '同事') {
      actions.push(
        <a
          key="打开会话"
          title="打开会话"
          onClick={async () => {
            await chatCtrl.setCurrent(chat);
          }}>
          <WechatOutlined style={{ fontSize: 18 }}></WechatOutlined>
        </a>,
      );
    }
    if (!isFriends) {
      actions.push(
        <a
          key="添加好友"
          title="添加好友"
          onClick={async () => {
            const res = await setting.user.applyFriend({
              id: chat.chatId,
              typeName: TargetType.Person,
            } as XTarget);
            res ? message.success('已提交申请') : message.error('添加失败');
          }}>
          <UserAddOutlined style={{ fontSize: 18 }} />
        </a>,
      );
    }
    return actions;
  };
  return (
    <Card>
      {links.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={links}
          renderItem={(item: IChat) => (
            <List.Item actions={loadActions(item)}>
              <List.Item.Meta
                avatar={<TeamIcon share={item.shareInfo} size={40} fontSize={40} />}
                title={
                  <div>
                    <span style={{ marginRight: 10 }}>{item.target.name}</span>
                    <Tag color="success">{item.target.label}</Tag>
                  </div>
                }
                description={item.target.remark}
              />
            </List.Item>
          )}
        />
      )}

      {links.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
  );
};
export default Book;
