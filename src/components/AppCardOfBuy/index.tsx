/* eslint-disable no-unused-vars */
import React from 'react';
import { CheckCard } from '@ant-design/pro-components';
import { Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { MarketTypes } from 'typings/marketType';

import appImg from '@/assets/img/appLogo.png';

interface BuyAppType {
  className?: string;
  showBtn?: boolean; //是否展示按钮
  data: any; //数据源
  defaultKey?: any;
  shouOperation?: boolean; //是否展示 右上角操作按钮
  handleBuyApp: (_type: 'buy' | 'join', item: BuyAppType['data']) => void;
  onClick?: (e?: Event) => void; //卡片点击事件
  operation?: (_item: MarketTypes.ProductType) => MarketTypes.OperationType[]; //操作区域数据
}
const defaultObj = {
  name: 'name', //名称
  size: 'size', //大小
  type: 'type', //是否免费
  desc: 'desc', //描述
  typeName: 'typeName', //应用类型
  creatTime: 'creatTime', //上架时间
};
const Index: React.FC<BuyAppType> = (props) => {
  const {
    data,
    className,
    showBtn = true,
    shouOperation = false,
    defaultKey,
    onClick,
    operation,
    handleBuyApp,
  } = props;
  const {
    name = 'name',
    size = 'size',
    type = 'type',
    desc = 'desc',
    typeName = 'typeName',
    creatTime = 'creatTime',
  } = { ...defaultObj, ...defaultKey };
  /**
   * @desc: 操作按钮区域
   * @param {any} item - 表格单条数据 data
   * @return {Menu} - 渲染 按钮组
   */
  const menu = () => {
    return <Menu items={operation && operation(data)} />;
  };
  function renderName() {
    return (
      <>
        <span className={cls.nameLabel}>{data[name]}</span>
        {shouOperation ? (
          <Dropdown overlay={menu} placement="bottom">
            <EllipsisOutlined className={cls.operationBtn} />
          </Dropdown>
        ) : (
          ''
        )}
      </>
    );
  }
  function renderDesc() {
    return (
      <div>
        <p className="app-desc">{data[desc] || '暂无描述'}</p>
        {showBtn ? (
          <p className={cls.btnBox}>
            <Button
              className={cls.btn}
              shape="round"
              onClick={() => handleBuyApp('join', data)}>
              加入购物车
            </Button>
            <Button
              className={cls.btn}
              shape="round"
              onClick={() => handleBuyApp('buy', data)}>
              获取
            </Button>
          </p>
        ) : (
          ''
        )}
      </div>
    );
  }
  function renderTitle() {
    return (
      <div className={cls.cardTitle}>
        <img style={{ width: 60, height: 60 }} src={appImg} alt="" />
        <span className={cls.version}>V 0.0.1</span>
      </div>
    );
  }

  return (
    <>
      <CheckCard
        avatar={renderTitle()}
        title={renderName()}
        className={`${cls.buyCard} ${className}`}
        description={renderDesc()}
        onClick={onClick}></CheckCard>
    </>
  );
};

export default Index;
