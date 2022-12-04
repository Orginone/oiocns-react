import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';

import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardComp';
import type { ProColumns } from '@ant-design/pro-components';
import { BaseProduct } from '@/ts/core/market';
interface AppShowCompType {
  list: any[];
  queryFun?: Function;
  searchParams?: any | { status: ststusTypes };
  columns: ProColumns<any>[];
  toolBarRender?: () => React.ReactNode;
  renderOperation?: any; //渲染操作按钮
  headerTitle?: string; //表格头部文字
  style?: React.CSSProperties;
  [key: string]: any;
}
type ststusTypes = '全部' | '创建的' | '购买的' | '共享的' | '分配的';

const AppShowComp: React.FC<AppShowCompType> = ({
  queryFun,
  list,
  searchParams,
  columns,
  headerTitle,
  toolBarRender,
  renderOperation,
  style,
  ...rest
}) => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [dataSource, setSataSource] = useState(list);

  const parentRef = useRef<any>(null); //父级容器Dom

  useEffect(() => {
    if (!searchParams || !list?.length) {
      return;
    }

    if (searchParams.status === '全部') {
      setTotal(list.length);
      setSataSource([...list]);
    } else {
      const result = list.filter((item) => {
        return item?._prod?.source === searchParams.status;
      });
      setTotal(result.length);
      setSataSource([...result]);
    }
    //TODO: 其他条件 发出请求
    // if (Object.keys(searchParams).length == 0) {
    //   return;
    // }
    // getTableList(searchParams, '', true);
  }, [searchParams, list]);

  /**
   * handlePageChage
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    queryFun && queryFun({ page, pageSize });
  };

  // 卡片内容渲染函数
  const renderCardFun = (dataArr: BaseProduct[]): React.ReactNode[] => {
    return dataArr.map((item: BaseProduct) => {
      console.log('卡片数据', item);

      return (
        <AppCard
          className="card"
          data={item._prod}
          key={item._prod.id}
          defaultKey={{
            name: 'name',
            size: 'price',
            type: 'source',
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
      <CardOrTable<BaseProduct>
        dataSource={dataSource}
        total={total}
        page={page}
        // pageSize={2}
        stripe
        headerTitle={headerTitle}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        columns={columns}
        onChange={handlePageChange}
        rowKey={(record: BaseProduct) => record._prod?.id || 'id'}
        toolBarRender={toolBarRender}
        {...rest}
      />
    </div>
  );
};

export default AppShowComp;
