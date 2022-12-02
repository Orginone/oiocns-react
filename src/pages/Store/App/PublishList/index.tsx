import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardComp';
import { MarketTypes } from 'typings/marketType';
// import useDebounce from '@/hooks/useDebounce';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
interface PublishListType {
  appId: string;
}

const PublishListComp: React.FC<PublishListType> = ({ appId }) => {
  const [list, setList] = useState<MarketTypes.ProductType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const { state } = useLocation();

  console.log('路由参数', state);

  const parentRef = useRef<any>(null); //父级容器Dom

  useEffect(() => {}, []);

  /**
   * handlePageChage
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
  };
  // // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'detail',
        label: '查看详情',
        onClick: () => {
          console.log('按钮事件', 'detail', item);
        },
      },
      {
        key: 'unpublish',
        label: '下架应用',
        onClick: () => {
          console.log('按钮事件', 'unpublish', item);
        },
      },
    ];
  };
  // 卡片内容渲染函数
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
          operation={renderOperation}
        />
      );
    });
  };
  return (
    <div className={cls['appPublish-wrap']} ref={parentRef}>
      <CardOrTable<MarketTypes.ProductType>
        dataSource={list}
        total={total}
        page={page}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        headerTitle="应用上架列表"
        // columns={service.getPublishColumns()}
        onChange={handlePageChange}
        rowKey={'id'}
        toolBarRender={() => [
          <Button
            type="link"
            key="2"
            onClick={() => {
              console.log(77);
            }}>
            返回
          </Button>,
        ]}
      />
    </div>
  );
};

export default PublishListComp;
