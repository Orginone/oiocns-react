import React, { useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardOfBuy';
import { common } from 'typings/common';
import type { ProColumns } from '@ant-design/pro-components';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import ProductDetailModal from '@/components/ProductDetailModal';
import BuyCustomModal from './BuyCustomModal';
import { MarketTypes } from 'typings/marketType';

interface AppShowCompType {
  className: string;
  headerTitle: string;
  list: any[];
  queryFun: Function;
  total?: number;
  currentPage?: number;
  // service: MarketServiceType;
  columns: ProColumns<any>[];
}

const AppShowComp: React.FC<AppShowCompType> = ({
  list,
  queryFun,
  className,
  headerTitle,
  columns,
  total,
  currentPage,
}) => {
  // const [list, setList] = useState<MarketTypes.ProductType[]>([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [isProduce, setIsProduce] = useState<boolean>(false); // 查看详情
  const [data, setData] = useState<any>({});
  const [isBuy, setIsBuy] = useState<boolean>(false); // 立即购买弹窗
  const parentRef = useRef<any>(null); //父级容器Dom
  const [nowBuy, setNowBuy] = useState<any>([]); // 立即购买
  /**
   * @desc: 页码切换函数
   * @param {number} page
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageChange = (page: number, pageSize: number) => {
    // setPage(page);
    console.log('开始', page);
    queryFun({ page, pageSize });
  };

  /**
   * @desc: 处理购买 函数
   * @param {'buy' | 'join'} type
   * @param {MarketTypes.ProductType} selectItem
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
  const renderOperation = (item: MarketTypes.ProductType): common.OperationType[] => {
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
          setData(item);
        },
      },
    ];
  };

  /**
   * @desc:卡片内容渲染函数
   * @param {MarketTypes.ProductType[]} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: MarketTypes.ProductType[]): React.ReactNode[] => {
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
    <div className={`${cls['app-wrap']} ${className}`} ref={parentRef}>
      <CardOrTable
        dataSource={list}
        total={total}
        stripe
        headerTitle={headerTitle}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        columns={columns}
        page={currentPage || page}
        onChange={handlePageChange}
        rowKey={'id'}
      />
      <ProductDetailModal
        open={isProduce}
        title="应用详情"
        onClose={onClose}
        data={data}
      />
      <BuyCustomModal
        open={isBuy}
        title="确认订单"
        onOk={OnBuyShoping}
        onCancel={onCancel}
        content="此操作将生成交易订单。是否确认"
      />
    </div>
  );
};

export default AppShowComp;
