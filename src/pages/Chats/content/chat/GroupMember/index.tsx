import React, { useState } from 'react';

import cls from './index.module.less';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { Button, Input, Typography } from 'antd';
import detailStyle from '@/pages/Chats/content/chat/GroupDetail/index.module.less';
import { XTarget } from '@/ts/base/schema';
import { RightOutlined } from '@ant-design/icons';
import FullScreenModal from '@/executor/tools/fullScreen';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const SHOW_MEMBER_COUNT = 6;
const GroupMember: React.FC<{ members: XTarget[] }> = (props) => {
  const [allMembers, setAllMembers] = useState(props.members);
  const [openModal, setOpenModal] = useState(false);
  const MemberList: React.FC<{
    memberList: XTarget[];
  }> = ({ memberList }) => {
    return (
      <div className={cls.groupMemberModelMemberList}>
        {memberList.map((item, index) => {
          return (
            <div className={cls.groupMemberList__item} key={index}>
              <EntityIcon size={45} entityId={item.id} showName></EntityIcon>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className={cls.groupMember}>
      <div className={cls.groupMemberList}>
        {props.members.slice(0, SHOW_MEMBER_COUNT).map((item, index) => {
          return (
            <div className={cls.groupMemberList__item} key={index}>
              <TeamIcon size={45} typeName={item.typeName} entityId={item.id} />
              <Typography className={detailStyle.img_list_con_name}>
                {item.name}
              </Typography>
            </div>
          );
        })}
      </div>
      {props.members.length ? (
        <Button
          type="text"
          className={cls.groupMemberMore}
          onClick={() => setOpenModal(true)}>
          查看更多群成员
          <RightOutlined />
        </Button>
      ) : (
        <></>
      )}

      <FullScreenModal
        open={openModal}
        destroyOnClose
        onCancel={() => {
          setOpenModal(false);
          setAllMembers(props.members);
        }}>
        <Input.Search
          placeholder="请输入你想搜索的用户名"
          onSearch={(input) => {
            const result = props.members.filter((item) => {
              return item.name.includes(input);
            });
            setAllMembers(result);
          }}></Input.Search>
        <MemberList memberList={allMembers}></MemberList>
      </FullScreenModal>
    </div>
  );
};

export default GroupMember;
