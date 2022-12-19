import React, { useState, useEffect } from 'react';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import AppCard from '../components/AppCardShopCar';
import { MarketTypes } from 'typings/marketType';
import { Button, Col, Layout, message, Modal, PageHeader, Row, Space } from 'antd';
import { CheckCircleOutlined, ClearOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import cls from './index.module.less';
import { XMerchandise } from '@/ts/base/schema';
import { JOIN_SHOPING_CAR } from '@/constants/const';

/**
 * @description: 购物车
 * @return {*}
 */

const ShopingCar: React.FC = () => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项
  const [shopList, setShopList] = useState<any>([]); // 购物车列表

  /**
   * @description: 订阅购物车数据变化
   * @return {*}
   */
  useEffect(() => {
    const id = marketCtrl.subscribePart(JOIN_SHOPING_CAR, () => {
      console.log('监听 购物车变化', marketCtrl.shopinglist || []);
      const arr = marketCtrl.shopinglist || [];
      setShopList([...arr]);
    });

    return () => {
      return marketCtrl.unsubscribe(id);
    };
  }, []);

  /**
   * @description: 从购物车中删除商品
   * @return {*}
   */
  const OnDeleApply = async (ids?: string[]) => {
    if (!ids && selectedRowKey.length === 0) {
      message.warning('没有需要删除的商品');
      return;
    }
    await marketCtrl.deleteStaging(ids ? ids : selectedRowKey);
    setSelectedRowKey([]);
  };

  /**
   * @description: 确认下单弹窗
   * @return {*}
   */
  const OnCustomBuy = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请选择商品');
      return;
    }
    Modal.confirm({
      title: '确认订单',
      content: '此操作将生成交易订单。是否确认',
      icon: <CheckCircleOutlined className={cls['buy-icon']} />,
      onOk: async () => await marketCtrl.createOrder(selectedRowKey),
    });
  };

  /**
   * @description: 卡片内容渲染函数
   * @param {MarketTypes} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: MarketTypes.ProductType[]) => {
    if (dataArr) {
      return dataArr.map((item: MarketTypes.ProductType) => {
        return (
          <AppCard
            className={cls.card}
            data={item}
            key={item.id}
            defaultKey={{
              name: 'caption',
              size: 'price',
              type: 'sellAuth',
              desc: 'remark',
              creatTime: 'createTime',
            }}
            // operation={renderOperation}
          />
        );
      });
    }
    return <></>;
  };

  return (
    <Layout style={{ height: '100%' }} className={cls.drawerContainer}>
      <PageHeader
        className={cls.header}
        subTitle="购物车"
        extra={
          <Button
            type="text"
            className={cls.clearShop}
            onClick={() => {
              OnDeleApply(shopList.map((n: XMerchandise) => n.id));
            }}
            icon={<ClearOutlined />}>
            清除购物车
          </Button>
        }
      />
      <CheckCard.Group
        multiple
        className={cls['shoping-car']}
        onChange={(value) => {
          // console.log('value', value);
          setSelectedRowKey(value);
        }}
        value={selectedRowKey}>
        {shopList && renderCardFun(shopList)}
      </CheckCard.Group>
      <Row className={cls.footer} justify="space-between">
        <Col span={12}>
          <div
            className={`${cls.allCheck} ${
              selectedRowKey.length === shopList.length ? cls.active : ''
            }`}
            onClick={() => {
              if (selectedRowKey.length === shopList.length) {
                setSelectedRowKey([]);
              } else {
                setSelectedRowKey(shopList.map((n: XMerchandise) => n.id));
              }
            }}>
            全选
          </div>
        </Col>
        <Col span={12}>
          <Space>
            <Button type="text" danger onClick={() => OnDeleApply()}>
              删除
            </Button>
            <Button type="primary" onClick={() => OnCustomBuy()}>
              下单
            </Button>
          </Space>
        </Col>
      </Row>
    </Layout>
  );
};

export default ShopingCar;
