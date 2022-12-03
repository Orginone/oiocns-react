import React, { useEffect, useMemo, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
/* eslint-disable no-unused-vars */
import cls from './index.module.less';
import { Dropdown, Pagination } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconFont } from '@/components/IconFont';
import { EllipsisOutlined } from '@ant-design/icons';
import { MarketTypes } from 'typings/marketType';
import { PageShowType } from 'typings/globelType';

interface PageType<T> {
  dataSource: T[]; // 展示数据源
  rowKey: string | ((record: T) => string); //唯一key
  parentRef?: any; // 父级容器ref-用于计算高度
  defaultPageType?: PageShowType; //当前展示类型 card: 卡片; list: 列表
  showChangeBtn?: boolean; //是否展示 图列切换按钮
  hideOperation?: boolean; //是否展示 默认操作区域
  columns?: ProColumns<any>[]; //表格头部数组
  total?: number; // 总条数 总数量
  page?: number; // 当前页
  pageSize?: number;
  height?: number; //表格高度
  width?: number; //表格高度
  stripe?: boolean; // 斑马纹
  style?: React.CSSProperties; // wrap样式加载 对表格外部margin pading 等定制展示
  onChange?: (page: number, pageSize: number) => void; // 弹出切换页码事件
  operation?: (item: T) => MarketTypes.OperationType[]; //操作区域数据
  renderCardContent?: (
    dataArr: T[], //渲染卡片样式 Data保持与dataSource 类型一致;或者直接传进展示组件
  ) => React.ReactNode | React.ReactNode[] | React.ReactElement;
  [key: string]: any; // 其他属性方法
}

const Index: <T extends unknown>(props: PageType<T>) => React.ReactElement = ({
  defaultPageType,
  showChangeBtn = true,
  dataSource = [],
  columns = [],
  rowKey,
  hideOperation = false,
  operation,
  total,
  page,
  pageSize,
  height,
  width,
  parentRef,
  stripe = false,
  style,
  onChange,
  renderCardContent,
  headerTitle,
  ...rest
}) => {
  const [pageType, setPageType] = useState<PageShowType>(defaultPageType || 'table'); //切换设置
  const [defaultHeight, setDefaultHeight] = useState<number | 'auto'>('auto'); //计算高度
  // console.log('dayin', dataSource);

  // 监听父级高度
  useEffect(() => {
    setTimeout(() => {
      if (parentRef?.current) {
        let _height = parentRef.current.offsetHeight;
        // let width = parentRef.current.offsetWidth;
        console.log('展示高度', _height);
        setDefaultHeight(_height > 100 ? _height - (headerTitle ? 164 : 116) : 100);
      }
    }, 50);
  }, [parentRef]);

  /**
   * @desc: 操作按钮区域
   * @param {any} item - 表格单条数据 data
   * @return {Menu} - 渲染 按钮组
   */
  const menu = (item: any) => {
    return operation && operation(item); // <Menu items={operation && operation(item)} />;
  };
  /**
   * @desc: 渲染表格主体
   * @return {表格主体头部数组}
   */
  const resetColumns: ProColumns<any>[] = useMemo(() => {
    return [
      ...columns,
      {
        title: '操作',
        width: 80,
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_text, record) => {
          return operation && operation(record).length > 0
            ? [
                <Dropdown
                  className={cls['operation-btn']}
                  menu={{ items: menu(record) }}
                  key="key">
                  <EllipsisOutlined />
                </Dropdown>,
              ]
            : '';
        },
      },
    ];
  }, [columns, operation]);
  // 表格主体 卡片与表格切换功能--增加缓存
  const renderTable = useMemo(() => {
    return pageType === 'table' ? (
      <ProTable
        className={cls['common-table']}
        columns={hideOperation ? columns : resetColumns}
        dataSource={dataSource}
        scroll={{ x: width && width > 100 ? width : 1000, y: height || defaultHeight }}
        search={false}
        headerTitle={headerTitle}
        rowKey={rowKey || 'key'}
        pagination={false}
        options={false}
        // options={{
        //   setting: {
        //     listsHeight: 400,
        //   },
        // }}
        rowClassName={
          stripe
            ? (_record: any, index: number) => {
                return index % 2 !== 0 ? cls['stripe'] : '';
              }
            : ''
        }
        {...rest}
      />
    ) : (
      <>
        {headerTitle ? <div className="card-title">{headerTitle}</div> : ''}
        <div
          className={cls['common-card']}
          style={{
            height: defaultHeight !== 'auto' ? defaultHeight + 57 + 'px' : defaultHeight,
          }}>
          {renderCardContent && renderCardContent(dataSource)}
        </div>
      </>
    );
  }, [pageType, dataSource, operation, resetColumns, defaultHeight]);
  /**
   * @desc: 自定义表格 底部区域
   * @return {底部组件}
   */
  const renderFooter = () => {
    return (
      <div className={cls['common-table-footer']}>
        {/* 切换展示形式 */}
        <div className={cls['btn-box']}>
          {showChangeBtn ? (
            <>
              <IconFont
                className={pageType === 'table' ? 'active' : ''}
                type={'icon-chuangdanwei'}
                onClick={() => {
                  setPageType('table');
                }}
              />
              <IconFont
                className={pageType === 'card' ? 'active' : ''}
                type={'icon-jianyingyong'}
                onClick={() => {
                  setPageType('card');
                }}
              />
            </>
          ) : (
            ''
          )}
        </div>
        {/* 翻页功能 */}
        <Pagination
          total={total || 0}
          onChange={onChange}
          current={page || 1}
          showTotal={(total: number) => `共 ${total} 条`}
          showSizeChanger
        />
      </div>
    );
  };

  return (
    <div className={cls['common-table-wrap']} style={style}>
      {renderTable} {renderFooter()}
    </div>
  );
};

export default Index;
