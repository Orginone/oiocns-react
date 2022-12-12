// const res = ;
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardOfBuy';
import { common } from 'typings/common';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import ProductDetailModal from '@/components/ProductDetailModal';
import BuyCustomModal from '../components/BuyCustomModal';
import MarketClassify from '../components/Classify';
import ReactDOM from 'react-dom';
import { XMerchandise } from '@/ts/base/schema';
import { Modal } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IMarket } from '@/ts/core';

const AppShowComp: React.FC = () => {
  const [isProduce, setIsProduce] = useState<boolean>(false); // 查看详情
  const [detail, setDetail] = useState<XMerchandise>(); // 查看详情
  const [isBuy, setIsBuy] = useState<boolean>(false); // 立即购买弹窗
  const [nowBuy, setNowBuy] = useState<any>([]); // 立即购买
  const parentRef = useRef<any>(null); //父级容器Dom
  const treeContainer = document.getElementById('templateMenu');
  const [key] = useCtrlUpdate(marketCtrl);
  const [current, setCurrent] = useState<IMarket>();

  useEffect(() => {
    setTimeout(async () => {
      const markets = marketCtrl.Market.joinedMarkets;
      if (markets.length > 0) {
        const index = markets.findIndex((i) => {
          return i.market.id === current?.market.id;
        });
        if (index < 0) {
          setCurrent(markets[0]);
        }
      } else {
        setCurrent(undefined);
      }
    }, 100);
  }, [key]);
  /**
   * @desc: 处理购买 函数
   * @param {'buy' | 'join'} type
   * @param {XMerchandise} selectItem
   * @return {*}
   */
  const handleBuyAppFun = (type: 'buy' | 'join', selectItem: any) => {
    if (type === 'join') {
      marketCtrl.joinApply(selectItem);
    } else {
      setIsBuy(true);
    }
  };

  /**
   * @description: 关闭详情
   * @return {*}
   */
  const onClose = () => {
    setIsProduce(false);
  };

  /**
   * @description: 取消订单
   * @return {*}
   */
  const onCancel = () => {
    setIsBuy(false);
  };

  /**
   * @description: 购买商品
   * @return {*}
   */
  const OnBuyShoping = async () => {
    await marketCtrl.buyShoping(nowBuy);
    setIsBuy(false);
  };

  // 操作内容渲染函数
  const renderOperation = (item: XMerchandise): common.OperationType[] => {
    return [
      {
        key: 'buy',
        label: '立即购买',
        onClick: () => {
          setIsBuy(true);
          setNowBuy([item]);
        },
      },
      {
        key: 'toBuyCar',
        label: '加入购物车',
        onClick: () => {
          marketCtrl.joinApply(item);
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          setIsProduce(true);
          setDetail(item);
        },
      },
      {
        key: 'downProduct',
        label: '下架',
        onClick: () => {
          Modal.confirm({
            title: '提示',
            content: '是否确认下架《' + item.caption + '》商品',
            onOk: () => {
              current?.unPublish(item.id);
            },
          });
          setDetail(item);
        },
      },
    ];
  };

  /**
   * @desc:卡片内容渲染函数
   * @param {MarketTypes.ProductType[]} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: XMerchandise[]): React.ReactNode[] => {
    return dataArr.map((item: any) => {
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
          operation={renderOperation}
          handleBuyApp={handleBuyAppFun}
        />
      );
    });
  };
  return (
    <div className={`${cls['app-wrap']} ${cls['market-public-wrap']}`} ref={parentRef}>
      <CardOrTable<XMerchandise>
        dataSource={[]}
        stripe
        headerTitle={current?.market.name}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        columns={marketCtrl.getColumns('market')}
        rowKey={'id'}
        request={async (page) => {
          return await current?.getMerchandise(page);
        }}
      />
      <ProductDetailModal
        open={isProduce}
        title="应用详情"
        onClose={onClose}
        data={detail}
      />
      <BuyCustomModal
        open={isBuy}
        title="确认订单"
        onOk={OnBuyShoping}
        onCancel={onCancel}
        content="此操作将生成交易订单。是否确认"
      />

      {treeContainer
        ? ReactDOM.createPortal(
            <MarketClassify tkey={key} current={current} setCurrent={setCurrent} />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default AppShowComp;
