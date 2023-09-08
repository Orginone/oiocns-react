import React, { useState } from 'react';

import cls from './index.module.less';
import { EllipsisOutlined, MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { NavigationItem } from '@/pages/Home';
import BasicTitle from '@/pages/Home/components/BaseTitle';
import { Badge, Button, message, Space, Typography } from 'antd';

const allPages: NavigationItem[] = [
  {
    key: 'activity',
    label: '群动态',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/Activity')),
  },
  {
    key: 'circle',
    label: '好友圈',
    backgroundImageUrl: '/img/banner/circle-bg.jpeg',
    component: React.lazy(() => import('@/pages/Home/components/Content/Circle')),
  },
  {
    key: 'warehouse',
    label: '公物仓',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/Warehouse')),
  },
  {
    key: 'digital-asset',
    label: '数据资产',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/DigitalAsset')),
  },
  {
    key: 'dashboard',
    label: '工作台',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/DigitalAsset')),
  },
];
const NavigationBar: React.FC<{
  list: NavigationItem[];
  onChange: (item: NavigationItem) => void;
}> = ({ list, onChange }) => {
  const [current, setCurrent] = useState(0);
  const [more, setMore] = useState(false);

  const regularNavigation = (
    <>
      <div className={cls.navigationBarContent}>
        {list.map((item, index) => {
          return (
            <div
              key={item.key}
              className={
                current === index
                  ? cls.navigationBarContent__itemActive
                  : cls.navigationBarContent__item
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
        className={cls.navigationBarMore}
      />
    </>
  );

  const configNavigation = (
    <>
      <div className={cls.navigationBarConfig}>
        <div className={cls.navigationBarConfigHeader}>
          <BasicTitle title="页面管理"></BasicTitle>
          <Button type="primary" onClick={() => onSave()}>
            保存
          </Button>
        </div>
        <div className={cls.navigationBarConfigSection}>
          <Typography.Title level={5}>常用页面</Typography.Title>
          <Space size={16}>
            {list.map((item, index) => {
              return (
                <Badge
                  count={
                    <MinusCircleFilled
                      onClick={() => {
                        removeRegularNavigationItem();
                      }}
                      style={{ color: 'red' }}
                    />
                  }
                  key={index}>
                  <div className={cls.navigationBarConfigPageCard}>{item.label}</div>
                </Badge>
              );
            })}
          </Space>
        </div>
        <div className={cls.navigationBarConfigSection}>
          <Typography.Title level={5}>全部页面</Typography.Title>
          <Space size={16}>
            {allPages.map((item, index) => {
              return (
                <Badge
                  count={
                    list.findIndex((find) => find.key === item.key) === -1 ? (
                      <PlusCircleFilled
                        onClick={() => {
                          addRegularNavigationItem();
                        }}
                        style={{ color: 'blue' }}
                      />
                    ) : (
                      0
                    )
                  }
                  key={index}>
                  <div className={cls.navigationBarConfigPageCard}>{item.label}</div>
                </Badge>
              );
            })}
          </Space>
        </div>
      </div>
    </>
  );

  const removeRegularNavigationItem = () => {
    message.success('移除页面');
  };

  const addRegularNavigationItem = () => {
    message.success('添加页面');
  };

  const onSave = () => {
    message.success('保存成功');
    setMore(false);
  };
  return (
    <div className={`${cls.navigationBar} ${more && cls.navigationBarOpen}`}>
      {more ? configNavigation : regularNavigation}
    </div>
  );
};

export default NavigationBar;
