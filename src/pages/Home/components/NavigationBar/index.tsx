import React, { useEffect, useState } from 'react';

import BasicTitle from '@/pages/Home/components/BaseTitle';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import { EllipsisOutlined, MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { Badge, Button, Row, Typography, message } from 'antd';
import { NavigationItem } from '../..';
import { ViewerHost } from '@/executor/open/page/view/ViewerHost';
import ViewerManager from '@/executor/open/page/view/ViewerManager';
import { getResouces } from '@/config/location';
import { generateUuid } from '@/utils/excel';
const resource = getResouces();

export const allPages: NavigationItem[] = [
  {
    key: 'workbench',
    label: '工作台',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/workbench.png`,
    component: React.lazy(() => import('../Content/WorkBench')),
  },
  {
    key: 'activity',
    label: '群动态',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/groupactivity.png`,
    component: React.lazy(() => import('../Content/Activity/cohort')),
  },
  {
    key: 'circle',
    label: '好友圈',
    type: 'inner',
    backgroundImageUrl: `/img/${resource.location}/banner/friendactivity.png`,
    component: React.lazy(() => import('../Content/Activity/friends')),
  },
];

const NavigationBar: React.FC<{
  list: NavigationItem[];
  onChange: (item: NavigationItem) => void;
}> = ({ list, onChange }) => {
  const [current, setCurrent] = useState(0);
  const [more, setMore] = useState(false);
  const [pages, setPages] = useState<IPageTemplate[]>([]);
  const mapping = (item: IPageTemplate) => {
    const navigation: NavigationItem = {
      key: generateUuid(),
      label: item.name,
      backgroundImageUrl: '',
      type: 'page',
      component: <ViewerHost ctx={{ view: new ViewerManager(item) }} />,
    };
    return navigation;
  };
  useEffect(() => {
    const id = command.subscribeByFlag('pages', async () => {
      setPages(await orgCtrl.loadPages());
    });
    return () => {
      command.unsubscribeByFlag(id);
    };
  }, []);
  const regularNavigation = (
    <>
      <div className="navigationBar-content">
        {[
          ...list,
          ...pages.filter((item) => item.cache.tags?.includes('常用')).map(mapping),
        ].map((item, index) => {
          return (
            <div
              key={item.key}
              className={
                current === index
                  ? 'navigationBar-content__itemActive'
                  : 'navigationBar-content__item'
              }
              onClick={() => {
                setCurrent(index);
                onChange(item);
              }}>
              {item.label}
            </div>
          );
        })}
      </div>
      <EllipsisOutlined
        onClick={() => {
          setMore(true);
        }}
        className="navigationBar-more"
      />
    </>
  );

  const configNavigation = (
    <>
      <div className="navigationBar-config">
        <div className="navigationBar-config-header">
          <BasicTitle title="页面管理"></BasicTitle>
          <Button type="primary" onClick={() => onSave()}>
            保存
          </Button>
        </div>
        <div className="navigationBar-config-section">
          <Typography.Title level={5}>常用页面</Typography.Title>
          <Row gutter={[16, 16]}>
            {pages
              .filter((item) => item.cache.tags?.includes('常用'))
              .map((item, index) => {
                return (
                  <Badge
                    count={
                      <MinusCircleFilled
                        onClick={() => {
                          removeRegularNavigationItem(item);
                        }}
                        style={{ color: 'red' }}
                      />
                    }
                    key={index}>
                    <div className="navigationBar-config-page-card">{item.name}</div>
                  </Badge>
                );
              })}
          </Row>
        </div>
        <div className="navigationBar-config-section">
          <Typography.Title level={5}>全部页面</Typography.Title>
          <Row gutter={[16, 16]}>
            {pages.map((item, index) => {
              return (
                <Badge
                  count={
                    item.cache.tags?.includes('常用') ? (
                      0
                    ) : (
                      <PlusCircleFilled
                        onClick={() => {
                          addRegularNavigationItem(item);
                        }}
                        style={{ color: 'blue' }}
                      />
                    )
                  }
                  key={index}>
                  <div className="navigationBar-config-page-card">{item.name}</div>
                </Badge>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );

  const removeRegularNavigationItem = (item: IPageTemplate) => {
    item.cache.tags = item.cache.tags?.filter((i) => i != '常用');
    item.cacheUserData(true);
    message.success('移除页面');
  };

  const addRegularNavigationItem = (item: IPageTemplate) => {
    item.cache.tags = item.cache.tags || [];
    item.cache.tags.push('常用');
    item.cacheUserData(true);
    message.success('添加页面');
  };

  const onSave = () => {
    message.success('保存成功');
    setMore(false);
  };
  return (
    <div className={`navigationBar ${more && 'navigationBar-open'}`}>
      {more ? configNavigation : regularNavigation}
    </div>
  );
};

export default NavigationBar;
