/* eslint-disable no-unused-vars */
import React from 'react';
import { CheckCard } from '@ant-design/pro-components';
import { Dropdown, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { common } from 'typings/common';
import appImg from '/img/appLogo.svg';
import { XMerchandise } from '@/ts/base/schema';

interface Iprops {
  className?: string;
  showBtn?: boolean; //是否展示按钮
  data: XMerchandise; //数据源
  defaultKey?: any;
  shouOperation?: boolean; //是否展示 右上角操作按钮
  // handleBuyApp?: (_type: 'buy' | 'join', item: BuyAppType['data']) => void;
  onClick?: (e?: Event) => void; //卡片点击事件
  operation?: (_item: XMerchandise) => common.OperationType[]; //操作区域数据
}

const AppCardShopCar: React.FC<Iprops> = (props) => {
  const { data, className, shouOperation = false, onClick, operation } = props;

  function renderName() {
    return (
      <>
        <span className={cls.nameLabel}>{data.caption}</span>
        {shouOperation ? (
          <Dropdown menu={{ items: operation && operation(data) }} placement="bottom">
            <EllipsisOutlined className={cls.operationBtn} />
          </Dropdown>
        ) : (
          ''
        )}
      </>
    );
  }

  function renderTitle() {
    return (
      <div className={cls.cardTitle}>
        <img style={{ width: 60, height: 60 }} src={appImg} alt="" />
        {/* <span className={cls.version}>V 0.0.1</span> */}
      </div>
    );
  }

  return (
    <CheckCard
      size="small"
      bordered={false}
      avatar={renderTitle()}
      title={renderName()}
      className={`${cls.buyCard} ${className}`}
      description={
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
          {data.information || '暂无描述'}
        </Typography.Paragraph>
      }
      onClick={onClick}
      value={data}
    />
  );
};

export default AppCardShopCar;
