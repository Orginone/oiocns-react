// const res = ;
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppShopCard';
import { common } from 'typings/common';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import MerchandiseDetail from '../components/MerchandiseDetail';
import MarketClassify from '../components/Classify';
import ReactDOM from 'react-dom';
import { XMerchandise } from '@/ts/base/schema';
import { message, Modal } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IMarket } from '@/ts/core';
import { CheckCircleOutlined } from '@ant-design/icons';
import { marketColumns } from '../../config/columns';
import WelfareMarket from '@/pages/Welfare/WelfareOrg/WelfareMarket';

const AppShowComp: React.FC = () => {
  const [isProduce, setIsProduce] = useState<boolean>(false); // 查看详情
  const [merchandise, setMerchandise] = useState<XMerchandise>(); // 查看详情
  const parentRef = useRef<any>(null); //父级容器Dom
  const treeContainer = document.getElementById('templateMenu');
  const [key] = useCtrlUpdate(marketCtrl);
  const [current, setCurrent] = useState<IMarket>();

  useEffect(() => {
    setTimeout(async () => {
      const markets = marketCtrl.target.joinedMarkets;
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
  const handleBuyAppFun = (type: 'buy' | 'join', selectItem: XMerchandise) => {
    if (type === 'join') {
      marketCtrl.appendStaging(selectItem);
    } else {
      Modal.confirm({
        title: '确认订单',
        content: '此操作将生成交易订单。是否确认',
        icon: <CheckCircleOutlined className={cls['buy-icon']} />,
        onOk: async () => await marketCtrl.createOrder([selectItem.id]),
      });
    }
  };

  // 操作内容渲染函数
  const renderOperation = (item: XMerchandise): common.OperationType[] => {
    return [
      {
        key: 'buy',
        label: '立即购买',
        onClick: () => {
          handleBuyAppFun('buy', item);
        },
      },
      {
        key: 'toBuyCar',
        label: '加入购物车',
        onClick: () => {
          marketCtrl.appendStaging(item);
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          setMerchandise(item);
          setIsProduce(true);
        },
      },
      {
        key: 'downProduct',
        label: '下架',
        onClick: () => {
          Modal.confirm({
            title: '提示',
            content: '是否确认下架《' + item.caption + '》商品',
            onOk: async () => {
              if (await current?.unPublish(item.id)) {
                message.success('下架' + item.caption + '》商品成功');
              } else {
                message.error('下架失败');
              }
              marketCtrl.changCallback();
            },
          });
        },
      },
    ];
  };

  /**
   * @desc:卡片内容渲染函数
   * @param {XMerchandise[]} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: XMerchandise[]): React.ReactNode[] => {
    return dataArr.map((item: any) => {
      return (
        <AppCard
          className="card"
          current={item}
          key={item.id}
          showOperation={true}
          operation={renderOperation}
          handleBuyApp={handleBuyAppFun}
        />
      );
    });
  };
  return (
    <div className={`${cls['app-wrap']} ${cls['market-public-wrap']}`} ref={parentRef}>
      {current?.market.name.includes('公益') && <WelfareMarket />}
      {!current?.market.name.includes('公益') && (
        <CardOrTable<XMerchandise>
          key={key}
          dataSource={[]}
          stripe
          headerTitle={current?.market.name}
          parentRef={parentRef}
          renderCardContent={renderCardFun}
          operation={renderOperation}
          columns={marketColumns}
          rowKey={'id'}
          params={{ id: current?.market.id }}
          request={async (page) => {
            return await current?.getMerchandise(page);
          }}
        />
      )}

      <MerchandiseDetail
        open={isProduce}
        title="应用详情"
        onClose={() => setIsProduce(false)}
        data={merchandise}
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
