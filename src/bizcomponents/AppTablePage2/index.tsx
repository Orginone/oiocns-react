import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AppCard from '@/components/AppCardComp';
import type { ProColumns } from '@ant-design/pro-components';
import { IProduct } from '@/ts/core';
import useCtrl from '@/ts/controller/setting';
interface AppShowCompType {
  tkey?: string;
  list: IProduct[];
  queryFun?: Function;
  searchParams?: { status: string };
  columns: ProColumns<any>[];
  toolBarRender?: () => React.ReactNode;
  renderOperation?: any; //渲染操作按钮
  headerTitle?: string; //表格头部文字
  style?: React.CSSProperties;
  [key: string]: any;
}

const AppShowComp: React.FC<AppShowCompType> = ({
  tkey,
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
  const parentRef = useRef<any>(null); //父级容器Dom
  const [data, setData] = useState<IProduct[]>([]);
  useEffect(() => {
    switch (searchParams?.status) {
      case '创建的':
        setData(
          list.filter(
            (a) => a.prod.source == '创建的' && a.prod.belongId == useCtrl.space.id,
          ),
        );
        break;
      case '购买的':
        setData(
          list.filter(
            (a) => a.prod.source == '购买的' && a.prod.belongId == useCtrl.space.id,
          ),
        );
        break;
      case '共享的':
        setData(list.filter((a) => a.prod.belongId != useCtrl.space.id));
        break;
      case '可用的':
        break;
      default:
        setData(list);
        break;
    }
  }, [list, searchParams]);

  // 卡片内容渲染函数
  const renderCardFun = (dataArr: IProduct[]): React.ReactNode[] => {
    return dataArr.map((item: IProduct) => {
      return (
        <AppCard
          className="card"
          data={item}
          key={item.prod.id}
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
    <div
      className={cls['app-wrap']}
      ref={parentRef}
      style={style}
      key={searchParams?.status + '12'}>
      <CardOrTable<IProduct>
        dataSource={data}
        stripe
        headerTitle={headerTitle}
        parentRef={parentRef}
        renderCardContent={renderCardFun}
        operation={renderOperation}
        columns={columns}
        rowKey={(record: any) => record?.prod?.id}
        toolBarRender={toolBarRender}
        {...rest}
      />
    </div>
  );
};

export default AppShowComp;
