import React from 'react';
import { Modal } from 'antd';
import SearchInput from '@/components/SearchInput';
import CardOrTable from '@/components/CardOrTableComp';
import { columns } from './config';
import cls from './index.module.less';

/**
 * @description: 加入商店
 * @return {*}
 */

interface Iprops {
  title: string;
  width?: number;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const JoinOtherShop: React.FC<Iprops> = ({ title, width, open, onOk, onCancel }) => {
  const onChange = () => {};

  /**
   * @description: 搜索
   * @return {*}
   */
  const search = <SearchInput placeholder="请输入商店编码" onChange={onChange} />;

  /**
   * @description: 表格
   * @return {*}
   */
  const table = (
    <CardOrTable
      dataSource={[]}
      rowKey="id"
      showChangeBtn={false}
      hideOperation={true}
      columns={columns as any}
    />
  );

  /**
   * @description: 弹窗
   * @return {*}
   */
  const modal = (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={width ?? 900}
      getContainer={false}>
      <div className={cls['join-shop-search']}>{search}</div>
      {table}
    </Modal>
  );
  return <div className={cls['join-content']}>{modal}</div>;
};

export default JoinOtherShop;
