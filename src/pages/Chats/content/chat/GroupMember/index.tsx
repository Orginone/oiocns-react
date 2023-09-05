import React from 'react';

import cls from './index.module.less';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { Button, Typography } from 'antd';
import detailStyle from '@/pages/Chats/content/chat/GroupDetail/index.module.less';
import { XTarget } from '@/ts/base/schema';
import { AiOutlineRight } from '@/icons/ai';

const SHOW_MEMBER_COUNT = 6;
const GroupMember: React.FC<{ members: XTarget[] }> = (props) => {
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
      <Button type="text" className={cls.groupMemberMore}>
        查看更多群成员
        <AiOutlineRight />
      </Button>
    </div>
  );
};

export default GroupMember;
