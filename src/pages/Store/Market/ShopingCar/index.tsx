import React, { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import CardOrTable from '@/components/CardOrTableComp';
import TitleButton from './TitleButton';
import cls from './index.module.less';

/**
 * @description: 购物车
 * @return {*}
 */

const ShopingCar: React.FC = () => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项

  /**
   * @description: table表头配置项
   * @return {*}
   */
  const columns: ColumnsType<any> = [
    {
      title: '商品名称',
      dataIndex: 'typeName',
    },
    {
      title: '商品信息',
      dataIndex: 'code',
    },
    {
      title: '售卖权属',
      dataIndex: 'name',
    },
    {
      title: '使用期限',
      dataIndex: 'createTime',
    },
    {
      title: '售卖价格',
      dataIndex: 'createTime',
    },
    {
      title: '数量',
      dataIndex: 'createTime',
    },
    {
      title: '市场名称',
      dataIndex: 'createTime',
    },
    {
      title: '市场编号',
      dataIndex: 'createTime',
    },
  ];

  /**
   * @description: table复选框配置项
   * @return {*}
   */
  const rowSelection = {
    type: 'checkbox',
    hideSelectAll: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKey(selectedRows);
    },
  };
  console.log('被勾选中的项', selectedRowKey);

  return (
    <React.Fragment>
      <TitleButton />
      <div className={cls['shoping-car']}>
        <CardOrTable
          dataSource={[]}
          rowKey={'id'}
          hideOperation={true}
          columns={columns as any}
          rowSelection={rowSelection}
        />
      </div>
    </React.Fragment>
  );
};

export default ShopingCar;
