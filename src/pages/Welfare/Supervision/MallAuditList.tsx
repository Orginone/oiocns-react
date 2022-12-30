import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import { nanoid } from '@ant-design/pro-utils';
import { Modal, Space } from 'antd';
import React, { useState } from 'react';
import { DataType } from 'typings/globelType';
import { supervisionCreateMallColumns } from '../config/columns';
import MallCreateAuditBill from './MallCreateAuditBill';

/**
 * 平台(监管方)审核：公益组织创建或者加入的商城列表
 */
const SupervisionMallAuditList: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  const statusList = [
    { tab: '全部', key: '1' },
    { tab: '待办', key: '2' },
    { tab: '已办', key: '3' },
  ];

  const tableOperation = (item: any) => {
    return [
      {
        key: 'view',
        label: '查看',
        onClick: () => {
          setIsModalOpen(true);
        },
      },
      {
        key: 'approve',
        label: '通过',
        onClick: () => {
          console.log(item);
        },
      },
      {
        key: 'refuse',
        label: '驳回',
        onClick: () => {
          console.log(item);
        },
      },
    ];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PageCard
        title={
          <div style={{ fontSize: '16px' }}>
            <b>商城列表</b>
          </div>
        }
        tabList={statusList}
        activeTabKey={activeKey}
        onTabChange={(key: string) => {
          setActiveKey(key as string);
        }}>
        <CardOrTableComp
          rowKey={(record) => record?.id || nanoid()}
          bordered={false}
          columns={supervisionCreateMallColumns}
          dataSource={[{ id: '1', name: 'sdsd' }]} // TODO request 根据条件查询
          operation={(item) => tableOperation(item)}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
              );
            },
          }}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a>批量通过</a>
                <a>批量驳回</a>
                <a>暂存勾选</a>
              </Space>
            );
          }}
        />
      </PageCard>{' '}
      <Modal
        title="公益商城信息"
        open={isModalOpen}
        width={900}
        onOk={handleOk}
        onCancel={handleCancel}>
        <MallCreateAuditBill />
      </Modal>
    </>
  );
};

export default SupervisionMallAuditList;
