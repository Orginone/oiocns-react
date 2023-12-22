import React from 'react';
import orgCtrl from '@/ts/controller';
import { GroupActivity } from '@/ts/core';
import GroupActivityItem from './group';

const CohortActivity: React.FC = () => {
  const cohortActivity = new GroupActivity(
    orgCtrl.user,
    orgCtrl.chats.filter((i) => i.isMyChat && i.isGroup).map((i) => i.activity),
    false,
  );
  return <GroupActivityItem activity={cohortActivity} />;
};

export default CohortActivity;
