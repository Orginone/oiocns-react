import React, { useEffect, useMemo, useState } from 'react';
import { ProColumns } from '@ant-design/pro-components';
import cls from './index.module.less';
import { Dropdown } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { PageShowType } from 'typings/globelType';
import { PageModel } from '@/ts/base/model';
import { RiMoreFill } from 'react-icons/ri';

interface PageType<T> {
  dataSource: T[]; // 展示数据源
  rowKey: string | ((record: T, index?: any) => string); //唯一key
  parentRef?: any; // 父级容器ref-用于计算高度
  defaultPageType?: PageShowType; //当前展示类型 card: 卡片; list: 列表
  showChangeBtn?: boolean; //是否展示 图列切换按钮
  hideOperation?: boolean; //是否展示 默认操作区域
  columns?: ProColumns<any>[]; //表格头部数组
  height?: number; //表格高度
  width?: number; //表格高度
  stripe?: boolean; // 斑马纹
  style?: React.CSSProperties; // wrap样式加载 对表格外部margin pading 等定制展示
  onRow?: (record: T) => any;
  onChange?: (page: number, pageSize: number) => void; // 弹出切换页码事件
  operation?: (item: T) => any[]; //操作区域数据

  renderCardContent?: (
    dataArr: T[], //渲染卡片样式 Data保持与dataSource 类型一致;或者直接传进展示组件
  ) => React.ReactNode | React.ReactNode[] | React.ReactElement;
  request?: (params: PageModel & { [key: string]: any }) => Promise<
    | {
        result: T[] | undefined;
        offset: number;
        limit: number;
        total: number;
      }
    | undefined
  >;

  [key: string]: any; // 其他属性方法
}

const Index: <T extends unknown>(props: PageType<T>) => React.ReactElement = ({
  defaultPageType = 'table',
  showChangeBtn = true,
  dataSource = [],
  columns = [],
  rowKey,
  hideOperation = false,
  operation,
  height,
  width,
  parentRef,
  stripe = false,
  style,
  onRow,
  onChange,
  renderCardContent,
  headerTitle,
  request,
  ...rest
}) => {
  const [defaultHeight, setDefaultHeight] = useState<number | 'auto'>('auto'); //计算高度

  // 监听父级高度
  useEffect(() => {
    if (parentRef?.current) {
      let _height = parentRef.current.offsetHeight;
      setDefaultHeight(_height > 200 ? _height - (headerTitle ? 154 : 136) : 200);
    }
  }, [parentRef]);

  /**
   * @desc: 渲染表格主体
   * @return {表格主体头部数组}
   */
  const resetColumns: ProColumns<any>[] = useMemo(() => {
    let result = [...columns];
    if (operation) {
      result.push({
        title: '操作',
        width: 100,
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_text, record) => {
          const items = operation(record);
          return items && items.length > 0 ? (
            [
              <Dropdown
                className={cls['operation-btn']}
                menu={{ items: items }}
                key="key">
                <RiMoreFill />
              </Dropdown>,
            ]
          ) : (
            <></>
          );
        },
      });
    }
    return result;
  }, [columns, operation]);

  // 表格主体 卡片与表格切换功能--增加缓存
  const renderTable = useMemo(() => {
    return (
      <ProTable
        className={cls['common-table']}
        columns={hideOperation ? columns : resetColumns}
        scroll={{ x: width && width > 100 ? width : 1000, y: height || defaultHeight }}
        search={false}
        headerTitle={headerTitle}
        rowKey={rowKey}
        pagination={{
          defaultPageSize: 10,
          size: 'default',
          showSizeChanger: true,
          defaultCurrent: 1,
          onChange: (_) => {},
          showTotal: (total: number) => `共 ${total} 条`,
        }}
        options={false}
        onRow={onRow}
        params={{ filter: '' }}
        request={async (params) => {
          const {
            current: pageIndex = 1,
            pageSize = 10,
            filter = '',
            keyword = '',
            ...other
          } = params;
          if (request) {
            const page: PageModel = {
              filter: filter || keyword,
              limit: pageSize,
              offset: (pageIndex - 1) * pageSize,
            };
            const res = await request(other ? { ...other, ...page } : page);
            if (res) {
              return {
                total: res.total || 0,
                data: res.result || [],
                success: true,
              };
            }
            return { total: 0, data: [], success: true };
          } else {
            return {
              data:
                dataSource.length > 0
                  ? dataSource.slice((pageIndex - 1) * pageSize, pageSize * pageIndex)
                  : [],
              total: dataSource.length,
              success: true,
            };
          }
        }}
        tableRender={(props: any, defaultDom, { toolbar }) => {
          return <div>{defaultDom}</div>;
        }}
        rowClassName={
          stripe
            ? (_record: any, index: number) => {
                return index % 2 !== 0 ? cls['stripe'] : '';
              }
            : ''
        }
        {...rest}
      />
    );
  }, [dataSource, resetColumns, defaultHeight]);

  return (
    <div className={cls['common-table-wrap']} style={style}>
      {renderTable}
    </div>
  );
};

export default Index;
