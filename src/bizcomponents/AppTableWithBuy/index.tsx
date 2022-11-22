import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';

import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardOfBuy';
import { MarketServiceType } from '@/module/appstore/market';
import { IdPage } from '@/module/typings';
import { MarketTypes } from 'typings/marketType';
import { sleep } from '@/store/sleep';
import type { ProColumns } from '@ant-design/pro-components';

interface AppShowCompType {
  className: string;
  headerTitle: string;
  list: any[];
  queryFun: Function;
  // service: MarketServiceType;
  columns: ProColumns<any>[];
}

const AppShowComp: React.FC<AppShowCompType> = ({
  list,
  queryFun,
  className,
  headerTitle,
  columns,
}) => {
  // const [list, setList] = useState<MarketTypes.ProductType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const parentRef = useRef<any>(null); //父级容器Dom

  /**
   * @desc: 获取展示列表
   * @param {string} searchKey 搜索关键词
   * @param {boolean} isGofirst 是否返回第一页
   * @return {*}
   */
  // const getTableList = async (req = {}, searchKey = '', isGofirst = false) => {
  //   if (isGofirst) {
  //     setPage(1);
  //   }
  //   if (!service.PUBLIC_STORE.id) {
  //     // 防止页面刷新时,数据请求缓慢造成数据缺失问题
  //     await sleep(100);
  //   }

  //   const params = {
  //     id: service.PUBLIC_STORE.id,
  //     page: isGofirst ? 1 : page,
  //     pageSize: 10,
  //     filter: searchKey,
  //   };

  //   await service.getList<IdPage>({ ...params, ...req });
  //   setList([...service.List]);
  //   setTotal(service.Total);
  // };

  /**
   * @desc: 页码切换函数
   * @param {number} page
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    queryFun({ page, pageSize });
  };

  /**
   * @desc: 处理购买 函数
   * @param {'buy' | 'join'} type
   * @param {MarketTypes.ProductType} selectItem
   * @return {*}
   */
  const handleBuyAppFun = (type: 'buy' | 'join', selectItem: any) => {
    console.log('购买', type, selectItem.name, selectItem.id);
  };
  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'buy',
        label: '购买',
        onClick: () => {
          console.log('按钮事件', 'buy', item);
        },
      },
      {
        key: 'toBuyCar',
        label: '加入购物车',
        onClick: () => {
          console.log('按钮事件', 'toBuyCar', item);
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          console.log('按钮事件', 'detail', item);
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
        page={page}
        onChange={handlePageChange}
        rowKey={'id'}
      />
    </div>
  );
};

export default AppShowComp;
