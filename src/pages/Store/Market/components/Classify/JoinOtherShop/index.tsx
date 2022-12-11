import React, { useState } from 'react';
import { Modal, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SearchInput from '@/components/SearchInput';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';

/**
 * @description: 加入商店
 * @return {*}
 */

interface Iprops {
  title: string;
  width?: number;
  open: boolean;
  onOk: (val: any) => void;
  onCancel: () => void;
  onChange: any;
  dataSource: any;
  value?: string;
}

const JoinOtherShop: React.FC<Iprops> = ({
  title,
  width,
  open,
  onOk,
  onCancel,
  onChange,
  dataSource,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]);
  /**
   * @description: 表单配置项
   * @return {*}
   */
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      fixed: 'left',
      width: 50,
      render: (_key: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '商店名称',
      dataIndex: 'name',
    },
    {
      title: '商店编码',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '商店归属',
      dataIndex: 'belongId',
    },
    {
      title: '商店创建',
      dataIndex: 'createUser',
    },
    {
      title: '商店简介',
      dataIndex: 'remark',
      ellipsis: true,
      render: (remark: string, _record: any) => (
        <Tooltip autoAdjustOverflow={true}>{remark}</Tooltip>
      ),
    },
  ];

  /**
   * @description: 搜索
   * @return {*}
   */
  const search = <SearchInput placeholder="请输入商店编码" onChange={onChange} />;

  /**
   * @description: table复选框配置项
   * @return {*}
   */
  const rowSelection = {
    type: 'radio',
    hideSelectAll: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKey(selectedRows);
    },
  };

  /**
   * @description: 成功的回调
   * @return {*}
   */
  const onOkJion = () => {
    onOk && onOk(selectedRowKey);
  };

  /**
   * @description: 表格
   * @return {*}
   */
  const table = (
    <CardOrTable
      dataSource={dataSource ?? []}
      rowKey="id"
      showChangeBtn={false}
      hideOperation={true}
      columns={columns as any}
      rowSelection={rowSelection}
      tableAlertRender={false}
    />
  );

  return (
    <div className={cls['join-content']}>
      <Modal
        title={title}
        centered
        open={open}
        onOk={onOkJion}
        onCancel={onCancel}
        width={width ?? 900}
        destroyOnClose={true}
        getContainer={false}>
        <div className={cls['join-shop-search']}>{search}</div>
        {table}
      </Modal>
    </div>
  );
};

export default JoinOtherShop;
