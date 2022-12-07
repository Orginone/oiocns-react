import React from 'react';
import { Button } from 'antd';
import cls from './index.module.less';
import { LeftOutlined } from '@ant-design/icons';

/**
 * @description: 购物车Title
 * @return {*}
 */

interface Iprops {
  OnDeleApply: () => void;
  OnBuyShoping: () => void;
}

const TitleButton: React.FC<Iprops> = ({ OnDeleApply, OnBuyShoping }) => {
  /**
   * @description: 返回按钮
   * @return {*}
   */
  const backbtn = (
    <div className={cls['car-title-btn-back']}>
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => {
          history.go(-1);
        }}>
        返回
      </Button>
      <div className={cls['title-btn-baycar']}>购物车</div>
    </div>
  );
  /**
   * @description: 操作按钮
   * @return {*}
   */
  const setbtn = (
    <div className={cls['car-title-btn']}>
      <Button
        size="large"
        type="link"
        onClick={() => {
          OnDeleApply();
        }}>
        删除
      </Button>
      <Button
        size="large"
        type="link"
        onClick={() => {
          OnBuyShoping();
        }}>
        购买
      </Button>
    </div>
  );
  return (
    <div className={cls['shoping-car-title']}>
      {backbtn}
      {setbtn}
    </div>
  );
};
export default TitleButton;
