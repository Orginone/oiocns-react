import React, { useEffect, useState } from 'react';
import Activity, { ActivityItem } from '@/components/Activity';
import cls from './index.module.less';
import { IActivity } from '@/ts/core';
import { Resizable } from 'devextreme-react';

const GroupActivityItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const [key, setKey] = useState(activity.key);
  const [current, setCurrent] = useState<IActivity>(activity);
  useEffect(() => {
    const id = activity.subscribe((key) => {
      setKey(key);
    });
    return () => {
      activity.unsubscribe(id);
    };
  }, []);
  return (
    <div className={cls.content}>
      <Resizable handles={'right'}>
        <div key={key} className={cls.groupList}>
          {activity.activitys
            .filter((activity) => activity.activityList.length > 0)
            .map((activity) => {
              if (activity.activityList.length > 0) {
                return (
                  <div
                    className={cls.groupListItem}
                    key={activity.key}
                    onClick={() => setCurrent(activity)}>
                    <ActivityItem
                      item={activity.activityList[0]}
                      activity={activity}
                      hideResource
                    />
                  </div>
                );
              }
            })}
        </div>
      </Resizable>
      <div style={{ height: '100%', width: '100%' }}>
        <Activity
          height={'calc(100vh - 355px)'}
          activity={current}
          title={current.name + '动态'}></Activity>
      </div>
    </div>
  );
};

export default GroupActivityItem;
