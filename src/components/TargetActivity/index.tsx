import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { Button, Card, Empty } from 'antd';
import { IActivity } from '@/ts/core';
import { ScrollView } from 'devextreme-react';
import dxScrollView from 'devextreme/ui/scroll_view';
import ActivityMessage from './ActivityMessage';
import { command } from '@/ts/base';

interface ActivityProps {
  height: number | string;
  activity: IActivity;
  title?: string;
}

/** 动态 */
const TargetActivity: React.FC<ActivityProps> = ({ height, activity, title }) => {
  const ActivityBody: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const [actionList, setActivityList] = useState(activity.activityList);
    useEffect(() => {
      const id = activity.subscribe(() => {
        setActivityList([...activity.activityList]);
      });
      return () => {
        activity.unsubscribe(id);
      };
    }, [activity]);
    if (actionList.length > 0) {
      return actionList.map((actionItem) => (
        <ActivityMessage
          key={actionItem.key}
          item={actionItem}
          activity={actionItem.activity}></ActivityMessage>
      ));
    }
    return (
      <div className={cls.emptyList}>
        <Empty description={false}></Empty>
      </div>
    );
  };

  const loadMoreActivity = async (component: dxScrollView | undefined) => {
    const news = await activity.load(10);
    if (news.length > 0) {
      activity.changCallback();
    }
    if (component) {
      await component.release(news.length < 10);
    }
  };

  return (
    <Card
      bordered={false}
      title={title || '动态'}
      extra={
        activity.allPublish ? (
          <Button
            type="link"
            onClick={() => {
              command.emitter('executor', 'pubActivity', activity);
            }}>
            发布动态
          </Button>
        ) : (
          <></>
        )
      }>
      <ScrollView
        key={activity.key}
        bounceEnabled
        width={'100%'}
        height={height}
        reachBottomText="加载更多..."
        onReachBottom={(e) => loadMoreActivity(e.component)}
        onInitialized={(e) => loadMoreActivity(e.component)}>
        <div className={cls.actionList}>
          <ActivityBody activity={activity} />
        </div>
      </ScrollView>
    </Card>
  );
};

export default TargetActivity;
