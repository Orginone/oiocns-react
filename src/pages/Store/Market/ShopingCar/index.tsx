import React, { useState, useEffect, useRef } from 'react';
import type { ColumnsType } from 'antd/es/table';
import CardOrTable from '@/components/CardOrTableComp';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import AppCard from '@/components/AppCardShopCar';
import { MarketTypes } from 'typings/marketType';
import { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';
import { message, Modal, Space } from 'antd';
import cls from './index.module.less';
import { CheckCircleOutlined } from '@ant-design/icons';

/**
 * @description: 购物车
 * @return {*}
 */

const ShopingCar: React.FC = () => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项
  const [shopList, setShopList] = useState<any>([]); // 购物车列表
  const parentRef = useRef<any>(null); // 获取table表格父级高度

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
    alwaysShowAlert: true,
    type: 'checkbox',
    hideSelectAll: true,
    onChange: (_selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKey(selectedRows);
    },
  };

  /**
   * @description: 从购物车中删除商品
   * @return {*}
   */
  const OnDeleApply = async () => {
    if (selectedRowKey.length === 0) {
      message.warning('没有需要删除的商品');
      return;
    }
    await marketCtrl.deleApply(selectedRowKey);
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
      onOk: async () => await marketCtrl.buyShoping(selectedRowKey),
    });
  };

  /**
   * @description: 卡片内容渲染函数
   * @param {MarketTypes} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: MarketTypes.ProductType[]): React.ReactNode[] => {
    if (dataArr) {
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
    }
    return <></>;
  };

  return (
    <React.Fragment>
      <div ref={parentRef} className={cls['shoping-car']}>
        <CardOrTable
          dataSource={shopList}
          rowKey={'id'}
          hideOperation={true}
          columns={columns as any}
          rowSelection={rowSelection}
          defaultPageType="card"
          showBtn="false"
          alwaysShowAlert={true}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a onClick={OnDeleApply}>删除</a>
                <a onClick={OnCustomBuy}>购买</a>
              </Space>
            );
          }}
          renderCardContent={renderCardFun}
          parentRef={parentRef}
        />
      </div>
    </React.Fragment>
  );
};

export default ShopingCar;
