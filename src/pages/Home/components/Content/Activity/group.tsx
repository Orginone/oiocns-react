import React, { useState } from 'react';
import TargetActivity from '@/components/TargetActivity';
import ActivityMessage from '@/components/TargetActivity/ActivityMessage';
import { IActivity, FromOrigin } from '@/ts/core';
import { Resizable } from 'devextreme-react';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
import { useMedia } from 'react-use';
const GroupActivityItem: React.FC<{ activity: IActivity; messageFrom?: FromOrigin }> = ({
  activity,
  messageFrom,
}) => {
  const [key] = useCtrlUpdate(activity);
  const isWide = useMedia('(min-width: 1000px)');
  const [loaded] = useAsyncLoad(() => activity.load(10), [activity]);
  const [current, setCurrent] = useState<IActivity>(activity);
  const loadMenus = React.useCallback(() => {
    if (!loaded || !isWide) return <></>;
    return (
      <Resizable handles={'right'} minWidth={200}>
        <div className={'groupList'}>
          {activity.activitys
            .filter((item) => item.activityList.length > 0)
            .map((item) => {
              if (item.activityList.length > 0) {
                const _seleted = item.id === current.id ? 'groupList-selected' : '';
                return (
                  <div
                    className={`groupList-item ${_seleted}`}
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
    );
  }, [loaded, current, activity, key, isWide]);

  const loadContext = React.useCallback(() => {
    if (!loaded) return <></>;
    return (
      <div className={'loadContext'}>
        <TargetActivity
          height={'calc(100vh - 110px)'}
          activity={current}
          messageFrom={messageFrom}
          title={current.name + '动态'}
        />
      </div>
    );
  }, [loaded, current]);
  return (
    <div className={'activityContent'}>
      <Spin tip="加载中,请稍后..." size="large" spinning={!loaded} delay={100}>
        <div className="groupCtx">
          {loadMenus()}
          {loadContext()}
        </div>
      </Spin>
    </div>
  );
};

export default GroupActivityItem;
