import React, { useEffect, useState } from 'react';
import { XEntity } from '@/ts/base/schema';
import orgCtrl from '../../../ts/controller';

const UserInfo: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<XEntity | null>(null);
  useEffect(() => {
    orgCtrl.user.findEntityAsync(userId).then((res) => {
      res && setUser(res);
    });
  }, []);
  return user ? <span className="oio-activity-list-item-comment-list-item-content-name">{user.name}</span> : <></>;
};

export default UserInfo;
