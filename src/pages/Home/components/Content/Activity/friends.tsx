import React from 'react';
import orgCtrl from '@/ts/controller';
import { GroupActivity } from '@/ts/core';
import GroupActivityItem from './group';

const FriendsActivity: React.FC = () => {
  const friendsActivity = new GroupActivity(
    orgCtrl.user,
    [orgCtrl.user.session.activity, ...orgCtrl.user.memberChats.map((i) => i.activity)],
    true,
  );
  return <GroupActivityItem activity={friendsActivity} />;
};

export default FriendsActivity;
