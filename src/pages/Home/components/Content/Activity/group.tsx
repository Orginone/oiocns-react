import React, { useState } from 'react';
import TargetActivity from '@/components/TargetActivity';
import ActivityMessage from '@/components/TargetActivity/ActivityMessage';
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
                  .filter((item) => item.activityList.length > 0)
                  .map((item) => {
                    if (item.activityList.length > 0) {
                      return (
                        <div
                          className={cls.groupListItem}
                          key={item.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrent(item);
                          }}>
                          <ActivityMessage
                            item={item.activityList[0]}
                            activity={item}
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
              <TargetActivity
                height={'calc(100vh - 335px)'}
                activity={current}
                title={current.name + '动态'}></TargetActivity>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default GroupActivityItem;
