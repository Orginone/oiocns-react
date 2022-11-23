import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';

import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardComp';
import { MarketTypes } from 'typings/marketType';
import type { ProColumns } from '@ant-design/pro-components';
interface AppShowCompType {
  list: any[];
  queryFun?: Function;
  searchParams: { status: ststusTypes };
  columns: ProColumns<any>[];
  toolBarRender?: () => React.ReactNode;
  renderOperation?: any; //渲染操作按钮
  headerTitle?: string; //表格头部文字
  style?: React.CSSProperties;
}
type ststusTypes = 'all' | 'created' | 'purchased' | 'shared' | 'allotted';

const AppShowComp: React.FC<AppShowCompType> = ({
  queryFun,
  list,
  searchParams,
  columns,
  headerTitle,
  toolBarRender,
  renderOperation,
  style,
}) => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<ststusTypes>('all');

  const parentRef = useRef<any>(null); //父级容器Dom

  useEffect(() => {
    console.log('变化', searchParams);

    if (searchParams.status === status) {
      return;
    }
    setStatus(searchParams.status);
    list.map((item) => {
      console.log('item', item);
    });
    //TODO: 其他条件 发出请求
    // if (Object.keys(searchParams).length == 0) {
    //   return;
    // }
    // getTableList(searchParams, '', true);
  }, [searchParams]);

  /**
   * handlePageChage
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    queryFun && queryFun({ page, pageSize });
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
    <div className={cls['app-wrap']} ref={parentRef} style={style}>
      <CardOrTable<MarketTypes.ProductType>
        dataSource={list}
        total={total}
        page={page}
        stripe
        headerTitle={headerTitle}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        columns={columns}
        onChange={handlePageChange}
        rowKey={(record: any) => record.prod.id}
        toolBarRender={toolBarRender}
      />
    </div>
  );
};

export default AppShowComp;
