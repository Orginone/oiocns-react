import React, { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import CardOrTable from '@/components/CardOrTableComp';
import TitleButton from './TitleButton';
import cls from './index.module.less';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';

/**
 * @description: 购物车
 * @return {*}
 */

const ShopingCar: React.FC = () => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项
  const [shopList, setShopList] = useState<any>([]); // 购物车列表
  useEffect(() => {
    const id = marketCtrl.subscribePart(MarketCallBackTypes.ApplyData, () => {
      console.log('监听 购物车变化', marketCtrl.shopinglist || []);
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
  console.log('被勾选中的项', selectedRowKey);

  return (
    <React.Fragment>
      <TitleButton />
      <div className={cls['shoping-car']}>
        <CardOrTable
          dataSource={shopList}
          rowKey={'id'}
          hideOperation={true}
          columns={columns as any}
          rowSelection={rowSelection}
        />
      </div>
    </React.Fragment>
  );
};

export default ShopingCar;
