import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardComp';
import type { ProColumns } from '@ant-design/pro-components';
import { XProduct } from '@/ts/base/schema';
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
  // const [dataSource, setSataSource] = useState<any[]>([]);

  const parentRef = useRef<any>(null); //父级容器Dom
  useEffect(() => {
    // setSataSource([...list.map((v) => v.prod)]);
    setTotal(list.length);
  }, [list]);

  // useEffect(() => {
  //   if (!list?.length) {
  //     return;
  //   }

  //   if (!searchParams || searchParams.status === '全部') {
  //     setTotal(list.length);
  //     setSataSource([...list]);
  //   } else {
  //     const result = list.filter((item) => {
  //       return item?.source === searchParams.status;
  //     });
  //     setTotal(result.length);
  //     setSataSource([...result]);
  //   }
  // }, [searchParams, list]);

  /**
   * handlePageChage
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    console.log('切换页码', page, pageSize);

    // queryFun && queryFun({ page, pageSize });
  };

  // 卡片内容渲染函数
  const renderCardFun = (dataArr: XProduct[]): React.ReactNode[] => {
    return dataArr.map((item: XProduct) => {
      return (
        <AppCard
          className="card"
          data={item}
          key={item.id}
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
      <CardOrTable<XProduct>
        dataSource={list}
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
        rowKey={(record: any) => record.id}
        toolBarRender={toolBarRender}
        {...rest}
      />
    </div>
  );
};

export default React.memo(AppShowComp);
