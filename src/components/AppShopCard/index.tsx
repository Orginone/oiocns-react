/* eslint-disable no-unused-vars */
import React from 'react';
import { CheckCard } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { common } from 'typings/common';
import appImg from '/img/appLogo.svg';
import { XMerchandise } from '@/ts/base/schema';

interface IProps {
  className?: string;
  showBtn?: boolean; //是否展示按钮
  current: XMerchandise; //数据源
  showOperation?: boolean; //是否展示 右上角操作按钮
  onClick?: (e?: Event) => void; //卡片点击事件
  operation?: (_item: XMerchandise) => common.OperationType[]; //操作区域数据
  handleBuyApp: (_type: 'buy' | 'join', item: XMerchandise) => void;
}

const AppShopCard: React.FC<IProps> = (props) => {
  const {
    current,
    className,
    showBtn = true,
    showOperation = false,
    onClick,
    operation,
    handleBuyApp,
  } = props;

  const renderName = () => {
    return (
      <>
        <span className={cls.nameLabel}>{current.caption}</span>
        {showOperation && operation && (
          <Dropdown menu={{ items: operation(current) }} placement="bottom">
            <EllipsisOutlined className={cls.operationBtn} />
          </Dropdown>
        )}
      </>
    );
  };

  const renderDesc = () => {
    return (
      <div>
        <p className="app-desc">{current.information || '暂无描述'}</p>
        {showBtn ? (
          <p className={cls.btnBox}>
            <Button
              className={cls.btn}
              shape="round"
              onClick={() => handleBuyApp('join', current)}>
              加入购物车
            </Button>
            <Button
              className={cls.btn}
              shape="round"
              onClick={() => handleBuyApp('buy', current)}>
              获取
            </Button>
          </p>
        ) : (
          ''
        )}
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <div className={cls.cardTitle}>
        <img style={{ width: 60, height: 60 }} src={appImg} alt="" />
        <span className={cls.version}>V 0.0.1</span>
      </div>
    );
  };

  return (
    <CheckCard
      avatar={renderTitle()}
      title={renderName()}
      className={`${cls.buyCard} ${className}`}
      description={renderDesc()}
      onClick={onClick}
    />
  );
};

export default AppShopCard;
