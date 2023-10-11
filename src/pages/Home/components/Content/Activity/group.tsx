import React, { useState } from 'react';
import Activity, { ActivityItem } from '@/components/Activity';
import cls from './index.module.less';
import { IActivity } from '@/ts/core';
import useWindowResize from '@/hooks/useWindowResize';
import { Resizable } from 'devextreme-react';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';

const GroupActivityItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const size = useWindowResize();
  const [key] = useCtrlUpdate(activity);
  const [loaded] = useAsyncLoad(() => activity.load(10));
  const [current, setCurrent] = useState<IActivity>(activity);
  return (
    <div className={cls.content}>
      <Spin tip="加载中,请稍后..." size="large" spinning={!loaded} delay={100}>
        <div className={cls.groupCtx}>
          {size.width > 1000 && loaded && (
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
          )}
          <div style={{ height: '100%', width: '100%' }}>
            {loaded && (
              <Activity
                height={'calc(100vh - 335px)'}
                activity={current}
                title={current.name + '动态'}></Activity>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default GroupActivityItem;
