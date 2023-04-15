import { Avatar, Card, Empty, List, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { BookType, GroupMenuType } from '../../config/menuType';
import { ITarget, TargetType } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import chatCtrl from '@/ts/controller/chat';
import { XImMsg, XTarget } from '@/ts/base/schema';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import {
  ExclamationCircleOutlined,
  UserAddOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { kernel } from '@/ts/base';
interface IProps {
  selectMenu: MenuItemType;
  enterChat: Function;
}

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<IProps> = ({ selectMenu, enterChat }: IProps) => {
  const [links, setLinks] = useState<any[]>([]);
  const [suffixItemType, setSuffixItemType] = useState<string>();
  //聚合查询成员
  const loadGroupMembers = async () => {
    let links: any[] = [];
    let ids: string[] = [];
    for (let child of selectMenu.children) {
      let target: ITarget = child.item;
      let rt = await target.loadMembers({ limit: 10000, offset: 0, filter: '' });
      let resultLinks = rt.result || [];
      let childLink = [];
      for (let resultLink of resultLinks) {
        if (!ids.includes(resultLink.id)) {
          ids.push(resultLink.id);
          childLink.push(resultLink);
        }
      }
      links = [...links, ...childLink];
    }
    setLinks(links);
  };
  //聚合成员
  const loadMembers = async (target: ITarget) => {
    let rt = await target.loadMembers({ limit: 10000, offset: 0, filter: '' });
    setLinks(rt.result || []);
  };
  //查询置顶会话
  const loadTargetByTopChat = async () => {
    let links = [];
    let topChat = chatCtrl.chats.filter((item) => item.isToping);
    for (let chat of topChat) {
      links.push({
        id: chat.target.id,
        name: chat.shareInfo.name,
        team: { remark: chat.target.remark },
      });
    }
    setLinks(links);
  };

  function calcFrequencyValue(messages: XImMsg[]) {
    let dates = new Set<string>([]);
    for (let message of messages) {
      dates.add(message.createTime.substring(0, message.createTime.indexOf(' ')));
    }
    return dates.size;
  }

  //查询频繁会话
  const loadTargetByRecentlyChat = async () => {
    let links: any[] = [];
    let recentlyChat = chatCtrl.chats.filter(
      (item) => calcFrequencyValue(item.messages) >= 3 && item.messages.length >= 10,
    );
    for (let chat of recentlyChat) {
      links.push({
        id: chat.target.id,
        name: chat.shareInfo.name,
        team: { remark: chat.target.remark },
      });
    }
    setLinks(links);
  };

  const renderLink = async (pySegs: any) => {
    let children: MenuItemType[] = pySegs.map((pySeg: any) => {
      return {
        key: pySeg.letter,
        label: pySeg.letter,
        itemType: 'Seg',
        icon: <></>,
        item: pySeg,
        children: pySeg.data,
      };
    });
    return children;
  };

  /**添加好友 */
  const addFriend = async (item_: any) => {
    let item: XTarget;
    if (item_.createTime == undefined) {
      let targetResult = await kernel.queryTargetById({
        ids: [item_.id],
      });
      if (
        targetResult.success &&
        targetResult.data.result &&
        targetResult.data.result.length > 0
      ) {
        item = targetResult.data.result[0];
      }
    } else {
      item = item_;
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否申请添加好友',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await userCtrl.user?.applyFriend(item);
        message.success('发起申请成功');
      },
    });
  };

  useEffect(() => {
    let suffixItemType = selectMenu.itemType.replace(GroupMenuType.Books + '-', '');
    if (suffixItemType.includes(BookType.TypeGroup)) {
      suffixItemType = suffixItemType.replace(BookType.TypeGroup, '');
      setSuffixItemType(suffixItemType);
      switch (suffixItemType) {
        case BookType.UserCohort:
          loadGroupMembers();
          break;
        case TargetType.Company:
        case TargetType.Cohort:
        case TargetType.College:
        case TargetType.Major:
        case TargetType.Section:
        case TargetType.Office:
        case TargetType.Hospital:
        case TargetType.Working:
        case TargetType.University:
        case TargetType.Department:
        case TargetType.Research:
        case TargetType.JobCohort:
        case TargetType.Laboratory:
        case TargetType.Station:
          loadGroupMembers();
          break;
        default:
          message.error(suffixItemType);
          break;
      }
    } else {
      setSuffixItemType(suffixItemType);
      switch (suffixItemType) {
        case BookType.Common:
          loadTargetByTopChat();
          break;
        case BookType.RecentlyContacts:
          loadTargetByRecentlyChat();
          break;
        case BookType.NewFriend:
          loadMembers(userCtrl.user);
          break;
        case BookType.Friend:
          loadMembers(userCtrl.user);
          break;
        case BookType.UserCohort:
          loadMembers(selectMenu.item);
          break;
        case TargetType.Company:
        case TargetType.Cohort:
        case TargetType.College:
        case TargetType.Major:
        case TargetType.Section:
        case TargetType.Office:
        case TargetType.Hospital:
        case TargetType.Working:
        case TargetType.University:
        case TargetType.Department:
        case TargetType.Research:
        case TargetType.JobCohort:
        case TargetType.Laboratory:
        case TargetType.Station:
          loadMembers(selectMenu.item);
          break;
        default:
          message.error(suffixItemType);
          break;
      }
    }
  }, [selectMenu]);

  return (
    <Card>
      <div style={{ display: 'flex', fontSize: '17px', paddingLeft: '5px' }}>
        <div style={{ paddingRight: '5px' }}>{selectMenu.icon}</div>
        <div>{suffixItemType}</div>
      </div>
      {links.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={links}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <a
                  key="enterChat"
                  onClick={async () => {
                    enterChat(item.id);
                  }}>
                  <WechatOutlined style={{ fontSize: 18 }}></WechatOutlined>
                </a>,
                <a
                  key="addFriend"
                  onClick={async () => {
                    addFriend(item);
                  }}>
                  <UserAddOutlined style={{ fontSize: 18 }}></UserAddOutlined>
                </a>,
              ]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={50}
                    style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
                    src={
                      <TeamIcon
                        size={36}
                        preview
                        share={userCtrl.findTeamInfoById(item.id)}
                        fontSize={32}
                      />
                    }
                  />
                }
                title={item.name}
                description={item.team?.remark}
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
