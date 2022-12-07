import React, { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import CardOrTable from '@/components/CardOrTableComp';
import TitleButton from './TitleButton';
import cls from './index.module.less';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import AppCard from '@/components/AppCardShopCar';
import { MarketTypes } from 'typings/marketType';
import { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';
import BuyCustomModal from '@/bizcomponents/AppTableWithBuy/BuyCustomModal';
import { message } from 'antd';

/**
 * @description: 购物车
 * @return {*}
 */

const ShopingCar: React.FC = () => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项
  const [shopList, setShopList] = useState<any>([]); // 购物车列表
  const [isBuy, setIsBuy] = useState<boolean>(false);

  /**
   * @description: 订阅购物车数据变化
   * @return {*}
   */
  useEffect(() => {
    const id = marketCtrl.subscribePart(MarketCallBackTypes.ApplyData, () => {
      // console.log('监听 购物车变化', marketCtrl.shopinglist || []);
      const arr = marketCtrl.shopinglist || [];
      setShopList([...arr]);
    });
    return () => {
      return marketCtrl.unsubscribe(id);
    };
  }, []);

  /**
   * @description: table表头配置项
   * @return {*}
   */
  const columns: ColumnsType<any> = [
    {
      title: '商品名称',
      dataIndex: ['product', 'name'],
    },
    {
      title: '商品信息',
      dataIndex: ['product', 'remark'],
    },
    {
      title: '售卖权属',
      dataIndex: 'sellAuth',
    },
    {
      title: '使用期限',
      // dataIndex: 'createTime',
    },
    {
      title: '售卖价格',
      dataIndex: 'price',
      render: (_text: string, record: any) => {
        return record.price === undefined ? '免费' : record.price;
      },
    },
    {
      title: '数量',
      // dataIndex: ['product', 'createTime'],
    },
    {
      title: '市场名称',
      dataIndex: ['product', 'belongId'],
    },
    {
      title: '市场编号',
      dataIndex: ['product', 'code'],
    },
  ];

  /**
   * @description: table复选框配置项
   * @return {*}
   */
  const rowSelection = {
    type: 'checkbox',
    hideSelectAll: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKey(selectedRows);
    },
  };

  /**
   * @description: 从购物车中删除商品
   * @return {*}
   */
  const OnDeleApply = async () => {
    await marketCtrl.deleApply(selectedRowKey);
  };

  /**
   * @description: 购买商品
   * @return {*}
   */
  const OnBuyShoping = async () => {
    await marketCtrl.buyShoping(selectedRowKey);
    setIsBuy(false);
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
    setIsBuy(true);
  };

  /**
   * @description: 取消
   * @return {*}
   */
  const OnCancel = () => {
    setIsBuy(false);
  };

  /**
   * @description: 卡片内容渲染函数
   * @param {MarketTypes} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: MarketTypes.ProductType[]): React.ReactNode[] => {
    return dataArr.map((item: MarketTypes.ProductType) => {
      return (
        <AppCard
          className="card"
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
  };

  return (
    <React.Fragment>
      <TitleButton OnDeleApply={OnDeleApply} OnBuyShoping={OnCustomBuy} />
      <div className={cls['shoping-car']}>
        <CardOrTable
          dataSource={shopList}
          rowKey={'id'}
          hideOperation={true}
          columns={columns as any}
          rowSelection={rowSelection}
          tableAlertRender={false}
          renderCardContent={renderCardFun}
        />
      </div>
      <BuyCustomModal
        title="确认订单"
        content="此操作将生成交易订单。是否确认"
        open={isBuy}
        onOk={() => {
          OnBuyShoping();
        }}
        onCancel={OnCancel}
      />
    </React.Fragment>
  );
};

export default ShopingCar;
